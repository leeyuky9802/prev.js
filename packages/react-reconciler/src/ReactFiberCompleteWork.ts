import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from "ReactFiberConfig";

import type { FiberNode } from "./ReactFiber";
import type { HostComponentFiber } from "./ReactFiber/HostComponentFiber";
import { NoFlags, Update } from "./ReactFiberFlags";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";

function markUpdate(fiber: FiberNode) {
  fiber.flags |= Update;
}

export const completeWork = (wip: FiberNode) => {
  switch (wip.tag) {
    case HostComponent:
      if (wip.alternate) {
        markUpdate(wip);
      } else {
        wip.stateNode = createInstance(wip.type, wip.pendingProps);
        appendAllChildren(wip);
      }
      bubbleProperties(wip);
      return null;
    case HostText:
      if (wip.alternate !== null) {
        // update
        const oldText = wip.memoizedProps!.content;
        const newText = wip.pendingProps.content;

        if (oldText !== newText) {
          markUpdate(wip);
        }
      } else {
        // mount
        wip.stateNode = createTextInstance(wip.pendingProps.content);
      }
      bubbleProperties(wip);
      return null;
    case HostRoot:
    case FunctionComponent:
    case Fragment:
      bubbleProperties(wip);
      return null;
    default:
      console.error("unhandled fiber type: ", { wip });
  }
};

function appendAllChildren(wip: HostComponentFiber) {
  const hostParent = wip.stateNode!;
  let node = wip.child;

  while (node !== null && node !== wip) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(hostParent, node.stateNode!);
    } else if (node.child !== null) {
      // going down the tree
      node = node.child;
      continue;
    }

    // going up the tree
    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return;
      }
      node = node?.return;
    }

    node = node.sibling;
  }
}

function bubbleProperties(wip: FiberNode) {
  let subtreeFlags = NoFlags;
  let child = wip.child;

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;

    child = child.sibling;
  }
  wip.subtreeFlags |= subtreeFlags;
}
