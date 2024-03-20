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
  finalizeInitialChild,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig';
import {NoFlags} from 'react-reconcile/src/ReactFiberFlags';

/**
 * 将fiber的所有子节点对应的真实节点挂在到自己的DOM上
 * 由子fiber开始向上遍历
 * @param parent 真实DOM
 * @param workInProgress DOM对应的fiber
 */
export function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    // 如果子节点是一个原生节点或者是一个文本节点
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果子节点不是原生节点可能是一个函数组件节点或者类组件节点
      node = node.child;
      return;
    }

    if (node === workInProgress) {
      return;
    }
    // 在没有其他子节点的情况下也没有兄弟节点，找付父节点
    while (node.sibling === null) {
      if (node.return === null || node === workInProgress) return;
      node = node.return;
    }
    // 如果有兄弟节点继续处理兄弟节点
    node = node.sibling;
  }
}

/**
 * 完成一个fiber节点
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
export function completeWork(current, workInProgress) {
  logger(' '.repeat(indent.number) + 'completeWork', workInProgress);
  indent.number -= 2;
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      const {type} = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      // 将所有子节点挂载到自己身上
      appendAllChildren(instance, workInProgress);

      workInProgress.stateNode = instance;

      finalizeInitialChild(instance, type, newProps);
      bubbleProperties(workInProgress);
      break;
    case HostText:
      const newText = newProps;
      // 创建真实DOM节点
      workInProgress.stateNode = createTextInstance(newText);
      // 向上冒泡属性
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
    subtreeFlags |= child.subtreeFlags; // 子节点的子节点的副作用
    subtreeFlags |= child.flags; // 子节点的副作用
    child = child.sibling;
  }
  completedWork.subtreeFlags = subtreeFlags;
}
