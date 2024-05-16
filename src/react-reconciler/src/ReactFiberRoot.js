import {createHostRootFiber} from "./ReactFiber";
import {initialUpdateQueue} from "./ReactFiberClassUpdateQueue";

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}
/**
 * 创建fiber的根节点
 * @param {*} containerInfo 容器
 * @returns FiberRootNode的实例对象
 */
export function createFiberRoot(containerInfo) {
  // 创建FiberRootNode实例
  const root = new FiberRootNode(containerInfo);
  // 创建根fiber节点
  const uninitializedFiber = createHostRootFiber();
  // 根节点的current指向根fiber
  root.current = uninitializedFiber;
  // 根fiber的stateNode指向根节点（真实DOM）
  uninitializedFiber.stateNode = root;
  initialUpdateQueue(uninitializedFiber);
  // 返回FiberRootNode实例
  return root;
}
