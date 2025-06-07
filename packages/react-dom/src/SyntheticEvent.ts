import { eventCallbackPropNames } from "./DOMPluginEventSystem";
import { internalPropsKey } from "./ReactDomComponentTree";
import type { Container, Instance } from "./ReactFiberConfigDOM";

interface SyntheticEvent extends Event {
  __stopPropagationFlag: boolean;
}

type SyntheticEventCallback = (syntheticEvent: SyntheticEvent) => void;

function createSyntheticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagationFlag = false;
  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagationFlag = true;
  };
  return syntheticEvent;
}

function triggerEventFlow(paths: SyntheticEventCallback[], se: SyntheticEvent) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i];

    callback.call(null, se);

    if (se.__stopPropagationFlag) {
      break;
    }
  }
}

function collectCallbacksOnPaths(
  targetInstance: Instance,
  container: Container,
  eventName: string,
) {
  const callbackArray: SyntheticEventCallback[] = [];

  while (targetInstance && targetInstance !== container) {
    const elementProps = targetInstance[internalPropsKey];
    if (elementProps) {
      const callbackNames = eventCallbackPropNames[eventName];
      if (callbackNames) {
        callbackNames.forEach((callbackName, i) => {
          const eventCallback = elementProps[callbackName];
          if (eventCallback) {
            if (i === 0) {
              callbackArray.unshift(eventCallback as SyntheticEventCallback);
            } else {
              callbackArray.push(eventCallback as SyntheticEventCallback);
            }
          }
        });
      } else {
        console.error("event callback names mising for event name:", eventName);
      }
    }
    targetInstance = targetInstance.parentNode as Instance;
  }

  return callbackArray;
}

export function dispatchEvent(
  container: Container,
  eventType: string,
  event: Event,
) {
  const targetElement = event.target as Instance | null;

  if (targetElement === null)
    console.error("target missing in event ", { event });

  const callbackArray = collectCallbacksOnPaths(
    targetElement,
    container,
    eventType,
  );

  const syntheticEvent = createSyntheticEvent(event);

  triggerEventFlow(callbackArray, syntheticEvent);
}
