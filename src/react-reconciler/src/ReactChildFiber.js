import {REACT_ELEMENT_TYPE} from "shared/ReactSymbols";
import {createFiberFromElement, createFiberFromText} from "./ReactFiber";
import {Placement} from "react-reconcile/src/ReactFiberFlags";
import isArray from "shared/isArray";

/**
 * 创建子组件的协调器
 * @param shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  /**
   * 协调单个节点
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstFiber 当前fiber的第一个子fiber， 初次挂在是null
   * @param {*} element 当前fiber的子ReactElement
   * @returns 新创建的子fiber
   */
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // TODO: 初次渲染直接创建
    // 根据虚拟DOM创建fiber
    const create = createFiberFromElement(element);
    // 将创建好的fiber节点的return指向父fiber
    create.return = returnFiber;
    return create;
  }

  /**
   * 单个子节点 - 设置副作用
   * @param newFiber
   * @returns {*} fiber
   */
  function placeSingleChild(newFiber) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 要在最后提交阶段插入此节点 React渲染分成渲染（创建fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  /**
   * 多个子节点 - 记录fiber的位置以及fiber的副作用
   * @param {*} newFiber
   * @param {*} newIdx
   */
  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx; // 当前是第几个子元素
    if (shouldTrackSideEffects) {
      // 父fiber如果是初次挂载，shouldTrackSideEffects为false，不需要添加flags
      // 完成阶段会将所有子节点添加到自己身上
      newFiber.flags |= Placement;
    }
  }

  /**
   * 根据不同类型的虚拟DOM创建不同类型的fiber
   * @param {*} returnFiber 父fiber
   * @param {*} newChild 子虚拟DOM
   * @returns {*} 子fiber
   */
  function createChild(returnFiber, newChild) {
    // 如果是文本类型
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    // 如果使react元素类型
    if (typeof newChild === "object" && newChild !== null) {
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

  /**
   * 多个子fiber，比较子fiber DOM-DIFF 就是用当前的子fiber链表和新的虚拟DOM进行比较
   * 将兄弟节点用sibling连接
   * @param {*} returnFiber 新的Fiber
   * @param {*} currentFirstFiber 当前的fiber的第一个子fiber
   * @param {*} newChildren 新fiber的虚拟DOM
   * @returns {*} fiber链表
   */
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null; // 第一个新儿子
    let previousNewFiber = null; // 记录上一个fiber，目的是与下一个sibling连接
    let newIdx = 0; // 记录children的长度
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue; // 如果不是文本节点，也不是react元素跳过
      placeChild(newFiber, newIdx);
      if (previousNewFiber === null) {
        // 如果没有previousNewFiber说明是第一个fiber(大儿子)
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  /**
   * 比较子Fibers - DOM-DIFF 用当前的子fiber链表和新的子fiber进行对比
   * @param returnFiber 新的Fiber
   * @param currentFirstFiber 当前fiber第一个子fiber
   * @param newChild 新fiber的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    // TODO:现在只考虑新节点只有一个的情况
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild),
          );
        default:
          break;
      }
      // 子节点不止一个
      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
      }
    }
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      return null;
    }
    return null;
  }
  return reconcileChildFibers;
}

// 当前有挂在的fiber，更新
export const reconcileChildFibers = createChildReconciler(true);

// 当前没有已挂载fiber，初次挂载
export const mountChildFibers = createChildReconciler(false);
