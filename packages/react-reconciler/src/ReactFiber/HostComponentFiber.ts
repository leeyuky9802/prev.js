import type { ElementKey, ElementProps, Ref } from "shared/ReactTypes";
import { HostComponent } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";
import type { Instance } from "ReactFiberConfig";

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
    props: ElementProps,
    key: ElementKey,
    ref: Ref<unknown>
  ) {
    super();
    this.type = type;
    this.key = key;
    this.pendingProps = props;
    this.ref = ref;
  }

  getWIPFiber(props: ElementProps) {
    let wip: HostComponentFiber;
    if (this.alternate) {
      wip = this.alternate;
      wip.clean();

      wip.pendingProps = props;
    } else {
      wip = new HostComponentFiber(this.type, props, this.key, this.ref);

      wip.alternate = this;
      this.alternate = wip;

      wip.memoizedProps = this.memoizedProps;
      wip.stateNode = this.stateNode;
    }

    return wip;
  }
}
