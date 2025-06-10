import type { FiberNode } from "./ReactFiber";
import type { FiberRootNode } from "./ReactFiber/FiberRootNode";
import { beginWork } from "./ReactFiberBeginWork";
import { commitRoot } from "./ReactFiberCommitWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { HostRoot } from "./ReactWorkTags";

export function scheduleUpdateOnFiber(fiber: FiberNode) {
  const fiberRootNode = markUpdateFromFiberToRoot(fiber);

  renderRoot(fiberRootNode);
}

function markUpdateFromFiberToRoot(fiber: FiberNode): FiberRootNode {
  let hostRootFiber = fiber;
  let parent = fiber.return;

  while (parent !== null) {
    hostRootFiber = parent;
    parent = hostRootFiber.return;
  }

  if (hostRootFiber.tag !== HostRoot) {
    throw new Error(
      "Expected to find a host root fiber. This error is likely caused by a bug in React. Please file an issue."
    );
  } else {
    return hostRootFiber.stateNode;
  }
}

let wipFiber: FiberNode | null = null;

function renderRoot(fiberRootNode: FiberRootNode) {
  wipFiber = fiberRootNode.current.getWIPFiber();

  // rendering loop
  while (wipFiber !== null) {
    performUnitOfWork(wipFiber);
  }

  // commit phase
  fiberRootNode.finishedWork = fiberRootNode.current.alternate!;
  commitRoot(fiberRootNode);
}

function performUnitOfWork(fiber: FiberNode) {
  const next = beginWork(fiber);
  fiber.memoizedProps = fiber.pendingProps;

  if (next) {
    wipFiber = next;
  } else {
    wipFiber = next;
    completeUnitOfWork(fiber);
  }
}

function completeUnitOfWork(fiber: FiberNode) {
  let node: FiberNode | null = fiber;

  while (node !== null) {
    completeWork(node);

    if (node.sibling) {
      wipFiber = node.sibling;
      return;
    } else {
      node = node.return;
      wipFiber = node;
    }
  }
}
