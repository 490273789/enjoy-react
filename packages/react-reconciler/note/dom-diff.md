# diff algorithm

- React 最为核心的就是 Virtual DOM 和 Diff 算法。React 在内存中维护一颗虚拟 DOM 树，当数据发生改变时（state & props），会自动的更新虚拟 DOM，获得一个新的虚拟 DOM 树，然后通过 Diff 算法，比较新旧虚拟 DOM 树，找出最小的有变化的部分，将这个变化的部分（Patch）加入队列，最终批量的更新这些 Patch 到实际的 DOM 中。

- 传统 diff 算法其时间复杂度最优解是 O(n^3)，那么如果有 1000 个节点，则一次 diff 就将进行 10 亿次比较，这显然无法达到高性能的要求。而 React 通过大胆的假设，并基于假设提出相关策略，成功的将 O(n^3) 复杂度的问题转化为 O(n) 复杂度的问题。

## DOM DIFF的三个假设

- 同级元素进行比较
- 不同的type对应不同的元素：type不同直接删除
- 可以通过key来复用节点

## 单节点diff

- 新节点只有一个，旧节点可能有多个

1. 比较节点的type是否相同

## 多节点diff

### diff 实现

- 同级比较
  - 单节点diff：newChild类型为object、number、string，代表同级只有一个节点
  - 多节点diff：newChild类型为Array，同级有多个节点

#### 单节点diff

1. 判断key是否相同，如果key相同判断type是否相同，都相同节点可以复用。
2. 当key相同且type不同时，说明没有可复用，将child极其sibling全部删除
3. 当key不同时，将当前节点标记删除，继续比较兄弟节点

> tip: 当key不同时，只代表当前节点不能复用，后面兄弟节点还有复用的可能性。所以标记删除当前节点

#### 多节点diff

同级多节点diff要处理的只有4种情况

1. 节点更新（可复用）
2. 节点移动（可复用）
3. 节点新增
4. 节点删除

以上四种情况种，更新的优先级是最高的，因为组件发生更新的频率最高，所以算法会最先判断节点是否属于更新

> tip: react 为什么不实用双指针遍历：虽然新的newChildren是数组，但老节点的fiber链表，同级的节点是通过sibling指针链接的单链表，不支持双指针。

##### 第一轮比遍历

1. let i = 0, 遍历newChildren，将newChildren[i]与oldFiber比较，判断DOM节点是否可复用
2. 如果可复用，i++, 继续比较newChildren[i]与oldFiber.sibling,可以复用则继续遍历
3. 如果不可复用，分两种情况：
   1. key不同，立即跳出遍历，第一轮结束
   2. key相同，type不同，将oldFiber标记为删除，继续遍历
4. 如果newChildren遍历完成或者oldFiber遍历完成，跳出循环，第一轮结束

结束遍历后会出现下面两种结果：

1. 步骤3跳出循环：说明newChildren没有遍历完，oldFiber也没有遍历完成
2. 步骤4跳出循环：
   - newChildren遍历完成、oldFiber遍历完成
   - newChildren遍历完成、oldFiber没有遍历完成
   - newChildren没有遍历完成、oldFiber遍历完成

##### 第二轮遍历

1. newChildren与oldFiber同时遍历完成
   - diff结束
2. newChildren没完成，oldFiber完成
   - 遍历剩下的newChildren，将生成的fiber标记为Placement
3. newChildren遍历完，oldFiber没有完成
   - 遍历剩下的oldFiber，一次标记为Deletion
4. newChildren和oldFiber都没有遍历完成
   - 需要处理节点移动的情况，这个是diff算法的精髓

##### 第三轮遍历

> 移动的思想：如果当前节点在集合中的位置，比老节点在集合中的位置靠前的话，是不会影响后续节点的操作的，不动。

- lastPlaceIndex：当前遍历到最后一个可复用的 Fiber 在旧节点中的索引位置，初始为0，这个位置的复用是不用移动的，如果后续可复用的就节点的索引小于或等于这个索引，那么就需要这个旧的节点向右移动，移动后这个lastPlaceIndex值更新为这个可复用节点的索引
- 遍历新节点，每个节点有两个index，一个表示它在旧节点上的位置oldIndex，一个表示表示新节点在遍历中找到旧节点的位置maxIndex
  - 当oldIndex > maxIndex，将maxIndex = oldIndex
  - 当oldIndex === maxIndex， 不操作
  - 当oldIndex < maxIndex, 将节点移动到maxIndex的位置

### 对对对

1. 第一轮遍历
   - 如果key不同则直接结束本轮循环
   - new Children 或oldFiber 遍历完，结束本次循环
   - key相同而type不同，标记老的oldFiber为删除，继续循环
   - key相同，type也相同，则可以复用老oldFiber节点，继续循环

2. 第二轮遍历
   - newChildren遍历完 而 oldFiber还有，剩下所有的oldFiber标记为删除，DIFF结束。
   - newChildren还有 而 oldFiber遍历完，将剩下的newChildren标记为插入，DIFF结束。
   - newChildren和oldFiber都同时遍历完成，diff结束。
   - newChildren和oldFiber都没有完成，则进行节点移动的逻辑。

3. 第三轮遍历
   - 处理节点移动的情况
   - 设置两个指针，oldIndex 老节点的位置
   - lastPlaceIndex，新节点复用的老节点的位置
   - 如果当前复用oldIndex < lastPlaceIndex，则当前复用的老节点需要向右移动，同时 lastPlaceIndex = oldIndex
   - 如果当前复用oldIndex > lastPlaceIndex，怎当前复用的老节点不需要移动，同时lastPlaceIndex = oldIndex
   - 如果oldIndex === lastPlaceIndex，无需操作
