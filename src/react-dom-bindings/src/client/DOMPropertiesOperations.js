export function setValueForProperties(node, name, value) {
  if (value === null) {
    node.removeAttribute(name);
  } else {
    node.setAttribute(name, value);
  }
}
