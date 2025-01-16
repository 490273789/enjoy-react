import { Container } from "ReactDOMHostConfig";
import type { FiberRoot } from "./ReactInternalTypes";
import { initializedUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { createHostRootFiber } from "./ReactFiber";

/** 根Fiber的节点类 */
function FiberRootNode(this: FiberRoot, containerInfo: Container) {
  this.containerInfo = containerInfo;
}

/**
 * 创建fiber的根节点
 * 1. 创建FiberRootNode
 * 2. 创建HostRootFiber
 * 3. FiberRootNode.current 指向HostRootFiber
 * 4. HostRootFiber.stateNode 指向 FiberRootNode
 * 5. 初始化 HostRootFiber 的更新队列
 * @param containerInfo div#root
 * @returns
 */
export function createFiberRoot(containerInfo: Container): FiberRoot {
  const root: FiberRoot = new FiberRootNode(containerInfo);

  const uninitializedFiber = createHostRootFiber();

  root.current = uninitializedFiber;

  uninitializedFiber.stateNode = root;

  initializedUpdateQueue(uninitializedFiber);

  return root;
}
