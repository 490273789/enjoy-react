export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === 'string' || typeof props.children === 'number'
  );
}

export function createTextInstance(content) {
  return document.createTextNode(content);
}
