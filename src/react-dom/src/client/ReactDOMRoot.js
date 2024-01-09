import {
  createContainer,
  updateContainer,
} from 'react-reconcile/src/ReactFiberReconciler';
import {listenToAllSupportedEvents} from 'react-dom-bindings/src/events/DOMPluginEventSystem';

/**
 *
 * @param {FiberRootNode} internalRoot = {containerInfo: div#root} 一个真实的dom节点
 */
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

// 渲染组件
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = ''; // 更新容器前清空根节点下的内容
  updateContainer(children, root); // 更新容器
};

/**
 * 创建跟容器
 * @param {*} container 根节点 div#root
 * @returns FiberRootNode
 */
export function createRoot(container) {
  // FiberRootNode root = {containerInfo: div#root} 一个真实的dom节点
  const root = createContainer(container);
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
