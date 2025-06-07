import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconciler";
import type { ReactNode } from "shared/ReactTypes";
import { listenToAllSupportedEvents } from "./DOMPluginEventSystem";
import type { Container } from "./ReactFiberConfigDOM";

export function createRoot(container: Container) {
  const root = createContainer(container);

  listenToAllSupportedEvents(container);
  return {
    render(reactNode: ReactNode) {
      return updateContainer(root, reactNode);
    },
  };
}
