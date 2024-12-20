import { createRoot as createRootImpl } from "./";

export function createRoot(container: Element | Document | DocumentFragment) {
  return createRootImpl(container);
}
