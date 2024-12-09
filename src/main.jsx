import * as React from "react";
import {createRoot} from "react-dom/client";

function reducer(state, action) {
  if (action.type === "add") return state + action.payload;
  else return state;
}

function FunctionComponent() {
  // const [number1, dispatch1] = React.useReducer(reducer, 0);
  const [age, setAge] = React.useState(18);
  // console.log("number1:", number1);
  // const [number2, dispatch2] = React.useReducer(reducer, 0);

  return age === 18 ? (
    <ul>
      <li key="A" onClick={() => setAge(age + 1)}>
        A
      </li>
      <li key="B">B</li>
      <li key="C">C</li>
      <li key="D">D</li>
      <li key="E">E</li>
      <li key="F" id="F">
        F
      </li>
    </ul>
  ) : (
    <ul>
      <li key="A">A2</li>
      <li key="C">C2</li>
      <li key="E">E2</li>
      <li key="B" id="B">
        B2
      </li>
      <li key="G">G</li>
      <li key="D">D2</li>
    </ul>
  );
  // return (
  //   <h2
  //     onClick={() => console.log("父冒泡")}
  //     onClickCapture={() => console.log(`父捕获`)}>
  //     Hi,
  //     <span
  //       onClick={() => console.log("子冒泡")}
  //       onClickCapture={() => console.log(`子捕获`)}
  //       style={{color: "green"}}>
  //       React
  //     </span>
  //   </h2>
  // );
}

// jsx写法
const element = <FunctionComponent />;

// js写法
// const element = React.createElement(App);

// const element = (
//   <h1>
//     Hi,
//     <span key="1" id="id" className="text" style={{color: "#6699ff"}}>
//       React
//     </span>
//   </h1>
// );

// 根节点是真实DOM，所以不需要创建虚拟DOM，但是有自己的fiber
console.log("虚拟DOM:", element);
// debugger;
// createRoot返回 ReactDOMRoot 实例上面又render方法 和 根节点的Fiber
const root = createRoot(document.getElementById("root"));
console.log(root);
// 把虚拟dom渲染到容器中
root.render(element);

// jsx被编译后结果
// var _jsxRuntime = require("react/jsx-runtime");
// const element = /*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
//     children: ["hello, ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
//         style: {
//             color: 'red'
//         },
//         children: "world"
//     })]
// });

// var jsxDEV = require('react/jsx-runtime');
// jsxDEV('h1', {
//   children: [
//     'hello,',
//     jsxDEV('span', {
//       style: {color: 'red'},
//       className: 'text',
//       children: 'world',
//     }),
//   ],
// });

// const ele = {
//   $$typeof: Symbol(react.element),
//   type: "h1",
//   key: null,
//   ref: null,
//   props: {
//     children: [
//       "hello,",
//       {
//         $$typeof: Symbol(react.element),
//         type: "span",
//         key: null,
//         ref: null,
//         props: {
//           id: "id",
//           className: "text",
//           style: {color: "red"},
//           children: "world"
//         }
//       }
//     ]
//   }
// };
