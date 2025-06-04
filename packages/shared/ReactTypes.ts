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
  | Iterable<ReactNode>;

export type FunctionComponent = (props: unknown) => ReactNode;

export type RefObject<T> = {
  current: T;
};

export type RefCallback<T> = (
  instance: T | null
) => void | (() => void | undefined);

export type Ref<T> = RefCallback<T> | RefObject<T | null> | null;
