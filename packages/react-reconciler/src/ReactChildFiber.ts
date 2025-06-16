import type { ReactElement, ReactNode } from "shared/ReactTypes";
import {
  createFiberFromElement,
  createFiberFromReactNode,
  type FiberNode,
} from "./ReactFiber";
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "shared/ReactSymbols";
import { Placement } from "./ReactFiberFlags";
import { HostTextFiber } from "./ReactFiber/HostTextFiber";

function createChildReconciler(shouldTrackEffects: boolean) {
  function reconcileSingleElement(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    element: ReactElement
  ) {
    if (currentFiber) {
      // reuse
      throw new Error("unhandled situation");
    } else {
      const wipFiber = createFiberFromElement(element);
      wipFiber.return = returnFiber;

      return wipFiber;
    }
  }

  function reconcileSingleTextNode(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    content: string | number | bigint
  ) {
    if (currentFiber) {
      // update
      throw new Error("unhandled situation");
    } else {
      const wipFiber = new HostTextFiber("" + content);
      wipFiber.return = returnFiber;
      return wipFiber;
    }
  }

  function placeSingleChild(fiber: FiberNode) {
    if (shouldTrackEffects && fiber.alternate === null) {
      fiber.flags |= Placement;
    }
    return fiber;
  }

  function reconcileChildrenArray(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChildren: ReactNode[]
  ): FiberNode | null {
    if (!currentFiber) {
      // mount
      let firstNewFiber: FiberNode | null = null;
      let lastNewFiber: FiberNode | null = null;

      for (let i = 0; i < newChildren.length; i++) {
        const newFiberChild = createFiberFromReactNode(newChildren[i]);

        if (newFiberChild) {
          if (firstNewFiber === null) {
            firstNewFiber = newFiberChild;
            lastNewFiber = newFiberChild;
          } else {
            lastNewFiber!.sibling = newFiberChild;
            lastNewFiber = newFiberChild;
          }

          newFiberChild.return = returnFiber;
        }
      }
      return firstNewFiber;
    } else {
      return null; // TODO: implement update
    }
  }

  return function reconcileChildFibers(
    returnFiber: FiberNode,
    currentFiber: FiberNode | null,
    newChild: ReactNode
  ) {
    // if this is a unkeyed top-level fragment
    if (
      typeof newChild === "object" &&
      newChild !== null &&
      !Array.isArray(newChild) &&
      newChild.$$typeof === REACT_ELEMENT_TYPE &&
      newChild.type === REACT_FRAGMENT_TYPE &&
      newChild.key === null
    ) {
      newChild = newChild.props.children;
    }

    if (typeof newChild === "object" && newChild !== null) {
      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFiber, newChild);
      }

      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFiber, newChild)
          );
      }
    } else if (
      newChild === null ||
      newChild === undefined ||
      typeof newChild === "boolean"
    ) {
      return null;
    } else if (
      typeof newChild === "string" ||
      typeof newChild === "number" ||
      typeof newChild === "bigint"
    ) {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFiber, newChild)
      );
    } else {
      throw new Error("unhandled child type: " + JSON.stringify(newChild));
    }
  };
}

export const reconcileChildFibers = createChildReconciler(true);
export const mountChildFibers = createChildReconciler(false);
