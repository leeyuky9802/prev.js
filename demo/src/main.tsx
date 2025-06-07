/* eslint-disable */
// @ts-nocheck - this is the demo

import React from "react";

console.log("dev", <div />);

console.log("fragment", <></>);

console.log("fragment with key", <React.Fragment key="1" />);

function FC({ children }) {
  return <div>hello, {children}</div>;
}

console.log("functional component", <FC>world</FC>);
