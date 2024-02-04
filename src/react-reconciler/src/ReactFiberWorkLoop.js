import {scheduleCallback} from 'scheduler';
import {createWorkInProgress} from 'react-reconcile/src/ReactFiber';
import {beginWork} from './ReactFiberBeginWork';
import {completeWork} from './ReactFiberCompleteWork';
import {
  MutationMask,
  NoFlags,
  Placement,
  Update,
} from 'react-reconcile/src/ReactFiberFlags';
import {commitMutationEffectsOnFiber} from './ReactFiberCommitWork';
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from 'react-reconcile/src/ReactWorkTags';
import {finishQueueingConcurrentUpdates} from './ReactFiberConcurrentUpdates';

let workInProgress = null;
let workInProgressRoot = null;

/**
 * 计划更新root
 * @param {*} root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  if (workInProgressRoot) return;
  workInProgressRoot = root;
  // 告诉浏览器要执行此函数
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 根据虚拟DOM创建fiber树，要创建真实的DOM节点，还需要把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // debugger;
  // 第一次以同步的方式渲染根节点，初次渲染的时候都是同步的，为了更快的给用户展现
  renderRootSync(root);
  // 提交阶段，执行副作用，修改真实DOM
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
  workInProgressRoot = null;
}

function commitRoot(root) {
  const {finishedWork} = root;
  printFinishedWork(finishedWork);
  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;
  if (subtreeHasEffect || rootHasEffect) {
    commitMutationEffectsOnFiber(finishedWork, root);
  }
  root.current = finishedWork;
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  finishQueueingConcurrentUpdates();
}

function renderRootSync(root) {
  //  开始构建fiber树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  // 获取新fiber对应的老fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建，获取子元素，创建子元素的fiber，返回这个fiber
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // 执行完成
    completeUnitOfWork(unitOfWork);
  } else {
    // 没有完成继续循环，让子节点成为下一个工作单元
    workInProgress = next;
  }
}

/**
 * 完成工作单元
 * @param unitOfWork
 */
function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // 执行此fiber的完成工作
    completeWork(current, completedWork);
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有兄弟节点则说明当前是最后一个节点了，说明父节点也完成了
    // 当返回到root节点的时候completedWork和workInProgress都为null
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}

function printFinishedWork(fiber) {
  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }

  if (fiber.flags !== 0) {
    console.log(getFlags(fiber.flags), getTag(fiber.tag), fiber.memoizedProps);
  }
}

function getTag(tag) {
  switch (tag) {
    case HostRoot:
      return 'HostRoot';
    case HostComponent:
      return 'HostComponent';
    case HostText:
      return 'HostText';
    case FunctionComponent:
      return 'FunctionComponent';
    default:
      return tag;
  }
}
function getFlags(flags) {
  if (flags === Placement) {
    return '插入';
  } else if (flags === Update) {
    return '更新';
  }
  return flags;
}
