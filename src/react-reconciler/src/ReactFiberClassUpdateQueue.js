import {markUpdateLaneFromFiberToRoot} from './ReactFiberConcurrentUpdates';
import assign from 'shared/assign';

export const UpdateState = 0;

/**
 * 给每个fiber初始化一个更新队列
 * @param {*} fiber fiber节点
 */
export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null, // 指向一个循环列表的最新的update
    },
  };
  fiber.updateQueue = queue;
}

/**
 * 创建一个更新
 * @returns {{tag: number}}
 */
export function createUpdate() {
  const update = {tag: UpdateState};
  return update;
}

/**
 * 添加到更新队列
 * @param {*} fiber
 * @param {*} update 需要更新的内容
 * @returns
 */
export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    // 第一次更新，自己指向自己
    update.next = update;
  } else {
    // 当前update的next指向第一个update
    update.next = pending.next;
    // 然后让原来队列的最后一个的next指向新的update
    pending.next = update;
  }
  // fiber的pending指向新的update（最后一个更新节点）
  updateQueue.shared.pending = update;
  // 返回根节点，从当前节点一直到根节点
  return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新队列中的更新计算新的状态
 * @param {*} fiber 要计算的fiber
 */
export function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    // 循环链表最后一个指向第一个update
    const firstPendingUpdate = lastPendingUpdate.next;
    // 剪断循环链表
    lastPendingUpdate.next = null;
    // 计算新的状态
    let newState = fiber.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    fiber.memoizedState = newState;
  }
}

function getStateFromUpdate(update, preState) {
  switch (update.tag) {
    case UpdateState:
      const {payload} = update;
      return assign({}, preState, payload);
    default:
      return preState;
  }
}
// let fiber = {memoizedState: {id: 1}};
// initialUpdateQueue(fiber);
//
// let update1 = createUpdate();
// update1.payload = {name: 'wsn'};
// enqueueUpdate(fiber, update1);
//
// let update2 = createUpdate();
// update2.payload = {age: '16'};
// enqueueUpdate(fiber, update2);
//
// let update3 = createUpdate();
// update3.payload = {sex: '男'};
// enqueueUpdate(fiber, update3);
// //  基于老的状态计算新的状态
// processUpdateQueue(fiber);
//
// console.log(fiber);
