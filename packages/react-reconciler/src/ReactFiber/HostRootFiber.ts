import type { ReactNode } from "shared/ReactTypes";
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
  updateQueue: ReactNode;
  memoizedState: ReactNode;

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

      this.alternate = wip;
      wip.alternate = this;

      wip.updateQueue = this.updateQueue;
      wip.memoizedState = this.memoizedState;
    }

    return wip;
  }
}
