import logger from 'shared/logger';
import {
  HostComponent,
  HostRoot,
  HostText,
} from 'react-reconcile/src/ReactWorkTags';
import {
  createTextInstance,
  createInstance,
  appendInitialChild,
  finalInitialChild,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import {NoFlags} from 'react-reconcile/src/ReactFiberFlags';

/**
 * 将fiber的所有子节点对应的真实节点挂在到自己的DOM上
 * @param parent 真实DOM
 * @param workInProgress DOM对应的fiber
 */
export function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      node = node.child;
      return;
    }

    if (node === workInProgress) {
      return;
    }

    while (node.sibling === null) {
      if (node.return === null || node === workInProgress) return;
      node = node.return;
    }
    node = node.sibling;
  }
}

/**
 * 完成一个fiber节点
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
export function completeWork(current, workInProgress) {
  logger('completeWork', workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      const {type} = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalInitialChild(instance, type, newProps);
      bubbleProperties(workInProgress);
      break;
    case HostText:
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
      break;
  }
}

/**
 * 收集子节点的副作用
 * @param completedWork
 */
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags; // 子节点的子节点
    subtreeFlags |= child.flags; // 子节点
    child = child.sibling;
  }
  completedWork.subtreeFlags = subtreeFlags;
}
