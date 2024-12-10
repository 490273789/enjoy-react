import hasOwnProperty from "shared/hasOwnProperty";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import type {
  Config,
  Type,
  Key,
  Props,
  Ref,
  Owner,
  ElementType,
  ReactElement as ReactElementType,
} from "shared/ReactElementType";

/**
 * 保留属性
 * react19中ref已经可以作为prop传递了
 * */
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

/** 校验key属性是否合法,不为undefined即合法 */
function hasValidateKey(config: Config) {
  return config.key !== undefined;
}

/** 校验ref属性是否合法,不为undefined即合法 */
function hasValidateRef(config: Config) {
  return config.ref !== undefined;
}

// 生成react元素，也就是虚拟DOM
function ReactElement(
  type: Type,
  key: Key,
  ref: Ref,
  owner: Owner,
  props: Props,
): ReactElementType {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type, // div span
    key, // 唯一标识
    ref, // 获取真实元素
    props, // id children style 等
    _owner: owner,
  };
}

/**
 * react17之前为createReactElement()
 * 在react17以前key放在config中，第三个参数放children
 * 在react18: children放在第二个参数config中
 * 在react18:
 *  <div key="Hi" {...props}/> <div key="Hi"/> key放在第三个参数 maybeKey 中。
 *  <div {...props} key="Hi" /> key在第二个参数config中
 * @param type 原生标签类型 - div span等
 * @param config 配置项
 * @returns {{ref, $$typeof: symbol, type, key, props}} - ReactElement
 */
export function jsxDEV(
  type: ElementType,
  config: Config,
  maybeKey: Key,
): ReactElementType {
  let propName: string; // 属性名 - style class 等
  // Reserved names are extracted   Reserved adj. 保留的； extract adj. 提炼，提取
  const props = {}; // 属性对象 - style class children等

  let key: string | null = null; // 每个虚拟DOM都一个可选的key属性，用来区分同一个父节点下的不同子节点
  let ref = null; // 可以获取真实DOM

  // Currently, key can be spread in as a prop. This causes a potential
  // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
  // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
  // but as an intermediary step, we will use jsxDEV for everything except
  // <div {...props} key="Hi" />, because we aren't currently able to tell if
  // key is explicitly declared to be undefined or not.
  // tell if 是否，辨别
  // potential adj. 有潜力的； n. 有潜力；电势（物理）
  // spread v. 传播，伸展，展开；n. 传播，伸展；adj. 伸展的
  // explicitly adv. 明白的；明确的；显示的；
  // explicate v. 解释，阐明
  // explicable adj. 可以解释的
  // explicit adj. 明确的，直言不讳的；
  // implicitly adv. 含蓄地，暗示地；
  // implicate v. 牵连，含蓄表达；
  // implication n. 连累，含蓄；
  // implicit adj. 含蓄的；
  // complicate v. 弄复杂；
  // complication n. 混乱，复杂；

  // declare v. 宣布，声明，申报

  // deprecate v. 不赞成，反对 de- prec- 祈祷  ate

  // potent adj. 有效的，有权势的，有说服力的
  // 当前key可以作为prop进行展开传递。如果这个key显示的声明了，这就会引起一个潜在的问题。我们想要弃用key的传播，但是作为一个中间的步骤，
  // 我们将对所有的情况都使用jsxDEV，除了<div {...props} key="Hi" />之外，因为我们当前我们没办法判断key当前是否被显示声明为undefined。

  // 传入的key必须能够转换为string； "" + key 不报错才行
  // <div key="Hi" {...props}/> <div key="Hi"/> 处理这两种情况的key属性，优先级低
  if (maybeKey !== undefined) {
    key = "" + maybeKey;
  }

  // props中展开的key，优先级比maybeKey高
  if (hasValidateKey(config)) {
    key = "" + config.key;
  }

  // 校验ref,获取ref
  if (hasValidateRef(config)) {
    ref = config.ref;
  }

  // Remaining properties are added to a new props object
  // remaining - adj. 剩余的
  for (propName in config) {
    // 是props自身属性，并且是不是保留的属性
    if (
      hasOwnProperty.call(config, propName) &&
      !RESERVED_PROPS.hasOwnProperty(propName)
    ) {
      props[propName] = config[propName];
    }
  }

  return ReactElement(type, key, ref, "ethan", props);
}
