import internals from "shared/ReactSharedInternals";
import type { Action, Dispatch, Dispatcher } from "shared/ReactTypes";
import type { FunctionComponentFiber } from "./ReactFiber/FunctionComponentFiber";
import {
  createUpdate,
  createUpdateQueue,
  enqueueUpdate,
  processUpdateQueue,
  type UpdateQueue,
} from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

// types
export interface Hook {
  memoizedState: unknown;
  updateQueue: unknown;
  next: Hook | null;
}

// globals
const { currentDispatcher } = internals;
let currentlyRenderingFiber: FunctionComponentFiber | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;

const HooksDispatcherOnMount: Dispatcher = {
  useState: mountState,
};

const HooksDispatcherOnUpdate: Dispatcher = {
  useState: updateState,
};

// hooks
function mountWorkInProgresHook(): Hook {
  if (currentlyRenderingFiber === null) {
    throw new Error("hooks called outside of a function component");
  }

  const hook: Hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    workInProgressHook = hook;
    currentlyRenderingFiber.memoizedState = workInProgressHook;
  } else {
    workInProgressHook.next = hook;
    workInProgressHook = hook;
  }

  return workInProgressHook;
}

function mountState<State>(
  initialState: (() => State) | State,
): [State, Dispatch<State>] {
  const hook = mountWorkInProgresHook();

  let memoizedState;
  if (initialState instanceof Function) {
    memoizedState = initialState();
  } else {
    memoizedState = initialState;
  }
  hook.memoizedState = memoizedState;

  const queue = createUpdateQueue<State>();
  hook.updateQueue = queue;
  // prettier-ignore
  const dispatch = (dispatchSetState<State>).bind(
    null,
    currentlyRenderingFiber!,
    queue
  );
  queue.dispatch = dispatch;

  return [memoizedState, dispatch];
}

function dispatchSetState<State>(
  fiber: FunctionComponentFiber,
  updateQueue: UpdateQueue<State>,
  action: Action<State>,
) {
  const update = createUpdate(action);
  enqueueUpdate(updateQueue, update);

  scheduleUpdateOnFiber(fiber);
}

function updateWorkInProgresHook(): Hook {
  if (currentlyRenderingFiber === null) {
    throw new Error("hooks called outside of a function component");
  }

  // get current hook
  let nextCurrentHook: Hook | null;

  if (currentHook === null) {
    // first hook in this updating fc
    const current = currentlyRenderingFiber.alternate;
    if (current) {
      nextCurrentHook = current.memoizedState;
    } else {
      throw new Error(`updating fc missing alternate`);
    }
  } else {
    // for this updating fc, this is not the first hook
    nextCurrentHook = currentHook.next;
  }

  if (nextCurrentHook === null) {
    // mount/update u1 u2 u3
    // update       u1 u2 u3 u4
    throw new Error(
      `cache miss: more hooks are rendered than last time in this fc`,
    );
  }

  currentHook = nextCurrentHook;

  // wip hook
  const newHook: Hook = {
    memoizedState: currentHook.memoizedState,
    updateQueue: currentHook.updateQueue,
    next: null,
  };

  if (workInProgressHook === null) {
    workInProgressHook = newHook;
    currentlyRenderingFiber.memoizedState = workInProgressHook;
  } else {
    workInProgressHook.next = newHook;
    workInProgressHook = newHook;
  }

  return workInProgressHook;
}

function updateState<State>(): [State, Dispatch<State>] {
  const hook = updateWorkInProgresHook();

  const queue = hook.updateQueue as UpdateQueue<State>;
  const pending = queue.shared.pending;
  const baseState = hook.memoizedState as State;

  const { memoizedState } = processUpdateQueue(baseState, pending);
  hook.memoizedState = memoizedState;

  return [memoizedState, queue.dispatch!];
}

export function renderWithHooks(wip: FunctionComponentFiber) {
  currentlyRenderingFiber = wip;

  if (wip.alternate !== null) {
    currentDispatcher.current = HooksDispatcherOnUpdate;
  } else {
    currentDispatcher.current = HooksDispatcherOnMount;
  }

  const Component = wip.type;
  const props = wip.pendingProps;
  const children = Component(props);

  // clean up
  currentDispatcher.current = null;
  currentlyRenderingFiber = null;
  workInProgressHook = null;
  currentHook = null;

  return children;
}
