import type {
  ElementKey,
  ElementProps,
  FunctionComponentType,
} from "shared/ReactTypes";

import type { Hook } from "../ReactFiberHooks";
import { FunctionComponent } from "../ReactWorkTags";
import type { Fiber } from "./BaseFiber";
import { BaseFiber } from "./BaseFiber";

export class FunctionComponentFiber extends BaseFiber implements Fiber {
  tag: typeof FunctionComponent = FunctionComponent;
  type: FunctionComponentType;
  key: ElementKey = null;

  alternate: FunctionComponentFiber | null = null;
  stateNode: null = null;

  pendingProps: ElementProps;
  memoizedProps: ElementProps | null = null;

  // own properties
  memoizedState: Hook | null = null;

  constructor(
    type: FunctionComponentType,
    props: ElementProps,
    key: ElementKey,
  ) {
    super();

    this.type = type;
    this.key = key;
    this.pendingProps = props;
  }

  getWIPFiber(props: ElementProps) {
    if (this.alternate) {
      const wip = this.alternate;
      wip.clean();
      wip.memoizedProps = this.memoizedProps;
      wip.pendingProps = props;

      return wip;
    } else {
      const wip = new FunctionComponentFiber(this.type, props, this.key);
      wip.alternate = this;
      this.alternate = wip;
      wip.memoizedProps = this.memoizedProps;

      return wip;
    }
  }
}
