import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from './ReactWorkTags';
import {NoFlags} from './ReactFiberFlags';

// 每种虚拟DOM都会有自己Fiber Tag类型
function FiberNode(tag, pendingProps, key) {
  this.tag = tag; // fiber的标签：根元素 - 3，函数组件 - 0
  this.key = key; // 唯一标识，我们传入的
  this.type = null; // fiber类型，来自于虚拟DOM的type - div、span...
  // 每个虚拟DOM-> Fiber节点 -> 真实DOM
  this.stateNode = null; // 此fiber对应的真实DOM节点

  this.return = null; // 指向父节点
  this.child = null; // 指向子节点
  this.sibling = null; // 指向下一个兄弟节点
  // 虚拟DOM提供pendingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每个fiber节点都有自己的状态，每种fiber 状态存的类型是不一样的
  // 类组件的fiber存的是类的实例状态，hostRoot存的是要渲染的元素
  this.memoizedState = null;

  this.updateQueue = null; // fiber中值的更新队列

  this.flags = NoFlags; // 自身的副作用标识
  // 18.2以前会收集effects，18.2以后删除了这个机制
  this.subtreeFlags = NoFlags; // 子节点的副作用标识，性能优化字段，比如如果这个字段是0，那么标识子节点没有副作用，就不需要处理子节点的副作用了
  this.alternate = null; // 双缓存的替身

  this.index = 0;
}

/**
 * 创建一个fiber节点
 * @param {*} tag 每种不同的虚拟DOM都会有不同的tag标记（函数组件 类组件 原生组件 根元素）
 * @param {*} pendingProps 新的属性，等待处理的属性
 * @param {*} key 唯一标识，比如写循环的时候我们传入的key
 * @returns 一个fiber节点
 */
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

/**
 * 创建根Fiber节点
 * @returns 返回根fiber节点
 */
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
} // 根Fiber的tag类型

/**
 * 基于当前fiber或新的属性创建新的fiber
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 * @returns
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    // 创建新fiber
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    // 更新fiber
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}

/**
 * 根据虚拟DOM创建Fiber节点
 * @param element 虚拟DOM
 * @returns fiber
 */
export function createFiberFromElement(element) {
  const {type, key, props: pendingProps} = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

/**
 * 根据虚拟DOM的Type和Props创建fiber
 * @param {*} type fiber的类型
 * @param {*} key 唯一属性
 * @param {*} pendingProps 新的props
 * @returns fiber
 */
function createFiberFromTypeAndProps(type, key, pendingProps) {
  // 初始为不确定的tag
  let tag = IndeterminateComponent;
  if (typeof type === 'string') {
    // span div的fiber类型是原生组件（标签）
    tag = HostComponent;
  }
  // 创建fiber
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText(content) {
  const fiber = createFiber(HostText, content, null);
  return fiber;
}
