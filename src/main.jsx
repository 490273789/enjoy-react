import {createRoot} from 'react-dom/client';

const element = (
  <h1>
    hello, <span style={{color: 'red'}}>world</span>
  </h1>
);

// 根节点是直接获取DOM，所以不需要创建虚拟DOM，但是有自己的fiber
const root = createRoot(document.querySelector('#root'));

root.render(element);
