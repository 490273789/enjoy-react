import { ReactElement } from "./ReactElementType";

export type Source = {
  fileName: string;
  lineNumber: number;
};
export type ReactNode = ReactElement | ReactText | ReactFragment;

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty | Iterable<ReactNode>;

export type ReactText = string | number;

export type ReactNodeList = ReactEmpty | ReactNode;

export type RefObject = {
  current: any;
};
