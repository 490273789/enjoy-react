import type { Lane, LaneMap, Lanes } from "./ReactFiberLane";
import type { RootTag } from "./ReactRootTags";
import type { Flags } from "./ReactFiberFlags";
import type { RefObject } from "shared/ReactTypes";
import { WorkTag } from "./ReactWorkTags";
export type Fiber = {
  // These first fields are conceptually members of an Instance. This used to
  // be split into a separate type and intersected with the other Fiber fields,
  // but until Flow fixes its intersection bugs, we've merged them into a
  // single type.

  // An Instance is shared between all versions of a component. We can easily
  // break this out into a separate object to avoid copying so much to the
  // alternate versions of the tree. We put this on a single object for now to
  // minimize the number of objects created during the initial render.

  // Tag identifying the type of fiber.
  tag: WorkTag;

  // Unique identifier of this child.
  key: null | string;

  // The value of element.type which is used to preserve the identity during
  // reconciliation of this child.
  elementType: any;

  // The resolved function/class/ associated with this fiber.
  type: any;

  // The local state associated with this fiber.
  stateNode: any;

  // Conceptual aliases
  // parent : Instance -> return The parent happens to be the same as the
  // return fiber since we've merged the fiber and instance.

  // Remaining fields belong to Fiber

  // The Fiber to return to after finishing processing this one.
  // This is effectively the parent, but there can be multiple parents (two)
  // so this is only the parent of the thing we're currently processing.
  // It is conceptually the same as the return address of a stack frame.
  return: Fiber | null;

  // Singly Linked List Tree Structure.
  child: Fiber | null;
  sibling: Fiber | null;
  index: number;

  // The ref last used to attach this node.
  // I'll avoid adding an owner field for prod and model that as functions.
  ref: null | (((handle: any) => void) & { _stringRef?: string }) | RefObject;

  // Input is the data coming into process this fiber. Arguments. Props.
  pendingProps: any; // This type will be more specific once we overload the tag.
  memoizedProps: any; // The props used to create the output.

  // A queue of state updates and callbacks.
  updateQueue: any;

  // The state used to create the output
  memoizedState: any;

  // Effect
  flags: Flags;
  subtreeFlags: Flags;
  deletions: Array<Fiber> | null;

  // Singly linked list fast path to the next fiber with side-effects.
  nextEffect: Fiber | null;

  // The first and last fiber with side-effect within this subtree. This allows
  // us to reuse a slice of the linked list when we reuse the work done within
  // this fiber.
  firstEffect: Fiber | null;
  lastEffect: Fiber | null;

  lanes: Lanes;
  childLanes: Lanes;

  // This is a pooled version of a Fiber. Every fiber that gets updated will
  // eventually have a pair. There are cases when we can clean up pairs to save
  // memory if we need to.
  alternate: Fiber | null;
};

type BaseFiberRootProperties = {
  // The type of root (legacy, batched, concurrent, etc.)
  tag: RootTag;

  // Any additional information from the host associated with this root.
  containerInfo: any;
  // Used only by persistent updates.
  pendingChildren: any;
  // The currently active root fiber. This is the mutable root of the tree.
  current: Fiber;

  // A finished work-in-progress HostRoot that's ready to be committed.
  finishedWork: Fiber | null;

  // Top context object, used by renderSubtreeIntoContainer
  context: object | null;
  pendingContext: object | null;

  callbackPriority: Lane;
  eventTimes: LaneMap<number>;
  expirationTimes: LaneMap<number>;

  pendingLanes: Lanes;
  suspendedLanes: Lanes;
  pingedLanes: Lanes;
  expiredLanes: Lanes;
  mutableReadLanes: Lanes;

  finishedLanes: Lanes;

  entangledLanes: Lanes;
  entanglements: LaneMap<Lanes>;

  pooledCache: Cache | null;
  pooledCacheLanes: Lanes;

  // TODO: In Fizz, id generation is specific to each server config. Maybe we
  // should do this in Fiber, too? Deferring this decision for now because
  // there's no other place to store the prefix except for an internal field on
  // the public createRoot object, which the fiber tree does not currently have
  // a reference to.
  identifierPrefix: string;
};
export type FiberRoot = BaseFiberRootProperties;
