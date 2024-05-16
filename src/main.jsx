import * as React from "react";
import {createRoot} from "react-dom/client";

// const element = (
//   <h1
//     onClick={() => console.log('父冒泡')}
//     onClickCapture={() => console.log(`父捕获`)}>
//     hello,
//     <span
//       onClick={() => console.log('子冒泡')}
//       onClickCapture={() => console.log(`子捕获`)}
//       style={{color: 'red'}}>
//       world
//     </span>
//   </h1>
// );

function reducer(state, action) {
  if (action.type === "add") return state + 1;
  else return state;
}
function FunctionComponent() {
  const [number1, dispatch1] = React.useReducer(reducer, 0);
  const [number2, dispatch2] = React.useReducer(reducer, 0);

  return (
    <button
      onClick={() => {
        dispatch1({type: "add", payload: 1});
        dispatch1({type: "add", payload: 2});
        dispatch1({type: "add", payload: 3});
      }}>
      {number1}
    </button>
  );
  // return (
  //   <h2
  //     onClick={() => console.log('父冒泡')}
  //     onClickCapture={() => console.log(`父捕获`)}>
  //     hello,
  //     <span
  //       onClick={() => console.log('子冒泡')}
  //       onClickCapture={() => console.log(`子捕获`)}
  //       style={{color: 'green'}}>
  //       react
  //     </span>
  //   </h2>
  // );
}
const element = (
  <h1>
    hello,
    <span id="id" className="text" style={{color: "red"}}>
      world
    </span>
  </h1>
);

// jsx写法
// const element = <FunctionComponent />;

// js写法
// const element = React.createElement(FunctionComponent);

// 根节点是真实DOM，所以不需要创建虚拟DOM，但是有自己的fiber
console.log("虚拟DOM:", element);
// debugger;
// createRoot返回 ReactDOMRoot 实例上面又render方法 和 根节点的Fiber
const root = createRoot(document.querySelector("#root"));
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
