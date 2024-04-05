const test = (a, b, c) => {
  console.log('test', a, b, c);
};

const main = () => {
  return test.bind(null, 1, 2);
};

const res = main();
res(3);
