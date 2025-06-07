import type { ElementProps } from "shared/ReactTypes";
import type { Instance } from "./ReactFiberConfigDOM";

export const internalPropsKey = "__reactProps$";

export function updateFiberProps(
  instance: Instance,
  props: ElementProps,
): void {
  instance[internalPropsKey] = props;
}
