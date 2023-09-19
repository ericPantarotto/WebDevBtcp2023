import React from "react";
//NOTE: React 17
// import ReactDOM from "react-dom";
// ReactDOM.render(<h1>Hello World!</h1>, document.getElementById("root"));

//NOTE: React 18 - https://react.dev/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<h1>Hello World!</h1>);