import {createRoot} from 'react-dom/client';

const element = (
  <h1
    onClick={() => console.log('父冒泡')}
    onClickCapture={() => console.log(`父捕获`)}>
    hello,{' '}
    <span
      onClick={() => console.log('子冒泡')}
      onClickCapture={() => console.log(`子捕获`)}
      style={{color: 'red'}}>
      world
    </span>
  </h1>
);

// 根节点是直接获取DOM，所以不需要创建虚拟DOM，但是有自己的fiber
const root = createRoot(document.querySelector('#root'));

root.render(element);

// jsx被编译后结果
// var _jsxRuntime = require("react/jsx-runtime");
// const element = /*#__PURE__*/(0, _jsxRuntime.jsxs)("h1", {
//     children: ["hello, ", /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
//         style: {
//             color: 'red'
//         },
//         children: "world"
//     })]
// });
