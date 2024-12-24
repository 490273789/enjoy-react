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
) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFIber() {
  return createFiber(HostRoot, null, null);
}
