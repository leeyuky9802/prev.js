import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from "../shared/ReactSymbols";

export function jsx(type: any, props: any, maybeKey?: any) {
  let key: any = null;

  if (maybeKey) key = maybeKey;

  let filteredProps: any;

  if (props.key) {
    key = "" + props.key;

    filteredProps = {};
    for (const propName in props) {
      if (propName !== 'key') {
        filteredProps[propName] = props[propName];
      }
    }
  } else {
    filteredProps = props;
  }

  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    props: filteredProps,
    key,
    ref: props.ref === undefined ? null : props.ref
  }
}

export const jsxs = jsx;

export const Fragment = REACT_FRAGMENT_TYPE;