import type { FunctionComponentFiber } from "./ReactFiber/FunctionComponent";

export function renderWithHooks(fiber: FunctionComponentFiber) {
  const Component = fiber.type;
  const props = fiber.pendingProps;
  const children = Component(props);

  return children;
}
