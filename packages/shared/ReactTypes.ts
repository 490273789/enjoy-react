import { ReactElement } from "./ReactElementType";

export type Source = {
  fileName: string;
  lineNumber: number;
};
export type ReactNode = ReactElement | ReactText | ReactFragment;

export type ReactEmpty = null | void | boolean;
export type ReactFragment = ReactEmpty;
export type ReactText = string | number;

export type RefObject = {
  current: any;
};
