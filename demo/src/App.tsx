import { useState } from "react";

export default function App() {
  const [isAscendingOrder, setIsAscendingOrder] = useState(true);
  const [isShowing, setIsShowing] = useState(true);

  return (
    <main>
      <button
        onClick={() => {
          console.log("click");
          setIsAscendingOrder(!isAscendingOrder);
        }}
      >
        click me to swap
      </button>
      {isShowing ? (
        isAscendingOrder ? (
          <>
            <div key={1}>1</div>
            <div key={2}>2</div>
            <div key={3}>3</div>
          </>
        ) : (
          <>
            <div key={3}>3</div>
            <div key={2}>2</div>
            <div key={1}>
              <span>1</span>
            </div>
          </>
        )
      ) : null}
      <button
        onClick={() => {
          console.log("click");
          setIsShowing(!isShowing);
        }}
      >
        click me to show/hidden
      </button>
    </main>
  );
}
