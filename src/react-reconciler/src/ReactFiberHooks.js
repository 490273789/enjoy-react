import ReactCurrentDispatcher from 'shared/ReactSharedInternals';

const HooksDispatcherOnMount = {
  useReducer: mountReducer,
};

function mountReducer(reducer, initialArg) {
  console.log('mountReducer:', reducer, initialArg);
  return [initialArg];
}
/**
 * 渲染函数组件
 * @param current
 * @param workInProgress
 * @param Component
 * @param props 组件属性
 * @returns {*} 虚拟DOM或者说React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  ReactCurrentDispatcher.current = HooksDispatcherOnMount;
  // 函数组件执行
  const children = Component(props);
  return children;
}
