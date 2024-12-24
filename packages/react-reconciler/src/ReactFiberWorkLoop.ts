import { FiberRoot } from "./ReactInternalTypes";
import { scheduleCallback } from "scheduler";

// const workInProgress: FiberRoot | null = null;
let workInProgressRoot: FiberRoot | null = null;

export function scheduleUpdateOnFiber(root: FiberRoot) {
  ensureRootIsScheduled(root);
}
// Use this function to schedule a task for a root. There's only one task per root;
// if a task was already scheduled, we'll check to make sure the priority
// of the existing task is the same as the priority of the next level that the
// root has work on. This function is called on every update, and right before
// exiting a task.
export function ensureRootIsScheduled(root: FiberRoot) {
  console.log("[ ensureRootIsScheduled ] >", ensureRootIsScheduled);
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
}

function prepareFreshStack(root: FiberRoot) {
  workInProgressRoot = root;
}
