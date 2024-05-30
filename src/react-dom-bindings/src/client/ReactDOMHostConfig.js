import {setInitialProperties} from "./ReactDOMComponents";
import {preCacheFiberNode} from "./ReactDOMComponentTree";
import {updateFiberProps} from "./ReactDOMComponentTree";

/**
 * 判断是否为文本节点
 * @param {*} type 节点类型
 * @param {*} props 节点的props
 * @returns
 */
export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

/**
 * 创建文本节点
 * @param {*} content  文本内容
 * @returns 返回这个节点对象
 */
export function createTextInstance(content) {
  return document.createTextNode(content);
}

/**
 * 创建原生标签的真实DOM
 * @param {*} type 标签名  - div span
 * @param {*} props 标签上属性
 * @param {*} internalInstanceHandle 当前节点的Fiber
 * @returns DOM的实例
 */
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  // 将fiber节点挂载到对相应的真是DOM中
  preCacheFiberNode(internalInstanceHandle, domElement);
  // 将fiber的props挂载到对应的DOM上
  updateFiberProps(domElement, props);
  return domElement;
}

/**
 * 将子节点挂载到父节点上
 * @param {*} parent 父节点DOM
 * @param {*} child 子节点DOM
 */
export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

/**
 *
 * @param {*} domElement 当前的实例
 * @param {*} type fiber类型
 * @param {*} props 新的节点的属性
 */
export function finalizeInitialChild(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
