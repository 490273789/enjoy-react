import {setInitialProperties} from './ReactDOMComponents';
import {precacheFiberNode} from './ReactDOMComponentTree';
import {updateFiberProps} from './ReactDOMComponentTree';

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  // 将fiber节点挂载到对相应的真是DOM中
  precacheFiberNode(internalInstanceHandle, domElement);
  // 将fiber的props挂载到对应的DOM上
  updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalInitialChild(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parentInstance, child) {
  parentInstance.appendChild(child);
}
export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}
