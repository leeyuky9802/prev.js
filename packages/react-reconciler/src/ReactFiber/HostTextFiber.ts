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
    this.pendingProps = {
      content,
    };
    this.memoizedProps = null;
    this.stateNode = null;
  }

  getWIPFiber(newContent: string): HostTextFiber {
    if (this.alternate) {
      const wip = this.alternate;
      wip.clean();
      wip.memoizedProps = this.memoizedProps;
      wip.pendingProps.content = newContent;

      return wip;
    } else {
      const wip = new HostTextFiber(newContent);
      wip.alternate = this;
      this.alternate = wip;
      wip.stateNode = this.stateNode;
      wip.memoizedProps = this.memoizedProps;

      return wip;
    }
  }
}
