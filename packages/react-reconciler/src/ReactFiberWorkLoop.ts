import { Fiber, FiberRoot } from "./ReactInternalTypes";
import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

// const workInProgress: FiberRoot | null = null;
let workInProgressRoot: FiberRoot | null = null;
let workInProgress: Fiber | null = null;

export function scheduleUpdateOnFiber(root: FiberRoot) {
  ensureRootIsScheduled(root);
}
// Use this function to schedule a task for a root. There's only one task per root;
// if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.
export function ensureRootIsScheduled(root: FiberRoot) {
  console.log("[ ensureRootIsScheduled ] >", "ensureRootIsScheduled");
  if (workInProgressRoot) return;
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

// This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.
export function performConcurrentWorkOnRoot(root: FiberRoot) {
  renderRootSync(root);
}

// TODO: Over time, this function and renderRootConcurrent have become more
// and more similar. Not sure it makes sense to maintain forked paths. Consider
// unifying them again.
function renderRootSync(root: FiberRoot) {
  prepareFreshStack(root);
  do {
    try {
      workLoopSync();
      break;
    } catch (err) {
      console.warn("执行错误", err);
      workInProgress = null;
    }
  } while (true);
}

function prepareFreshStack(root: FiberRoot): Fiber {
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current, null);
  workInProgress = rootWorkInProgress;

  return rootWorkInProgress;
}

/** 同步更新的工作循环 */
function workLoopSync() {
  if (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行工作单元
 * @param unitOfWork 一个工作单元，就是一个fiber
 */
function performUnitOfWork(unitOfWork: Fiber) {
  const current = unitOfWork.alternate;
  const next: Fiber | null = beginWork(current, unitOfWork);
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  }
  {
    workInProgress = next;
  }
}

/**
 * 完成工作单元
 * @param unitOfWork 一个工作单元
 */
function completeUnitOfWork(unitOfWork: Fiber) {
  const completeWork = unitOfWork;
  console.log("[ completeWork ] >", completeWork);
}
