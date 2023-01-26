import {
  createContainer,
  updateContainer,
} from 'react-reconcile/src/ReactFiberReconciler';

function ReactDOMRoot(internalRoot) {
  // FiberRootNode实例
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;
  updateContainer(children, root);
};
export function createRoot(container) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
