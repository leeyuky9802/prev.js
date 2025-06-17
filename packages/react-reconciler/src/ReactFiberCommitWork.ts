import {
  type Container,
  type Instance,
  type TextInstance,
  appendInitialChild,
  commitTextUpdate,
  commitUpdate,
  getInstanceParent,
  insertBefore,
  removeChild,
} from "ReactFiberConfig";

import type { FiberNode } from "./ReactFiber";
import {
  ChildDeletion,
  MutationMask,
  NoFlags,
  Placement,
  Update,
} from "./ReactFiberFlags";
import {
  Fragment,
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "./ReactWorkTags";

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
  nextEffect = finishedWork;

  while (nextEffect !== null) {
    const child: FiberNode | null = nextEffect.child;

    if (
      (nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
      child !== null
    ) {
      nextEffect = child;
    } else {
      up: while (nextEffect !== null) {
        commitMutaitonEffectsOnFiber(nextEffect);

        if (nextEffect.sibling !== null) {
          nextEffect = nextEffect.sibling;
          break up;
        }
        nextEffect = nextEffect.return;
      }
    }
  }
};

const commitMutaitonEffectsOnFiber = (finishedWork: FiberNode) => {
  const flags = finishedWork.flags;

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork);
    finishedWork.flags &= ~Placement;
  }
  if ((flags & Update) !== NoFlags) {
    switch (finishedWork.tag) {
      case HostComponent:
        commitUpdate(
          finishedWork.stateNode!,
          finishedWork.type,
          finishedWork.memoizedProps!,
          finishedWork.pendingProps,
        );
        break;
      case HostText:
        commitTextUpdate(
          finishedWork.stateNode!,
          finishedWork.pendingProps.content,
        );
        break;
      default:
        console.error("update effect on fiber: ", { finishedWork });
    }
    finishedWork.flags &= ~Update;
  }
  if ((flags & ChildDeletion) !== NoFlags) {
    commitDeletion(finishedWork);
    finishedWork.flags &= ~ChildDeletion;
  }
};

function commitDeletion(fiber: FiberNode) {
  if (fiber.deletions === null) {
    console.error("deletions is null while childdeletion effect is marked", {
      fiberToPerformChildDeletionOn: fiber,
    });
  }

  const hostParent =
    fiber.tag === HostComponent ? fiber.stateNode! : getHostParent(fiber);

  const rootHostChildrenToDelete: Array<Instance | TextInstance> = [];

  for (const subtreeRootFiber of fiber.deletions) {
    performDFSOnSubTree(subtreeRootFiber, (unmountFiber) => {
      switch (unmountFiber.tag) {
        case HostComponent:
          // TODO: unmount ref
          if (getInstanceParent(unmountFiber.stateNode!) === hostParent) {
            rootHostChildrenToDelete.push(unmountFiber.stateNode!);
          }
          return;
        case HostText:
          if (getInstanceParent(unmountFiber.stateNode!) === hostParent) {
            rootHostChildrenToDelete.push(unmountFiber.stateNode!);
          }
          return;
        case FunctionComponent:
          // TODO useEffect unmount 、解绑ref
          return;
        case Fragment:
          return;
        default:
          console.error("unhandled fiber type: ", unmountFiber);
      }
    });
  }

  if (rootHostChildrenToDelete.length) {
    for (const instance of rootHostChildrenToDelete) {
      removeChild(hostParent, instance);
    }
  }
}

function performDFSOnSubTree(
  subTreeRoot: FiberNode,
  onBeginCallback: (fiber: FiberNode) => void,
) {
  let node = subTreeRoot;
  while (true) {
    onBeginCallback(node);

    if (node.child !== null) {
      node = node.child;
      continue;
    }

    if (node === subTreeRoot) return;

    while (node.sibling === null) {
      if (node.return === subTreeRoot) {
        return;
      }

      if (node.return === null) console.error("node return is null", { node });
      node = node.return;
    }

    node = node.sibling;
  }
}

const commitPlacement = (finishedWork: FiberNode) => {
  const hostParent = getHostParent(finishedWork);

  // host sibling
  const hostSibling = getHostSibling(finishedWork);

  // finishedWork ~~ DOM append parent DOM
  if (hostParent !== null) {
    insertOrAppendPlacementNodeIntoContainer(
      finishedWork,
      hostParent,
      hostSibling,
    );
  }
};

function getHostSibling(fiber: FiberNode): Instance | TextInstance | null {
  let node: FiberNode = fiber;

  findNeighbourTree: while (true) {
    while (node.sibling === null) {
      const parent = node.return;

      if (
        parent === null ||
        parent.tag === HostComponent ||
        parent.tag === HostRoot
      ) {
        return null;
      }
      node = parent;
    }

    node = node.sibling;

    findHostSiblingInNeighbourTree: while (true) {
      if (
        (node.tag === HostComponent || node.tag === HostText) &&
        (node.flags & Placement) === NoFlags
      ) {
        return node.stateNode;
      } else if ((node.flags & Placement) !== NoFlags || node.child === null) {
        continue findNeighbourTree;
      } else {
        node = node.child;
        continue findHostSiblingInNeighbourTree;
      }
    }
  }
}

function getHostParent(fiber: FiberNode): Container | Instance {
  let parent = fiber.return;

  while (parent) {
    switch (parent.tag) {
      case HostComponent:
        return parent.stateNode!;
      case HostRoot:
        return parent.stateNode.container;
      default:
        parent = parent.return;
    }
  }

  throw new Error("host parent not found for fiber: " + { fiber });
}

function insertOrAppendPlacementNodeIntoContainer(
  finishedWork: FiberNode,
  hostParent: Container | Instance,
  before: Instance | TextInstance | null,
) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    if (finishedWork.stateNode === null) {
      throw new Error("stateNode not created: " + { finishedWork });
    }

    if (before) {
      insertBefore(hostParent, finishedWork.stateNode, before);
    } else {
      appendInitialChild(hostParent, finishedWork.stateNode);
    }
  } else {
    const child = finishedWork.child;
    if (child !== null) {
      insertOrAppendPlacementNodeIntoContainer(child, hostParent, before);
      let sibling = child.sibling;

      while (sibling !== null) {
        insertOrAppendPlacementNodeIntoContainer(sibling, hostParent, before);
        sibling = sibling.sibling;
      }
    }
  }
}
