import { type HostConfig } from "shared/ReactFiberConfig";

export type Container = Element | Document | DocumentFragment;
export type Instance = Element;
export type TextInstance = Text;

const hostConfigDom: HostConfig<Container, Instance, TextInstance> = {
  createInstance(type) {
    console.log("[HostConfig]createInstance: ", type);
    const element = document.createElement(type);
    //TODO: handle props
    return element;
  },
  createTextInstance(content) {
    console.log("[HostConfig]createTextInstance: ", content);
    const textInstance = document.createTextNode(content);
    return textInstance;
  },
  appendInitialChild(parent, child) {
    console.log("[HostConfig]appendInitialChild: ", parent, child);
    parent.appendChild(child);
  },
};

export const { createInstance, createTextInstance, appendInitialChild } =
  hostConfigDom;
