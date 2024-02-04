// 16以前直接把虚拟dom渲染为真实dom
// 一气呵成无法中断
function render(vdom, container) {
  let dom = document.createElement(vdom.type);
  Object.keys(vdom.props)
    .filter((key) => key !== 'children')
    .forEach((key) => {
      dom[key] = vdom.props[key];
    });
  if (Array.isArray(vdom.props.children)) {
    vdom.props.children.forEach((child) => {
      render(child, dom);
    });
  }
  container.appendChild(dom);
}
