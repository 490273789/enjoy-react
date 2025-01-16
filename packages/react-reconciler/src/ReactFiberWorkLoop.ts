import { Fiber, FiberRoot } from "./ReactInternalTypes";
import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";

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
  if (workInProgressRoot) return;
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

// This is the entry point for every concurrent task, i.e. anything that
// goes through Scheduler.
export function performConcurrentWorkOnRoot(root: FiberRoot) {
  renderRootSync(root);
}

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

/**
 * 根据 根fiber 创建它的alternate
 * @param root Fiber的根
 * @returns 返回根的WIP
 */
function prepareFreshStack(root: FiberRoot): Fiber {
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current, null);
  workInProgress = rootWorkInProgress;

  return rootWorkInProgress;
}

/** 同步更新的工作循环 */
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行工作单元
 * @param unitOfWork 一个工作单元（WIP fiber），
 */
function performUnitOfWork(unitOfWork: Fiber) {
  const current = unitOfWork.alternate;
  const next: Fiber | null = beginWork(current, unitOfWork);
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
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
