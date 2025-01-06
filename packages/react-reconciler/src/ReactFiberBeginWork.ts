import { mountChildrenFibers, reconcileChildFibers } from "./ReactChildFiber";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { Fiber } from "./ReactInternalTypes";
import { HostRoot, HostText } from "./ReactWorkTags";

/**
 * 协调子节点，判断走“挂载”流程还是 “更新”流程
 * @param current 当前挂载的节点
 * @param workInProgress 将要挂载的节点
 * @param nextChildren 将要挂载节点的子节点的 子 ReactElement
 */
function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
) {
  if (current === null) {
    workInProgress.child = mountChildrenFibers(
      workInProgress,
      null,
      nextChildren,
    );
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
    );
  }
}

// function mountIndeterminateComponent(
//   _current: Fiber | null,
//   workInProgress: Fiber,
//   Component: any,
// ) {}

/**
 * 更新函数组件
 * @param current
 * @param workInProgress
 * @param Component
 * @param nextProps
 */
// function updateFunctionComponent(
//   current: Fiber | null,
//   workInProgress: Fiber,
//   Component: any,
//   nextProps: any,
// ) {}

/**
 * 更新根fiber
 * @param current
 * @param workInProgress
 */
function updateHostRoot(current: Fiber | null, workInProgress: Fiber) {
  if (current === null) {
    throw new Error("Should have a current fiber. This is a bug in React.");
  }
  processUpdateQueue(workInProgress); // 将update 收集更新到memoizedState上
  const nextState = workInProgress.memoizedState;
  // render(<App />) render函数传入的ReactElement，在updateContainer的时候复制给的update
  const nextChildren = nextState.element;
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 更新原生组件类型的fiber
 * @param current
 * @param workInProgress
 */
// function updateHostComponent(current: Fiber | null, workInProgress: Fiber) {}

/**
 * 更新文本类型的fiber
 * @param current
 * @param workInProgress
 * @returns
 */
function updateHostText(current: Fiber | null, workInProgress: Fiber) {
  if (current !== null) {
    console.log("[ workInProgress ] >", workInProgress);
  }
  return null;
}

function beginWork(current: Fiber | null, workInProgress: Fiber): Fiber | null {
  switch (workInProgress.tag) {
    // case IndeterminateComponent: {
    //   return mountIndeterminateComponent(
    //     current,
    //     workInProgress,
    //     workInProgress.type,
    //   );
    // }
    // case FunctionComponent:
    //   const Component = workInProgress.type;
    //   const unresolvedProps = workInProgress.pendingProps;
    //   const resolvedProps =
    //     workInProgress.elementType === Component
    //       ? unresolvedProps
    //       : resolveDefaultProps(Component, unresolvedProps);
    //   return updateFunctionComponent(
    //     current,
    //     workInProgress,
    //     Component,
    //     resolvedProps,
    //   );
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    // case HostComponent:
    //   return updateHostComponent(current, workInProgress);
    case HostText:
      return updateHostText(current, workInProgress);
  }

  throw new Error(
    `Unknown unit of work tag (${workInProgress.tag}). This error is likely caused by a bug in React. Please file an issue.`,
  );
}

export { beginWork };
