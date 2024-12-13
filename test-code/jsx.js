// 在react17之前,babel转换的是老的写法
import babel from "@babel/core";
const sourceCode = `
<h1>
    hello,
    <span style={{color: 'red'}} className="text" id="span" key="1">
      world
    </span>
  </h1>
`;

const transform = (type) =>
  babel.transform(sourceCode, {
    plugins: [["@babel/plugin-transform-react-jsx", { runtime: type }]],
  });
/** 将jsx转换为js代码 */
const react16 = transform("classic");

const react18 = transform("automatic");

console.log(react16.code);
console.log(react18.code);

// classic - 老版本 17之前
// /*#__PURE__*/React.createElement("h1", null, "hello ", /*#__PURE__*/React.createElement("span", {
//   style: {
//     color: 'red'
//   }
// }, "world"));

/** automatic - 新版*/
// import {jsx as _jsx} from 'react/jsx-runtime';
// import {jsxs as _jsxs} from 'react/jsx-runtime';
// /*#__PURE__*/ _jsxs('h1', {
//   children: [
//     'hello ',
//     /*#__PURE__*/ _jsx('span', {
//       style: {
//         color: 'red',
//       },
//       children: 'world',
//     }),
//   ],
// });
