import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';
import {createFiberFromElement, createFiberFromText} from './ReactFiber';
import {Placement} from 'react-reconcile/src/ReactFiberFlags';
import isArray from 'shared/isArray';

/**
 *
 * @param shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    const create = createFiberFromElement(element);
    create.return = returnFiber;
    return create;
  }

  /**
   * 设置副作用
   * @param newFiber
   * @returns {*}
   */
  function placeSingleChild(newFiber) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 要在最后提交阶段插入此节点 React渲染分成渲染（创建fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }
  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number'
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
  }

  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      // 父fiber如果是初次挂载，shouldTrackSideEffects为false，不需要添加flags
      newFiber.flags |= Placement;
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null; // 返回第一个新儿子
    let previousNewFiber = null; // 上一个的新的fiber
    let newIdx = 0;
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      if (previousNewFiber === null) {
        // 如果没有previousNewFiber说明是第一个fiber(大儿子)
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      // 让newFiber成为最新一个fiber
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  /**
   * 比较子Fibers - DOM-DIFF
   * @param returnFiber 新的父Fiber
   * @param currentFirstFiber 老fiber第一个fiber
   * @param newChild 新的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          break;
      }

      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
      }
    }
    if (
      (typeof newChild === 'string' && newChild !== '') ||
      typeof newChild === 'number'
    ) {
      return null;
    }
    return null;
  }
  return reconcileChildFibers;
}

// 有老父fiber
export const reconcileChildFibers = createChildReconciler(true);

// 没有老父fiber，初次挂载
export const mountChildFibers = createChildReconciler(false);
