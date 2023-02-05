import {
  createContainer,
  updateContainer,
} from 'react-reconcile/src/ReactFiberReconciler';
import {listenToAllSupportedEvents} from 'react-dom-bindings/src/events/DOMPluginEventSystem';

function ReactDOMRoot(internalRoot) {
  // FiberRootNode实例
  this._internalRoot = internalRoot;
}

// 渲染组件
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = '';
  updateContainer(children, root);
};

// 创建跟容器
export function createRoot(container) {
  const root = createContainer(container);
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
