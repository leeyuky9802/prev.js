import type {
  ElementKey,
  ElementProps,
  FunctionComponentType,
} from "shared/ReactTypes";
import { FunctionComponent } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";

export class FunctionComponentFiber extends BaseFiber implements Fiber {
  tag: typeof FunctionComponent = FunctionComponent;
  type: FunctionComponentType;
  key: ElementKey;

  pendingProps: ElementProps;
  memoizedProps: ElementProps | null = null;

  stateNode: null = null;
  alternate: FunctionComponentFiber | null = null;

  constructor(
    type: FunctionComponentType,
    props: ElementProps,
    key: ElementKey
  ) {
    super();
    this.type = type;
    this.key = key;
    this.pendingProps = props;
  }

  getWIPFiber(newProps: ElementProps): FunctionComponentFiber {
    let wipFiber;
    if (this.alternate) {
      wipFiber = this.alternate;
      wipFiber.clean();
      wipFiber.pendingProps = newProps;
    } else {
      wipFiber = new FunctionComponentFiber(this.type, newProps, this.key);
      wipFiber.alternate = this;
      this.alternate = wipFiber;

      wipFiber.memoizedProps = this.memoizedProps;
    }

    return wipFiber;
  }
}
