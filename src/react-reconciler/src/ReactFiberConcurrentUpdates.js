import {HostRoot} from './ReactWorkTags';

/**
 * 找到根节点
 * @param sourceFiber
 * @returns {null|FiberRootNode|*|null}
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber; // 当前fiber
  let parent = sourceFiber.return; // 当前fiber的父节点
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  // 找到根节点
  if (node.tag === HostRoot) return node.stateNode;
  return null;
}
