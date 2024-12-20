import type { FiberRoot } from "react-reconciler/src/ReactInternalTypes";
import { createContainer } from "react-reconciler/src/ReactFiberReconciler";
import { ReactNodeList } from "shared/ReactTypes";
export type RootType = {
  render(children: any): void;
  unmount(): void;
  _internalRoot: FiberRoot | null;
};
/** ReactDOMRoot对象, ts定义this，需要把this放到第一个参数 */
function ReactDOMRoot(this: RootType, internalRoot: FiberRoot) {
  this._internalRoot = internalRoot;
}

/**
 * children，传递给render函数的参数
 * 从这开始渲染整个应用程序的根组件
 */
ReactDOMRoot.prototype.render = function (children: ReactNodeList) {
  const root = this._internalRoot;
  root.containerInfo.innerHTML = "";
  // 开始渲染
  console.log("[ children ] >", children);
};

export function createRoot(container: Element | Document | DocumentFragment) {
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
