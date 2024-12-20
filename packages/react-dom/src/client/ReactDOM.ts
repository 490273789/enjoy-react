import type { RootType } from "./ReactDOMRoot";
import { createRoot as createRootImpl } from "./ReactDOMRoot";

function createRoot(
  container: Element | Document | DocumentFragment,
): RootType {
  // 这个方法主要做的事情是，在开发环境下，进行错误提示：
  // 'You are importing createRoot from "react-dom" which is not supported. ' +
  // 'You should instead import it from "react-dom/client".'
  return createRootImpl(container);
}

export { createRoot };
