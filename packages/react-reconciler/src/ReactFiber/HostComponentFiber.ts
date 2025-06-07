import type { Instance } from "ReactFiberConfig";
import type { ElementKey, ElementProps, Ref } from "shared/ReactTypes";

import { HostComponent } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";

export class HostComponentFiber extends BaseFiber implements Fiber {
  tag: typeof HostComponent = HostComponent;
  type: string;
  key: ElementKey;

  pendingProps: ElementProps;
  memoizedProps: ElementProps | null = null;

  stateNode: Instance | null = null;
  alternate: HostComponentFiber | null = null;

  // own properties
  ref: Ref<unknown>;

  constructor(
    type: string,
    pendingProps: ElementProps,
    key: ElementKey,
    ref: Ref<unknown>,
  ) {
    super();
    this.type = type;
    this.key = key;
    this.ref = ref;
    this.pendingProps = pendingProps;
  }

  clean() {
    super.clean();

    this.memoizedProps = null;
  }

  getWIPFiber(props: ElementProps) {
    if (this.alternate) {
      const wip = this.alternate;
      wip.clean();

      wip.memoizedProps = this.memoizedProps;
      wip.pendingProps = props;

      return wip;
    } else {
      const wip = new HostComponentFiber(this.type, props, this.key, this.ref);

      wip.alternate = this;
      this.alternate = wip;
      wip.stateNode = this.stateNode;
      wip.memoizedProps = this.memoizedProps;
      wip.ref = this.ref;

      return wip;
    }
  }
}
