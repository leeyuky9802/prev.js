import type { FiberNode } from ".";
import { NoFlags } from "../ReactFiberFlags";

export class BaseFiber {
  // tree
  return: FiberNode | null = null;
  sibling: FiberNode | null = null;
  child: FiberNode | null = null;

  // effects
  flags: number = NoFlags;

  clean() {
    this.return = null;
    this.sibling = null;
    this.child = null;

    // effects
    this.flags = NoFlags;
  }
}

export interface Fiber {
  tag: unknown; // e.g. HostRoot, FunctionComponent, HostComponent, HostText, Fragment
  type: unknown;
  key: unknown;

  stateNode: unknown; // the actual element in the dom, e.t. <div>, <p />, <span> etc.
  alternate: unknown;

  pendingProps: unknown;
  memoizedProps: unknown;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  getWIPFiber: Function;
}
