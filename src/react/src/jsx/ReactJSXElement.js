import hasOwnProperty from 'shared/hasOwnProperty';
import {REACT_ELEMENT_TYPE} from 'shared/ReactSymbols';

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};
function hasValidateKey(config) {
  return config.key !== undefined;
}

function hasValidateRef(config) {
  return config.ref !== undefined;
}
// 生成react元素，也就是传说中的虚拟DOM
function ReactElement(type, key, ref, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  };
}
export function jsxDEV(type, config) {
  let propName; // 属性名
  const props = {}; // 属性对象
  let key = null; // 每个虚拟DOM都一个可选的key属性，用来区分一个父节点下的不同子节点
  let ref = null; // 可以获取真实DOM

  if (hasValidateKey(config)) {
    key = config.key;
  }
  if (hasValidateRef(config)) {
    ref = config.ref;
  }

  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  return ReactElement(type, key, ref, props);
}
