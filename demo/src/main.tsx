import { createRoot } from "react-dom/client";

const hostRoot = document.getElementById("root");

const root = createRoot(hostRoot!);

const FC = () => {
  return <div>test this is just a test</div>;
};

root.render(
  <div>
    <FC />
  </div>
);
