import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { Fiber } from "./ReactInternalTypes";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
import { ReactElement } from "shared/ReactElementType";
import {
  createFiberFromElement,
  createFiberFromText,
  createWorkInProgress,
} from "./ReactFiber";
// import isArray from "shared/isArray";
import { HostText } from "./ReactWorkTags";

/**
 * 挂载 or 协调 子节点
 * @param shouldTrackSideEffects 是否跟踪副作用
 * @returns
 */
function ChildReconciler(shouldTrackSideEffects: boolean) {
  /**
   * 给WIP fiber添加“删除”的flag
   * @param returnFiber WIP fiber
   * @param childToDelete 需要删除的Fiber
   * @returns void
   */
  function deleteChild(returnFiber: Fiber, childToDelete: Fiber) {
    if (!shouldTrackSideEffects) return;
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  /**
   * 删除剩余的Fiber，遍历一遍兄弟节点即可
   * 没有删除的动作，只是添加删除的flag
   * @param returnFiber WIP
   * @param currentFirstChild 已挂载的fiber
   * @returns null
   */
  function deleteRemainingChildren(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
  ) {
    // 第一次挂载，不存在删除操作
    if (!shouldTrackSideEffects) return null;
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  /**
   * 用当前的Fiber 克隆一个Fiber
   * @param fiber
   * @param pendingProps
   * @returns
   */
  function useFiber(fiber: Fiber, pendingProps: any) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  /**
   * 给当前fiber添加Placement（插入）操作的 标识
   * @param newFiber 新的Fiber
   * @returns 新的Fiber
   */
  function placeSingleChild(newFiber: Fiber) {
    // 在节点的第二次渲染会用到，因为第二次渲染需要更新，但是没有替身
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  /**
   * 处理单节点
   * @param returnFiber WIP fiber
   * @param currentFirstChild 已挂载fiber的第一个子fiber
   * @param element workInProcess的子ReactElement
   */
  function reconcileSingleElement(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    element: ReactElement,
  ) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (
          child.elementType === elementType ||
          (typeof elementType === "object" && elementType !== null)
        ) {
          // key相同 elementType相同，并且是单节点的情况，可以删除掉其他的兄弟节点了
          deleteRemainingChildren(returnFiber, child.sibling);
          // 复用fiber，处理结束
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        }
        // 没有匹配到则直接删除所有的子节点
        deleteRemainingChildren(returnFiber, child);
        break; // key相同，则不需要继续根据key匹配了，直接退出循环即可
      } else {
        // key不同，先删除当前这个child，再继续比较兄弟节点
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  /**
   * 处理单文本节点
   * @param returnFiber WIP fiber
   * @param currentFirstChild 已挂载的fiber
   * @param textContent 文本内容
   * @returns 文本fiber
   */
  function reconcileSingleTextNode(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    textContent: string,
  ) {
    // There's no need to check for keys on text nodes since we don't have a
    // way to define them.
    if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
      // We already have an existing node so let's just update it and delete
      // the rest.
      deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
      // 相同的类型的fiber可以复用
      const existing = useFiber(currentFirstChild, textContent);
      existing.return = returnFiber;
      return existing;
    }
    // The existing first child is not a text node so we need to create one
    // and delete the existing ones.
    deleteRemainingChildren(returnFiber, currentFirstChild);
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    return created;
  }

  /**
   * 协调子Fiber
   * 1. 初始化阶段，将ReactElement转化为Fiber
   * 2. 更新阶段进行DOM Diff
   * @param returnFiber WIP fiber
   * @param currentFirstChild 当前已挂载节点的子节点
   * @param newChild Wip的子 ReactElement
   * @returns WIP的子Fiber
   */
  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
  ) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild),
          );
      }

      // if (isArray(newChild)) {
      //   return reconcileChildrenArray();
      // }
    }

    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild);
    }

    // Remaining case are all treated as empty.
    return deleteRemainingChildren(returnFiber, currentFirstChild);
  }
  return reconcileChildFibers;
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildrenFibers = ChildReconciler(false);

export function cloneChildFibers() {}
