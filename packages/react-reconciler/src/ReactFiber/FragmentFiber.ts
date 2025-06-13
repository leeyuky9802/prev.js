import { REACT_FRAGMENT_TYPE } from "shared/ReactSymbols";
import { Fragment } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";
import type { ElementKey, ElementProps, ReactNode } from "shared/ReactTypes";

export class FragmentFiber extends BaseFiber implements Fiber {
  tag: typeof Fragment = Fragment;
  type: typeof REACT_FRAGMENT_TYPE = REACT_FRAGMENT_TYPE;
  key: ElementKey;

  pendingProps: ReactNode;
  memoizedProps: ReactNode = null;

  stateNode: null = null;
  alternate: FragmentFiber | null = null;

  constructor(children: ReactNode, key: ElementKey) {
    super();
    this.key = key;
    this.pendingProps = children;
  }

  getWIPFiber(newProps: ElementProps): FragmentFiber {
    let wipFiber: FragmentFiber;
    if (this.alternate) {
      wipFiber = this.alternate;
      wipFiber.clean();
      wipFiber.pendingProps = newProps.children;
    } else {
      wipFiber = new FragmentFiber(newProps.children, this.key);
      wipFiber.alternate = this;
      this.alternate = wipFiber;

      wipFiber.memoizedProps = this.memoizedProps;
    }

    return wipFiber;
  }
}
