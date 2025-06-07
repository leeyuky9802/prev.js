import type { Container } from "./ReactFiberConfigDOM";
import { dispatchEvent } from "./SyntheticEvent";

const allNativeEvents = ["click"];

export const eventCallbackPropNames: Record<
  (typeof allNativeEvents)[number],
  string[]
> = {
  click: ["onClickCapture", "onClick"],
};

function getAllEventCallbackPropNames() {
  return Object.values(eventCallbackPropNames).flat();
}

export const reservedPropsNames = [
  "children",
  "ref",
  ...getAllEventCallbackPropNames(),
];

export function listenToAllSupportedEvents(container: Container) {
  allNativeEvents.forEach((domEventName) => {
    container.addEventListener(domEventName, (e) => {
      dispatchEvent(container, domEventName, e);
    });
  });
}
