import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type { Fiber } from "./ReactInternalTypes";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
import type { ReactElement } from "shared/ReactElementType";
import {
  createFiberFromElement,
  createFiberFromText,
  createWorkInProgress,
} from "./ReactFiber";
import isArray from "shared/isArray";
import { HostText } from "./ReactWorkTags";

function throwOnInvalidObjectType(newChild: object) {
  const childString = Object.prototype.toString.call(newChild);

  throw new Error(
    `Objects are not valid as a React child (found: ${
      childString === "[object Object]"
        ? "object with keys {" + Object.keys(newChild).join(", ") + "}"
        : childString
    }). ` +
      "If you meant to render a collection of children, use an array " +
      "instead.",
  );
}

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

  function placeChild(
    newFiber: Fiber,
    lastPlacedIndex: number,
    newIdx: number,
  ) {
    newFiber.index = newIdx;
    if (!shouldTrackSideEffects) {
      return lastPlacedIndex;
    }
    return lastPlacedIndex;
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

  function createChild(returnFiber: Fiber, newChild: any) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      // Text nodes don't have keys. If the previous node is implicitly keyed
      // we can continue to replace it without aborting even if it is not a text
      // node.
      const created = createFiberFromText("" + newChild);
      created.return = returnFiber;
      return created;
    }

    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
      }
      throwOnInvalidObjectType(newChild);
    }
    return null;
  }

  /**
   * DOM-DIFF
   * 当有多个子节点
   * 1. 初始化：创建子fiber，返回第一个子fiber
   * 2. 更新：将新的ReactElement与当前的子Fiber进行对比
   * @param returnFiber WIP fiber
   * @param currentFirstChild 当前已挂在fiber的子fiber
   * @param newChildren 将要挂载的ReactElement数组
   * @return 子fiber链表
   */
  function reconcileChildrenArray(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChildren: any[],
  ) {
    // This algorithm can't optimize by searching from both ends since we
    // don't have backpointers on fibers. I'm trying to see how far we can get
    // with that model. If it ends up not being worth the tradeoffs, we can
    // add it later.
    // Even with a two ended optimization, we'd want to optimize for the case
    // where there are few changes and brute force the comparison instead of
    // going for the Map. It'd like to explore hitting that path first in
    // forward-only mode and only go for the Map once we notice that we need
    // lots of look ahead. This doesn't handle reversal as well as two ended
    // search but that's unusual. Besides, for the two ended optimization to
    // work on Iterables, we'd need to copy the whole set.
    // In this first iteration, we'll just live with hitting the bad case
    // (adding everything to a Map) in for every insert/move.
    // If you change this code, also update reconcileChildrenIterator() which
    // uses the same algorithm.
    let resultingFirstChild: Fiber | null = null; // 第一个子fiber
    let previousNewFiber: Fiber | null = null;

    let oldFiber = currentFirstChild;
    let lastPlacedIndex = 0;
    let newIdx = 0;
    let nextOldFiber: Fiber | null = null;

    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      if (oldFiber.index > newIdx) {
        nextOldFiber = oldFiber;
        oldFiber = null;
      } else {
        nextOldFiber = oldFiber.sibling;
        console.log("[ nextOldFiber ] >", nextOldFiber);
      }
    }

    if (oldFiber === null) {
      // If we don't have any more existing children we can choose a fast path
      // since the rest will all be insertions.
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        if (newFiber === null) continue;
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber;
        } else {
          previousNewFiber.sibling = newFiber;
        }
        previousNewFiber = newFiber;
      }
      return resultingFirstChild;
    }
    return currentFirstChild;
  }

  /**
   * 处理 单个 文本节点 DOM-DIFF
   * 能走到这说明是独生子，没有兄弟节点的文本节点，需要对兄弟节点进行删除标记
   * 1.currentFirstChild是文本节点，从父节Fiber上删除他的其他兄弟节点，直接复用
   * 2.currentFirstChild不是文本节点，删除父Fiber上的所有子节点，创建一个新的文本节点
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
   * 处理单个Element节点 - 独生子
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
          // 进入此方法说明找到可复用的Fiber，因为是单节点，则需要删除剩余的兄弟节点
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        }
        // 找到了相同的key，但是类型不同，说明节点不能复用，则不需要继续diff了，直接删除剩余的子节点，退出diff流程
        deleteRemainingChildren(returnFiber, child);
        break;
      } else {
        // key不同，不能服用，先删除当前这个child，继续寻找可复用节点
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }
    // 走到这里说明没有可以复用的Fiber，需要创建一个新的fiber
    const created = createFiberFromElement(element);
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
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle object types
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild),
          );
      }

      // 单节点的情况处理完成，剩下的是数组（还有文本节点没处理）
      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
      }
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
