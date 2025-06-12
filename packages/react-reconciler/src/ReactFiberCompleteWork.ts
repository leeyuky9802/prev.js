import {
  appendInitialChild,
  createInstance,
  createTextInstance,
  type Instance,
} from "ReactFiberConfig";
import type { FiberNode } from "./ReactFiber";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { Update } from "./ReactFiberFlags";
import type { HostComponentFiber } from "./ReactFiber/HostComponentFiber";

export function completeWork(wipFiber: FiberNode): void {
  switch (wipFiber.tag) {
    case HostRoot:
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
  if (wipFiber.child!.stateNode) {
    appendInitialChild(
      wipFiber.stateNode!,
      wipFiber.child!.stateNode! as Instance
    );
  }
}
