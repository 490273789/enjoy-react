export const NoFlags = 0b00000000000000000000000000;
// You can change the rest (and add more).
export const Placement = 0b00000000000000000000000010; // 添加新节点
export const Update = 0b00000000000000000000000100;
export const Deletion = 0b00000000000000000000001000;
export const ChildDeletion = 0b00000000000000000000010000;

export const MutationMask = Placement | Update | ChildDeletion;
