import logger from 'shared/logger';
import {
  HostRoot,
  HostComponent,
  HostText,
} from 'react-reconcile/src/ReactWorkTags';
import {processUpdateQueue} from './ReactFiberClassUpdateQueue';
import {
  mountChildFibers,
  reconcileChildFibers,
} from 'react-reconcile/src/ReactChildFiber';

import {shouldSetTextContent} from 'react-dom-bindings/src/client/ReactDOMHostConfig';

/**
 * 根据新的虚拟DOM生成新的fiber链表
 * @param current 老的父级fiber
 * @param workInProgress 新的父fiber
 * @param nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果有老的fiber需要做DOM-DIFF，拿老的子fiber和新的DOM进行比较，最小化更新
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  // 需要知道他的子虚拟DOM，
  processUpdateQueue(workInProgress); // workInProgress.memoizedState={element}
  const nextState = workInProgress.memoizedState;
  // 新的子虚拟DOM
  const nextChildren = nextState.element;
  // DOM-DIFF算法，根据新的虚拟DOM生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 构建原生组件的子fiber列表
 * @param current 老的fiber
 * @param workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
  const {type} = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
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
  logger('beginWork', workInProgress);
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
  // return null;
}
