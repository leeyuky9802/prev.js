import type { FiberNode } from ".";
import type { Flags } from "../ReactFiberFlags";
import { NoFlags } from "../ReactFiberFlags";

export class BaseFiber {
  // tree
  return: FiberNode | null = null;
  sibling: FiberNode | null = null;
  child: FiberNode | null = null;
  index: number = 0;

  // flags
  flags: Flags = NoFlags;
  subtreeFlags: Flags = NoFlags;
  deletions: FiberNode[] | null = null;

  clean() {
    this.return = null;
    this.sibling = null;
    this.child = null;
    this.index = 0;

    this.flags = NoFlags;
    this.subtreeFlags = NoFlags;
    this.deletions = null;
  }
}

export interface Fiber {
  tag: unknown;
  type: unknown;
  key: unknown;

  stateNode: unknown;
  alternate: unknown;

  pendingProps: unknown;
  memoizedProps: unknown;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  getWIPFiber: Function;
}
