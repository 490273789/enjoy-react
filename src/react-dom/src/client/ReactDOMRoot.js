import {
  createContainer,
  updateContainer,
} from 'react-reconcile/src/ReactFiberReconciler';
import {listenToAllSupportEvents} from 'react-dom-bindings/src/events/DOMPluginEventSystem';

function ReactDOMRoot(internalRoot) {
  // FiberRootNode实例
  this._internalRoot = internalRoot;
}

// 渲染组件
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};

// 创建跟容器
export function createRoot(container) {
  const root = createContainer(container);
  listenToAllSupportEvents(container);
  return new ReactDOMRoot(root);
}
