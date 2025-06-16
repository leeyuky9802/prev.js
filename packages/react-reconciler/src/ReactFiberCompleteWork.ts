import {
  appendInitialChild,
  createInstance,
  createTextInstance,
} from "ReactFiberConfig";
import type { FiberNode } from "./ReactFiber";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";
import { Update } from "./ReactFiberFlags";
import type { HostComponentFiber } from "./ReactFiber/HostComponentFiber";

export function completeWork(wipFiber: FiberNode): void {
  switch (wipFiber.tag) {
    case HostRoot:
    case FunctionComponent:
    case Fragment:
      return;
    case HostComponent:
      if (wipFiber.stateNode) {
        // TODO: compare props to update the DOM
      } else {
        wipFiber.stateNode = createInstance(
          wipFiber.type,
          wipFiber.memoizedProps!
        );
        appendAllChildren(wipFiber);
      }
      return;
    case HostText:
      if (wipFiber.stateNode) {
        // compare if the text is changed
        const oldText = wipFiber.memoizedProps!.content;
        const newText = wipFiber.pendingProps.content;

        if (oldText !== newText) {
          wipFiber.flags |= Update;
        }
      } else {
        wipFiber.stateNode = createTextInstance(
          wipFiber.memoizedProps!.content
        );
      }
  }
}

function appendAllChildren(wipFiber: HostComponentFiber) {
  let node: FiberNode | null = wipFiber.child;

  down: while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(wipFiber.stateNode!, node.stateNode!);
    } else {
      if (node.child) {
        node = node.child;
        continue down;
      }
    }

    while (node !== wipFiber) {
      if (node.sibling) {
        node = node.sibling;
        continue down;
      }
      node = node.return!;
    }

    return;
  }
}
