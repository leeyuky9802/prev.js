import type { ReactNode } from "shared/ReactTypes";
import type { FiberNode } from "./ReactFiber";
import type { HostRootFiber } from "./ReactFiber/HostRootFiber";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";
import type { HostComponentFiber } from "./ReactFiber/HostComponentFiber";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import type { FragmentFiber } from "./ReactFiber/FragmentFiber";
import type { FunctionComponentFiber } from "./ReactFiber/FunctionComponent";
import { renderWithHooks } from "./ReactFiberHooks";

export function beginWork(fiber: FiberNode): FiberNode | null {
  switch (fiber.tag) {
    case HostRoot:
      return updateHostRoot(fiber);
    case HostComponent:
      return updateHostComponent(fiber);
    case HostText:
      return null;
    case Fragment:
      return updateFragment(fiber);
    case FunctionComponent:
      return updateFunctionComponent(fiber);
    default:
      throw new Error(
        `beginWork: Unsupported fiber tag ${fiber}. This is likely a bug in React.`
      );
  }
}

function updateFunctionComponent(fiber: FunctionComponentFiber) {
  const children = renderWithHooks(fiber);

  reconcileChildren(fiber, children);
  return fiber.child;
}

function updateFragment(fiber: FragmentFiber) {
  const children = fiber.pendingProps;

  reconcileChildren(fiber, children);
  return fiber.child;
}

function updateHostRoot(fiber: HostRootFiber): FiberNode | null {
  // const baseState = fiber.memoizedState;
  // const update = fiber.updateQueue;
  // apply the update onto the base state

  if (fiber.updateQueue) {
    fiber.memoizedState = fiber.updateQueue;
  }

  reconcileChildren(fiber, fiber.memoizedState);
  return fiber.child;
}

function updateHostComponent(fiber: HostComponentFiber): FiberNode | null {
  const children = fiber.pendingProps.children;

  reconcileChildren(fiber, children);

  return fiber.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactNode) {
  const current = wip.alternate;

  if (current !== null) {
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    wip.child = mountChildFibers(wip, null, children);
  }
}
