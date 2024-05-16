import {createFiberRoot} from "react-reconcile/src/ReactFiberRoot";
import {createUpdate, enqueueUpdate} from "./ReactFiberClassUpdateQueue";
import {scheduleUpdateOnFiber} from "./ReactFiberWorkLoop";

/**
 * 创建根容器
 * @param {*} containerInfo 根节点Root，真实DOM
 * @returns
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器
 * @param element 子元素的 ReactElement对象
 * @param container 根节点 FiberRootNode.containerInfo = div#root
 */
export function updateContainer(element, container) {
  // 根节点fiber
  const current = container.current;
  // 创建一个update对象
  const update = createUpdate();
  // 需要更新的ReactElement对象
  update.payload = {element};
  // 把创建的update对象添加到根fiber的updateQueue上， 返回根节点
  const root = enqueueUpdate(current, update);
  scheduleUpdateOnFiber(root);
}
