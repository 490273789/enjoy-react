import { FiberRoot } from "./ReactInternalTypes";
import { Container } from "ReactDOMHostConfig";
import { createFiberRoot } from "./ReactFiberRoot";
import { ReactNodeList } from "shared/ReactTypes";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

type OpaqueRoot = FiberRoot;

/**
 * 创建容器
 * @param containerInfo 容器的真实dom
 * @returns
 */
export function createContainer(containerInfo: Container): OpaqueRoot {
  return createFiberRoot(containerInfo);
}

/**
 * 渲染流程流程
 * 1. 创建一个update，并传入ReactElement作为更新的内容
 * 2. 将update放入Fiber的updateQueue中
 * 3. 调度更新
 * @param element 需要更新的ReactElement
 * @param container 要更新的容器对象
 */
export function updateContainer(element: ReactNodeList, container: OpaqueRoot) {
  const current = container.current;

  const update = createUpdate();

  update.payload = { element };

  const root = enqueueUpdate(current, update);

  if (root !== null) {
    scheduleUpdateOnFiber(root);
  }
}
