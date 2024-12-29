import { Fiber } from "./ReactInternalTypes";
import { HostRoot, WorkTag } from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";

function FiberNode(
  this: Fiber,
  tag: WorkTag,
  pendingProps: any,
  key: string | null,
) {
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  // 不同fiber他的值是不一样的类型，比如原生组件：div，函数组件： 函数本身
  this.type = null;
  this.stateNode = null;

  this.return = null;
  this.sibling = null;
  this.child = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  this.deletions = null;
  this.alternate = null;
}

export function createFiber(
  tag: WorkTag,
  pendingProps: any,
  key: string | null,
): Fiber {
  return new FiberNode(tag, pendingProps, key);
}

/** 创建跟fiber */
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

/**
 * 创建将要新的fiber
 * @param current 当前正在生效的fiber
 * @param pendingProps 将要生效的props
 * @returns 新的fiber
 */
export function createWorkInProgress(current: Fiber, pendingProps: any) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.elementType = current.elementType;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;

  return workInProgress;
}
