import type { Dispatcher, RefObject } from "shared/ReactTypes";

const currentDispatcher: RefObject<Dispatcher | null> = {
  current: null,
};

export const resolveDispatcher = (): Dispatcher => {
  const dispatcher = currentDispatcher.current;

  if (dispatcher === null) {
    throw new Error("hook only works inside a function component");
  }
  return dispatcher;
};

export const internals = { currentDispatcher };
