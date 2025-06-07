import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "shared/ReactSymbols";
import type { ReactElement, ReactNode } from "shared/ReactTypes";

import type { FiberNode } from "./ReactFiber";
import {
  createFiberFromElement,
  FragmentFiber,
  HostTextFiber,
} from "./ReactFiber";
import { ChildDeletion, Placement } from "./ReactFiberFlags";
import { Fragment, HostRoot, HostText } from "./ReactWorkTags";

type ExistingChildren = Map<string | number, FiberNode>;

function createChildReconciler(shouldTrackEffects: boolean) {
  function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
    if (!shouldTrackEffects) {
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function deleteRemainingChildren(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
  ) {
    if (!shouldTrackEffects) {
      return;
    }

    while (currentFirstChild !== null) {
      deleteChild(returnFiber, currentFirstChild);
      currentFirstChild = currentFirstChild.sibling;
    }
  }

  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement,
  ) {
    let wipFiber: FiberNode | null = null;

    findReuse: while (currentFiber !== null) {
      if (
        currentFiber.key !== element.key ||
        currentFiber.tag === HostText ||
        currentFiber.tag === HostRoot
      ) {
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      } else {
        // same key
        if (currentFiber.type === element.type) {
          // same type
          deleteRemainingChildren(returnFiber, currentFiber.sibling);
          wipFiber = currentFiber.getWIPFiber(element.props);
          break findReuse;
        } else {
          // same key, different type
          deleteRemainingChildren(returnFiber, currentFiber);
          break findReuse;
        }
      }
    }

    if (!wipFiber) wipFiber = createFiberFromElement(element);
    wipFiber.return = returnFiber;
    return wipFiber;
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number | bigint,
  ) {
    // trying to find a reusable HostTextFiber
    while (currentFiber !== null) {
      if (currentFiber.tag === HostText) {
        const wip = currentFiber.getWIPFiber("" + content);
        wip.return = returnFiber;
        deleteRemainingChildren(returnFiber, currentFiber.sibling);
        return wip;
      } else {
        deleteChild(returnFiber, currentFiber);
        currentFiber = currentFiber.sibling;
      }
    }

    const wip = new HostTextFiber("" + content);
    wip.return = returnFiber;
    return wip;
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFirstChild: FiberNode | null,
    newChild: ReactNode[],
  ) {
    let lastPlacedIndex = 0;
    let lastNewFiber: FiberNode | null = null;
    let firstNewFiber: FiberNode | null = null;

    const existingChildren: ExistingChildren = new Map();
    while (currentFirstChild !== null) {
      const keyToUse =
        currentFirstChild.key !== null
          ? currentFirstChild.key
          : currentFirstChild.index;
      existingChildren.set(keyToUse, currentFirstChild);
      currentFirstChild = currentFirstChild.sibling;
    }

    for (let i = 0; i < newChild.length; i++) {
      const after = newChild[i];
      const newFiber = updateFromMap(existingChildren, i, after);

      if (newFiber === null) {
        continue;
      } else {
        // maintian tree structure
        newFiber.index = i;
        newFiber.return = returnFiber;

        if (lastNewFiber === null) {
          lastNewFiber = newFiber;
          firstNewFiber = newFiber;
        } else {
          lastNewFiber.sibling = newFiber;
          lastNewFiber = lastNewFiber.sibling;
        }
      }

      if (!shouldTrackEffects) {
        continue;
      }

      const current = newFiber.alternate;
      if (current !== null) {
        const oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
          // move to the right
          newFiber.flags |= Placement;
          continue;
        } else {
          // no move
          lastPlacedIndex = oldIndex;
        }
      } else {
        // mount
        newFiber.flags |= Placement;
      }
    }
    existingChildren.forEach((fiber) => {
      deleteChild(returnFiber, fiber);
    });
    return firstNewFiber;
  }

  function updateFromMap(
    existingChildren: ExistingChildren,
    index: number,
    element: ReactNode,
  ): FiberNode | null {
    if (
      typeof element === "string" ||
      typeof element === "number" ||
      typeof element === "bigint"
    ) {
      // HostText
      const before = existingChildren.get(index);
      if (before && before.tag === HostText) {
        existingChildren.delete(index);
        return before.getWIPFiber("" + element);
      } else {
        return new HostTextFiber(element + "");
      }
    } else if (
      element === null ||
      element === undefined ||
      typeof element === "boolean"
    ) {
      // boolean, null, undefined should be ignored
      return null;
    } else if ("$$typeof" in element) {
      const keyToUse = element.key !== null ? element.key : index;
      const before = existingChildren.get(keyToUse);

      // ReactElement
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (element.type === REACT_FRAGMENT_TYPE) {
            return updateFragment(
              before,
              element.props.children,
              keyToUse,
              existingChildren,
            );
          } else {
            // host component or function component
            if (before && before.type === element.type) {
              existingChildren.delete(keyToUse);
              return before.getWIPFiber(element.props);
            } else {
              return createFiberFromElement(element);
            }
          }
        default:
          if (__DEV__) {
            console.error("unknown element type", { element });
          }
          return null;
      }
    } else if (Array.isArray(element)) {
      return updateFragment(
        existingChildren.get(index),
        element,
        index,
        existingChildren,
      );
    } else {
      if (__DEV__) {
        console.error("element is not typed by ReactNode", { element });
      }
      return null;
    }
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactNode,
  ): FiberNode | null {
    // if this is a unkeyed top-level fragment
    if (
      typeof newChild === "object" &&
      newChild !== null &&
      !Array.isArray(newChild) &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null
    ) {
      newChild = newChild.props.children;
    }

    if (typeof newChild === "object" && newChild !== null) {
      // array of react node
      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFiber, newChild);
      }

      // react element
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild),
          );
        default:
          if (__DEV__) {
            console.error("non-null object should be react element", newChild);
          }
          break;
      }
    } else if (
      typeof newChild === "string" ||
      typeof newChild === "number" ||
      typeof newChild === "bigint"
    ) {
      // HostText
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild),
      );
    } else if (
      newChild === null ||
      newChild === undefined ||
      typeof newChild === "boolean"
    ) {
      // boolean, null, undefined should be ignored, we delete current children
      deleteRemainingChildren(returnFiber, currentFiber);
      return null;
    }

    if (__DEV__) {
      console.error("newChild is not typed by ReactNode", newChild);
    }
    return null;
  };
}

function updateFragment(
  current: FiberNode | undefined,
  elements: ReactNode,
  keyToUse: string | number,
  existingChildren: ExistingChildren,
) {
  let fiber: FragmentFiber;
  if (!current || current.tag !== Fragment) {
    fiber = new FragmentFiber(
      { children: elements },
      typeof keyToUse === "string" ? keyToUse : null,
    );
  } else {
    existingChildren.delete(keyToUse);
    fiber = current.getWIPFiber({ children: elements });
  }
  return fiber;
}

export const reconcileChildFibers = createChildReconciler(true);
export const mountChildFibers = createChildReconciler(false);
