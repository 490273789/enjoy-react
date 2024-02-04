import logger, {indent} from 'shared/logger';
import {
  HostRoot,
  HostComponent,
  HostText,
  IndeterminateComponent,
  FunctionComponent,
} from 'react-reconcile/src/ReactWorkTags';
import {processUpdateQueue} from './ReactFiberClassUpdateQueue';
import {
  mountChildFibers,
  reconcileChildFibers,
} from 'react-reconcile/src/ReactChildFiber';
import {renderWithHooks} from './ReactFiberHooks';
import {shouldSetTextContent} from 'react-dom-bindings/src/client/ReactDOMHostConfig';

/**
 * 根据新的虚拟DOM生成新的fiber链表
 * @param current 当前的父fiber
 * @param workInProgress 新的父fiber
 * @param nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  // 如果没有老的fiber，说明此fiber是新创建的，那么他的所有子fiber都是新创建的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果有老的fiber需要做DOM-DIFF，拿老的子fiber和新的DOM进行比较，最小化更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
    );
  }
}
/**
 * 构建根fiber的子fiber链表
 * @param {*} current 当前的fiber
 * @param {*} workInProgress 新的fiber
 * @returns 第一个子节点
 */
function updateHostRoot(current, workInProgress) {
  // 需要知道他的子虚拟DOM，
  processUpdateQueue(workInProgress); //根fiber的子虚拟DOM存在 workInProgress.memoizedState={element}上
  const nextState = workInProgress.memoizedState;
  // 新的子虚拟DOM
  const nextChildren = nextState.element;
  // DOM-DIFF算法，根据新的虚拟DOM生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 挂载函数组件
 * @param current 老fiber
 * @param workInProgress 新fiber
 * @param Component 组件类型，也就是函数组件的定义
 */
function mountIndeterminateComponent(current, workInProgress, Component) {
  const props = workInProgress.pendingProps;
  // react元素
  const value = renderWithHooks(current, workInProgress, Component, props);
  workInProgress.tag = FunctionComponent;
  // 处理完成后变为fiber
  reconcileChildren(current, workInProgress, value);
  return workInProgress.child;
}

/**
 * 构建原生组件的子fiber链表
 * @param current 老的fiber
 * @param workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
  const {type} = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children; // 子fiber
  // 如果子节点是一个文本节点, 优化处理
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 根据虚拟DOM构建新的fiber链表
 * @param current 老fiber
 * @param workInProgress 新fiber
 * @returns {null}
 */
export function beginWork(current, workInProgress) {
  logger(' '.repeat(indent.number) + 'beginWork', workInProgress);
  indent.number += 2;
  switch (workInProgress.tag) {
    // 组件有两种，一种是类组件一种是函数组件，但是他们都是函数
    // 在区分两种组件之前用IndeterminateComponent代表
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type,
      );
    case HostRoot: // 根fiber
      return updateHostRoot(current, workInProgress);
    case HostComponent: // 原生组件
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
  // return null;
}
