import { REACT_ELEMENT_TYPE } from "./ReactSymbols";

export type ElementType = string | FunctionComponentType | symbol;

export type ElementProps = Record<Exclude<string, "key">, unknown> & {
  children?: ReactNode;
  ref?: Ref<unknown>;
};

export type ElementKey = string | null;

export class ReactElement {
  $$typeof: typeof REACT_ELEMENT_TYPE;
  type: ElementType;
  props: ElementProps;
  key: ElementKey;
  ref: Ref<unknown> | null;

  constructor(type: ElementType, props: ElementProps, key: ElementKey) {
    this.$$typeof = REACT_ELEMENT_TYPE;
    this.type = type;
    this.props = props;
    this.key = key;
    this.ref = props.ref ? props.ref : null;
  }
}

export type ReactNode =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | ReactElement
  | ReactNode[];

export type FunctionComponentType = (...props: unknown[]) => ReactNode;

// ref
export type RefObject<T> = {
  current: T;
};

export type RefCallback<T> = (
  instance: T | null
) => void | (() => void | undefined);

export type Ref<T> = RefObject<T | null> | RefCallback<T> | null;
