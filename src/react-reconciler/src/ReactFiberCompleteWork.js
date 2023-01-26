import logger from 'shared/logger';
import {HostText} from 'react-reconcile/src/ReactWorkTags';
import {createTextInstance} from 'react-dom-bindings/src/ReactDOMHostConfig';
import {NoFlags} from 'react-reconcile/src/ReactFiberFlags';

/**
 * 完成一个fiber节点
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
export function completeWork(current, workInProgress) {
  logger('completeWork', workInProgress);
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostText:
      const newText = newProps;
      workInProgress.stateNode = createTextInstance(newText);
      bubbleProperties(workInProgress);
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
