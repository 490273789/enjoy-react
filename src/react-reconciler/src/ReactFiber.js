import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from './ReactWorkTags';
import {NoFlags} from './ReactFiberFlags';

// 每种虚拟DOM都会有自己Fiber Tag类型
function FiberNode(tag, pendingProps, key) {
  this.tag = tag; // fiber的类型：根元素 - 3，函数组件 - 0
  this.key = key; // 唯一标识
  this.type = null; //Fiber类型，来自于虚拟DOM的type - div、span...
  this.stateNode = null; //此fiber对应的真实DOM节点

  this.return = null; // 指向父节点
  this.child = null; // 指向子节点
  this.sibling = null; // 指向下一个兄弟节点
  // 虚拟DOM提供pendingProps用来创建fiber节点的属性
  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每个fiber节点都有自己的状态，每种状态fiber状态存的类型是不一样的
  // 类的fiber存的是类的实例状态，hostRoot存的是要渲染的元素
  this.memoizedState = null;
  this.updateQueue = null; // fiber的更新队列

  // 副作用标识
  this.flags = NoFlags;
  // 子节点的副作用标识
  this.subtreeFlags = NoFlags;
  // 双缓存的替身
  this.alternate = null;

  this.index = 0;
}
function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
} // 根Fiber的tag类型

export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
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
 * 更具虚拟DOM创建Fiber节点
 * @param element
 */
export function createFiberFromElement(element) {
  const {type, key, props: pendingProps} = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;
  if (typeof type === 'string') {
    // span div,fiber类型是原生组件
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText(content) {
  const fiber = createFiber(HostText, content, null);
  return fiber;
}
