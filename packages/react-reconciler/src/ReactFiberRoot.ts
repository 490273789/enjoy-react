import { Container } from "ReactDOMHostConfig";
import { FiberRoot } from "./ReactInternalTypes";

/** 根Fiber的节点类 */
function FiberRootNode(this: any, containerInfo: Container) {
  this.containerInfo = containerInfo;
}

/** 创建根fiber节点 */
export function createFiberRoot(containerInfo: Container): FiberRoot {
  const root: FiberRoot = new FiberRootNode(containerInfo);
  return root;
}
