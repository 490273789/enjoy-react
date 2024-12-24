import { unsafe_markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";
import { Fiber, FiberRoot } from "./ReactInternalTypes";

export type Update = {
  tag: 0 | 1 | 2 | 3;
  payload: any;
  next: Update | null;
};

export type SharedQueue = {
  pending: Update | null;
};

export type UpdateQueue = {
  shared: SharedQueue;
  effects: Array<Update> | null;
};

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

/**
 * 给一个fiber初始化一个更新队列
 * @param fiber 需要初始化更新队列的fiber
 */
export function initializedUpdateQueue(fiber: Fiber) {
  const queue: UpdateQueue = {
    shared: {
      pending: null,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}

/**
 * 创建一个update
 * @returns
 */
export function createUpdate(): Update {
  const update: Update = {
    tag: UpdateState,
    payload: null,
    next: null,
  };
  return update;
}

/**
 * 将一个update 加入到fiber的updateQueue
 * @param fiber
 * @param update
 * @returns FiberRoot | null
 */
export function enqueueUpdate(fiber: Fiber, update: Update): FiberRoot | null {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) return null;
  const sharedQueue = updateQueue.shared;
  const pending = sharedQueue.pending;

  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  sharedQueue.pending = update;
  return unsafe_markUpdateLaneFromFiberToRoot(fiber);
}

export function processUpdateQueue(fiber: Fiber) {
  const queue = fiber.updateQueue;
  const pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    lastPendingUpdate.next = null;

    let newStatus = fiber.memoizedState;
    let update = firstPendingUpdate;

    while (update !== null) {
      newStatus = getStateFromUpdate(update, newStatus);
      update = update.next;
    }
  }
}

function getStateFromUpdate(update: Update, preState: any) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return Object.assign({}, preState, payload);
    default:
      return preState;
  }
}
