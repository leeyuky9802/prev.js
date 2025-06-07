import type { ReactNode } from "shared/ReactTypes";

import type { UpdateQueue } from "../ReactFiberClassUpdateQueue";
import { createUpdateQueue } from "../ReactFiberClassUpdateQueue";
import { HostRoot } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";
import type { FiberRootNode } from "./FiberRootNode";

export class HostRootFiber extends BaseFiber implements Fiber {
  tag: typeof HostRoot = HostRoot;
  type: null = null;
  key: null = null;

  stateNode: FiberRootNode;
  alternate: HostRootFiber | null = null;

  pendingProps: null = null;
  memoizedProps: null = null;

  // own properties
  updateQueue: UpdateQueue<ReactNode> = createUpdateQueue<ReactNode>();
  memoizedState: ReactNode = null;

  constructor(fiberRootNode: FiberRootNode) {
    super();
    this.stateNode = fiberRootNode;
  }

  getWIPFiber() {
    let wip: HostRootFiber;
    if (this.alternate) {
      wip = this.alternate;
      wip.clean();
    } else {
      wip = new HostRootFiber(this.stateNode);
      wip.alternate = this;
      this.alternate = wip;
    }

    wip.memoizedState = this.memoizedState;
    wip.updateQueue = this.updateQueue;

    return wip;
  }
}
