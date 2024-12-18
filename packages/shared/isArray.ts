const isArrayImpl = Array.isArray;

function isArray(a: unknown) {
  return isArrayImpl(a);
}

export default isArray;
