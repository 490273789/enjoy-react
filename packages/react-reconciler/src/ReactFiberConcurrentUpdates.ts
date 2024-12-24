import { Fiber, FiberRoot } from "./ReactInternalTypes";
import { HostRoot } from "./ReactWorkTags";

/**
 * 向后兼容的方法，concurrent模式不在调用此方法，调用此方的时候应该给出警告
 * Calling this function outside this module should only be done for backwards
 * compatibility and should always be accompanied by a warning.
 * @param sourceFiber
 * @returns
 */
export function unsafe_markUpdateLaneFromFiberToRoot(
  sourceFiber: Fiber,
): FiberRoot | null {
  markUpdateLaneFromFiberToRoot();
  return getRootForUpdatedFiber(sourceFiber);
}

function markUpdateLaneFromFiberToRoot() {}

/**
 * 根据跟定的fiber向上遍历，找到根fiber，返回根fiber的FiberRoot
 * @param sourceFiber fiber节点
 * @returns 根FiberRoot or null
 */
function getRootForUpdatedFiber(sourceFiber: Fiber): FiberRoot | null {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? node.stateNode : null;
}
