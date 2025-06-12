import { appendInitialChild, type Instance } from "ReactFiberConfig";
import type { FiberRootNode } from "./ReactFiber/FiberRootNode";

export function commitRoot(fiberRootNode: FiberRootNode): void {
  appendInitialChild(
    fiberRootNode.container,
    fiberRootNode.finishedWork!.child!.stateNode! as Instance
  );

  fiberRootNode.current = fiberRootNode.finishedWork!;
  fiberRootNode.finishedWork = null;
}
