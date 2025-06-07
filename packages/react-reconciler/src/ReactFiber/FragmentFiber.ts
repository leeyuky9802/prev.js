import { REACT_FRAGMENT_TYPE } from "shared/ReactSymbols";
import type { ElementKey, ElementProps, ReactNode } from "shared/ReactTypes";

import { Fragment } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";

export class FragmentFiber extends BaseFiber implements Fiber {
  tag: typeof Fragment = Fragment;
  type: typeof REACT_FRAGMENT_TYPE = REACT_FRAGMENT_TYPE;
  key: ElementKey = null;

  pendingProps: ReactNode;
  memoizedProps: ReactNode = null;

  alternate: FragmentFiber | null = null;
  stateNode: null = null;

  constructor(props: ElementProps, key: ElementKey) {
    super();
    this.pendingProps = props.children;
    this.key = key;
  }

  getWIPFiber(props: ElementProps) {
    if (this.alternate) {
      const wip = this.alternate;
      wip.clean();
      wip.memoizedProps = this.memoizedProps;
      wip.pendingProps = props.children;

      return wip;
    } else {
      const wip = new FragmentFiber(props, this.key);
      wip.alternate = this;
      this.alternate = wip;
      wip.memoizedProps = this.memoizedProps;

      return wip;
    }
  }
}
