// 在react17之前,babel转换的是老的写法
const babel = require('@babel/core');
const sourceCode = `
<h1> 
  hello <span style={{ color: 'red' }}>world</span>
</h1>
`;
/** 将jsx转换为js代码 */
const result = babel.transform(sourceCode, {
  plugins: [['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}]],
});

console.log(result.code);

// classic
// /*#__PURE__*/React.createElement("h1", null, "hello ", /*#__PURE__*/React.createElement("span", {
//   style: {
//     color: 'red'
//   }
// }, "world"));

/** automatic */
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
