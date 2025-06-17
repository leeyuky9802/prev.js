<<<<<<< HEAD
import { REACT_ELEMENT_TYPE } from "./ReactSymbols";

export type ElementType = string | FunctionComponent | symbol;

export class ReactElement {
  $$typeof: symbol;
  type: ElementType;
  key: string | null;
  ref: Ref<unknown>;

  constructor(
    type: ElementType,
    props: Record<string, unknown> & { ref?: Ref<unknown> },
    key: string | null
  ) {
    this.$$typeof = REACT_ELEMENT_TYPE;
    this.type = type;
=======
import type { REACT_FRAGMENT_TYPE } from "./ReactSymbols";
import { REACT_ELEMENT_TYPE } from "./ReactSymbols";

// react element
export type ElementType =
  | string
  | FunctionComponentType
  | typeof REACT_FRAGMENT_TYPE;

export type ElementProps = Record<Exclude<string, "key">, unknown> & {
  ref?: Ref<unknown>;
  children?: ReactNode;
};

export type ElementKey = string | null;

export class ReactElement {
  $$typeof: typeof REACT_ELEMENT_TYPE;
  type: ElementType;
  props: ElementProps;
  key: ElementKey;
  ref: Ref<unknown>;

  constructor(type: ElementType, props: ElementProps, key: ElementKey) {
    this.$$typeof = REACT_ELEMENT_TYPE;
    this.type = type;
    this.props = props;
>>>>>>> mount
    this.key = key;
    this.ref = props.ref ? props.ref : null;
  }
}

<<<<<<< HEAD
=======
// ref
export type RefObject<T> = {
  current: T;
};

export type RefCallback<T> = (
  instance: T | null,
) => void | (() => void | undefined);

export type Ref<T> = RefCallback<T> | RefObject<T | null> | null;

>>>>>>> mount
export type ReactNode =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ReactElement
<<<<<<< HEAD
  | Iterable<ReactNode>;

export type FunctionComponent = (props: unknown) => ReactNode;

export type RefObject<T> = {
  current: T;
};

export type RefCallback<T> = (
  instance: T | null
) => void | (() => void | undefined);

export type Ref<T> = RefCallback<T> | RefObject<T | null> | null;
=======
  | Array<ReactNode>;

export type FunctionComponentType = (props: unknown) => ReactNode;

// hooks
export type Action<State> = State | ((prevState: State) => State);

export type Dispatch<State> = (action: Action<State>) => void;

export interface Dispatcher {
  useState: <T>(initialState: (() => T) | T) => [T, Dispatch<T>];
}
>>>>>>> mount
