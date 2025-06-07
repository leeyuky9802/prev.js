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
    this.key = key;
    this.ref = props.ref ? props.ref : null;
  }
}

// ref
export type RefObject<T> = {
  current: T;
};

export type RefCallback<T> = (
  instance: T | null
) => void | (() => void | undefined);

export type Ref<T> = RefCallback<T> | RefObject<T | null> | null;

export type ReactNode =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ReactElement
  | Array<ReactNode>;

export type FunctionComponentType = (props: unknown) => ReactNode;
