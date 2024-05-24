const Placement = 0b0001;
const Update = 0b0010;

let role = 0;
// 添加权限
role |= Placement;
console.log("role |= Placement - ", role.toString(2));

role |= Update;
console.log("role |= Update - ", role.toString(2));

// 判断是否有权限
const isPlacement = (role & Placement) === Placement;
console.log("isPlacement - ", isPlacement);

// 删除权限 - 取反对应位不同 通过&=0，实现删除权限
role &= ~Placement;
console.log("role &= ~Placement - ", role.toString(2));

// 不相同为0
role ^= Update;
console.log("role ^= Update - ", role.toString(2));
role ^= Update;
console.log("role ^= Update - ", role.toString(2));
