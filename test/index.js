const a = 0b00000000000000000000000000;
const b = 0b00000000000000000000101011;
const c = 0b00000000000000000000000111;
// | 有一个为1 就是1
const res1 = b | c;
console.log(res1.toString(2));

// & 都为1才是1
const res2 = b & c;
console.log(res2.toString(2));

// ^ 不相同为1
const res3 = b ^ c;
console.log(res3.toString(2));

const f = 0b00000000000000000000000001;
let e = 0b00000000000000000000000011;

e &= ~f;

console.log('', e.toString(2));
