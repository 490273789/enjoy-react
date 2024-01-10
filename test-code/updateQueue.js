function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null, // 指向一个循环列表的最新的update
    },
  };
  fiber.updateQueue = queue;
}

function createUpdate() {
  const update = {};
  return update;
}

function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  const pending = queue.shared.pending;
  if (pending !== null) {
    const lastPendingUpdate = pending;
    const firstPendingUpdate = pending.next;
    lastPendingUpdate.next = null;
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
  return {...preState, ...update.payload};
}

function enqueueUpdate(fiber, update) {
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
  // fiber的pending指向新的update（最后一个跟新节点）
  updateQueue.shared.pending = update;
}
let fiber = {memoizedState: {id: 1}};
initialUpdateQueue(fiber);

let update1 = createUpdate();
update1.payload = {name: 'wsn1'};
enqueueUpdate(fiber, update1);

let update2 = createUpdate();
update2.payload = {age: 14};
enqueueUpdate(fiber, update2);

let update3 = createUpdate();
update3.payload = {sex: '男'};
enqueueUpdate(fiber, update3);

// 基于老状态更新新状态
processUpdateQueue(fiber);
console.log(fiber.memoizedState);
