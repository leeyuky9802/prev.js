import type { ReactNode } from "shared/ReactTypes";

import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import type { FiberNode } from "./ReactFiber";
import type { FragmentFiber } from "./ReactFiber/FragmentFiber";
import type { FunctionComponentFiber } from "./ReactFiber/FunctionComponentFiber";
import type { HostComponentFiber } from "./ReactFiber/HostComponentFiber";
import type { HostRootFiber } from "./ReactFiber/HostRootFiber";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { renderWithHooks } from "./ReactFiberHooks";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";

export function beginWork(wip: FiberNode): FiberNode | null {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case HostText:
      return null;
    case FunctionComponent:
      return updateFunctionComponent(wip);
    case Fragment:
      return updateFragment(wip);
    default:
      console.error("unhandled fiber type: ", { wip });
  }
}

function updateFragment(wip: FragmentFiber) {
  const nextChildren = wip.pendingProps;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateFunctionComponent(wip: FunctionComponentFiber) {
  const nextChildren = renderWithHooks(wip);
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostRoot(wip: HostRootFiber) {
  const baseState = wip.memoizedState;
  const updateQueue = wip.updateQueue;
  const pending = updateQueue.shared.pending;
  updateQueue.shared.pending = null;
  const { memoizedState } = processUpdateQueue(baseState, pending);
  wip.memoizedState = memoizedState;

  const nextChildren = wip.memoizedState;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function updateHostComponent(wip: HostComponentFiber) {
  const nextProps = wip.pendingProps;

  const nextChildren = nextProps.children;
  reconcileChildren(wip, nextChildren);
  return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactNode) {
  const current = wip.alternate;

  if (current !== null) {
    wip.child = reconcileChildFibers(wip, current?.child, children);
  } else {
    wip.child = mountChildFibers(wip, null, children);
  }
}
