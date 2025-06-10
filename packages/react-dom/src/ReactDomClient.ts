import type { ReactNode } from "shared/ReactTypes";
import {
  createContainer,
  updateContainer,
} from "../../react-reconciler/src/ReactFiberReconciler";
import type { Container } from "./ReactFiberConfigDOM";

export function createRoot(container: Container) {
  const root = createContainer(container);

  return {
    render(reactNode: ReactNode) {
      return updateContainer(root, reactNode);
    },
  };
}
