import {createFiberRoot} from 'react-reconcile/src/ReactFiberRoot';
import {createUpdate, enqueueUpdate} from './ReactFiberClassUpdateQueue';
import {scheduleUpdateOnFiber} from './ReactFiberWorkLoop';

/**
 * 创建容器
 * @param {*} containerInfo 容器
 * @returns
 */
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容器
 * @param element 子元素的虚拟DOM
 * @param container 根节点 FiberRootNode.containerInfo = div#root
 */
export function updateContainer(element, container) {
  // 根fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();
  // 需要更新的虚拟DOM
  update.payload = {element}; // h1
  // 把更新添加到根fiber的更新队列上
  const root = enqueueUpdate(current, update);
  scheduleUpdateOnFiber(root);
}
