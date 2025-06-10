import type { HostComponentFiber } from "./HostComponentFiber";
import type { HostRootFiber } from "./HostRootFiber";
import type { HostTextFiber } from "./HostTextFiber";

export type FiberNode = HostRootFiber | HostComponentFiber | HostTextFiber;
