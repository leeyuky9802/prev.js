import type { ElementProps } from "shared/ReactTypes";
import type { Instance } from "./ReactFiberConfigDOM";

import { reservedPropsNames } from "./DOMPluginEventSystem";

export function updateProperties(
  instance: Instance,
  oldProps: ElementProps,
  newProps: ElementProps,
) {
  // Update properties on the instance based on the newProps
  for (const prop in newProps) {
    if (reservedPropsNames.includes(prop)) {
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(newProps, prop)) {
      const value = newProps[prop];
      if (value === undefined || value === null) {
        instance.removeAttribute(prop);
      } else {
        instance.setAttribute(prop, value as string);
      }
    }
  }

  // Remove properties that are no longer present in newProps
  for (const prop in oldProps) {
    if (prop in reservedPropsNames) {
      continue;
    }

    if (
      Object.prototype.hasOwnProperty.call(oldProps, prop) &&
      !(prop in newProps)
    ) {
      instance.removeAttribute(prop);
    }
  }
}
