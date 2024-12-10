export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;
export type Owner = string;
export interface ReactElement {
  $$typeof: symbol | number;
  type: ElementType;
  key: Key;
  props: Props;
  ref: Ref;
  _owner: Owner;
}

export type Config = Record<string, any>;
