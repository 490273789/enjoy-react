import {setValueForStyles} from './CSSProppertiesOperations';
import setTextContent from './setTextContent';
import {setValueForProperties} from './DOMPropertiesOperations';

const STYLE = 'style';
const CHILDREN = 'children';

/**
 * 设置dom的属性值，主要是dom操作
 * @param {*} domElement
 * @param {*} tag
 * @param {*} nextProps
 */
export function setInitialDOMProperties(domElement, tag, nextProps) {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey];
      if (propKey === STYLE) {
        setValueForStyles(domElement, nextProp);
      } else if (propKey === CHILDREN) {
        if (typeof nextProp === 'string') {
          setTextContent(domElement, nextProp);
        } else if (typeof nextProp === 'number') {
          setTextContent(domElement, '' + nextProp);
        }
      } else if (nextProp !== null) {
        setValueForProperties(domElement, propKey, nextProp);
      }
    }
  }
}

export function setInitialProperties(domElement, tag, props) {
  setInitialDOMProperties(domElement, tag, props);
}
