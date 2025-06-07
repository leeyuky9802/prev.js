import type { FiberNode, FiberRootNode } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { commitMutationEffects } from "./ReactFiberCommitWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { MutationMask, NoFlags } from "./ReactFiberFlags";
import { HostRoot } from "./ReactWorkTags";

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
  workInProgress = root.current.getWIPFiber();
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const root = markUpdateFromFiberToRoot(fiber);
  renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
  let node = fiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  if (node.tag === HostRoot) {
    return node.stateNode;
  }

  console.error("fiberRoot not found", { fiber });
}

function renderRoot(root: FiberRootNode) {
  prepareFreshStack(root);

  workLoop();

  root.finishedWork = root.current.alternate;

  commitRoot(root);
}

function commitRoot(fiberRootNode: FiberRootNode) {
  const finishedWork = fiberRootNode.finishedWork;

  if (finishedWork === null) {
    console.error("finishedWork is null", { fiberRootNode });
  }

  fiberRootNode.finishedWork = null;

  const subtreeHasEffect =
    (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

  if (subtreeHasEffect || rootHasEffect) {
    // beforeMutation
    // mutation Placement
    commitMutationEffects(finishedWork);

    fiberRootNode.current = finishedWork;

    // layout
  } else {
    fiberRootNode.current = finishedWork;
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next === null) {
    completeUnitOfWork(fiber);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  while (node !== null) {
    completeWork(node);

    if (node.sibling) {
      workInProgress = node.sibling;
      return;
    } else {
      node = node.return;
      workInProgress = node;
    }
  }
}
