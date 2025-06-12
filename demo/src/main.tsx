import { createRoot } from "react-dom/client";

const hostRoot = document.getElementById("root");

const root = createRoot(hostRoot!);

root.render(
  <div>
    <span>hello world! from prev.js</span>
  </div>
);
