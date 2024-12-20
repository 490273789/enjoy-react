import React from "react";
import { createRoot } from "react-dom/client";

// function App() {
//   return <div>react</div>;
// }

const element = (
  <div key="1" className="list-wrapper">
    hello <span className="item">react</span>
  </div>
);
console.log("[ element ] >", element);
// console.log("[ App ] >", <App key={1} />);

// function Child({ children }) {
//   return <li>{children}</li>;
// }

const root = createRoot(document.querySelector("#root")!);
console.log("[ root ] >", root);

// root.render(<App />);
