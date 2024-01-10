const Placement = 0b0001;
const Update = 0b0010;

let role = 0;
// 添加权限
role |= Placement;
console.log('role |= Placement - ', role.toString(2));
// 修改权限
role |= Update;
console.log('role |= Update - ', role.toString(2));
// 判断权限
const isPlacement = (role & Placement) === Placement;
console.log('isPlacement - ', isPlacement);
// 删除权限 - 取反对应位不同 通过&=0，实现删除权限
role &= ~Placement;
console.log('role &= ~Placement - ', role.toString(2));

// 异或 如果这个权限不存在使添加权限的操作，如果这个权限存在则是删除权限的操作
role ^= Update;
console.log('role ^= Update - ', role.toString(2));
role ^= Update;
console.log('role ^= Update - ', role.toString(2));
