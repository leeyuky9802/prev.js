import type { Dispatcher } from "shared/ReactTypes";
import { resolveDispatcher } from "./ReactSharedInternalsClient";

export const useState: Dispatcher["useState"] = (initialState) => {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
};
