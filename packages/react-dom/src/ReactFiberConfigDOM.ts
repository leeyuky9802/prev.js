import type { HostConfig } from "shared/ReactFiberConfig";
import type { ElementProps } from "shared/ReactTypes";
import { updateProperties } from "./ReactDomComponent";
import {
  updateFiberProps,
  type internalPropsKey,
} from "./ReactDomComponentTree";

export type Container = Element | Document | DocumentFragment;

export interface Instance extends Element {
  [internalPropsKey]?: ElementProps;
}
export type TextInstance = Text;

const domConfig: HostConfig<Container, Instance, TextInstance> = {
  createInstance(type: string, props: ElementProps): Instance {
    const element = document.createElement(type);
    updateFiberProps(element, props);
    updateProperties(element, {}, props);

    if (__DEV__) {
      console.log(type + " created");
    }
    return element;
  },

  createTextInstance(content: string): TextInstance {
    const textInstance: TextInstance = document.createTextNode(content);
    if (__DEV__) {
      console.log(content + " created");
    }
    return textInstance;
  },

  getInstanceParent(instance): Container | Instance {
    return instance.parentNode as Container | Instance;
  },

  // update
  appendInitialChild(
    parent: Instance | Container,
    child: Instance | TextInstance,
  ) {
    if (__DEV__) {
      console.log(child, `mounted to`, parent);
    }
    parent.appendChild(child);
  },

  insertBefore(
    parent: Container | Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) {
    if (__DEV__) {
      console.log(child, `moved before`, beforeChild);
    }
    parent.insertBefore(child, beforeChild);
  },

  commitUpdate(
    instance: Instance,
    type: string,
    oldProps: ElementProps,
    newProps: ElementProps,
  ): void {
    updateFiberProps(instance, newProps);
    updateProperties(instance, oldProps, newProps);
  },

  commitTextUpdate(textInstance, newText) {
    textInstance.textContent = newText;
  },

  // delete
  removeChild(parent: Container | Instance, child: Container | TextInstance) {
    if (__DEV__) {
      console.log(child, `removed from`, parent);
    }
    parent.removeChild(child);
  },
};

export const {
  createInstance,
  createTextInstance,
  getInstanceParent,
  appendInitialChild,
  insertBefore,
  commitUpdate,
  commitTextUpdate,
  removeChild,
} = domConfig;
