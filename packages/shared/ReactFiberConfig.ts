/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ElementProps } from "./ReactTypes";

export interface HostConfig<Container, Instance, TextInstance> {
  createInstance: (type: string, props: ElementProps) => Instance;
  createTextInstance: (content: string) => TextInstance;
  getInstanceParent: (
    instance: Instance | TextInstance,
  ) => Container | Instance;
  appendInitialChild: (
    parent: Instance | Container,
    child: Instance | TextInstance,
  ) => void;
  insertBefore: (
    parent: Container | Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance,
  ) => void;
  commitUpdate: (
    instance: Instance,
    type: string,
    oldProps: ElementProps,
    newProps: ElementProps,
  ) => void;
  commitTextUpdate: (textInstance: TextInstance, newText: string) => void;
  removeChild: (
    parent: Container | Instance,
    child: Instance | TextInstance,
  ) => void;
}

const containerSymbol = "container.suntzu";
const instanceSymbol = "instance.suntzu";
const textInstanceSymbol = "textInstance.suntzu";

export type Container = typeof containerSymbol;

export type Instance = typeof instanceSymbol;

export type TextInstance = typeof textInstanceSymbol;

const hostConfig: HostConfig<Container, Instance, TextInstance> =
  {} as HostConfig<Container, Instance, TextInstance>;

export const {
  createInstance,
  createTextInstance,
  getInstanceParent,
  appendInitialChild,
  insertBefore,
  commitUpdate,
  commitTextUpdate,
  removeChild,
} = hostConfig;
