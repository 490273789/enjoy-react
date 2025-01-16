import { Props } from "shared/ReactElementType";

export type Container = Element | Document | DocumentFragment;
export type Instance = Element;
export type TextInstance = Text;

/**
 * 判断传入的内容是否为文本
 * @param type
 * @param props
 * @returns
 */
export function shouldSetTextContent(type: string, props: Props) {
  return (
    type === "textarea" ||
    type === "noscript" ||
    typeof props.children === "string" ||
    typeof props.children === "number"
  );
}
