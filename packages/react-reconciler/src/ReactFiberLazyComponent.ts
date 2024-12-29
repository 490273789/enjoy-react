import assign from "shared/assign";

export function resolveDefaultProps(Component: any, baseProps: object): object {
  if (Component && Component.defaultProps) {
    const props = assign({}, baseProps);
    const defaultProps = Component.defaultProps;
    for (const propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
    return props;
  }
  return baseProps;
}
