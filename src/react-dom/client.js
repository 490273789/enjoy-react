import {createRoot as createRootImpl} from './src/client/ReactDOMRoot';

export function createRoot(container) {
  return createRootImpl(container);
}
