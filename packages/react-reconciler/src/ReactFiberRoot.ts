import { Container } from "ReactDOMHostConfig";
import { FiberRoot } from "./ReactInternalTypes";
import { initializedUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { createHostRootFIber } from "./ReactFiber";

/** 根Fiber的节点类 */
function FiberRootNode(this: FiberRoot, containerInfo: Container) {
  this.containerInfo = containerInfo;
}

/** 创建根fiber节点 */
export function createFiberRoot(containerInfo: Container): FiberRoot {
  const root: FiberRoot = new FiberRootNode(containerInfo);
  const uninitializedFiber = createHostRootFIber();
  root.current = uninitializedFiber;

  uninitializedFiber.stateNode = root;

  initializedUpdateQueue(uninitializedFiber);

  return root;
}
