import {setInitialProperties} from './ReactDOMComponents';

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}

export function createInstance(type) {
  const domElement = document.createElement(type);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalInitialChild(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}
