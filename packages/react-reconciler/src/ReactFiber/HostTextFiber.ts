import type { TextInstance } from "ReactFiberConfig";
import { HostText } from "../ReactWorkTags";
import { BaseFiber, type Fiber } from "./BaseFiber";

type HostTextFiberProps = {
  content: string;
};

export class HostTextFiber extends BaseFiber implements Fiber {
  tag: typeof HostText = HostText;
  type: null = null;
  key: null = null;

  pendingProps: HostTextFiberProps;
  memoizedProps: HostTextFiberProps | null = null;

  stateNode: TextInstance | null = null;
  alternate: HostTextFiber | null = null;

  constructor(content: string) {
    super();
    this.pendingProps = { content };
  }

  getWIPFiber(newContent: string) {
    let wip: HostTextFiber;
    if (this.alternate) {
      wip = this.alternate;
      wip.clean();

      wip.pendingProps.content = newContent;
    } else {
      wip = new HostTextFiber(newContent);

      wip.memoizedProps = this.memoizedProps;
      wip.stateNode = this.stateNode;

      this.alternate = wip;
      wip.alternate = this;
    }

    return wip;
  }
}
