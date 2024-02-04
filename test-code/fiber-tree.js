// 1。将虚拟DOM构建为fiber树
let A1 = {type: 'div', props: {id: 'A1'}};
let B1 = {type: 'div', props: {id: 'B1'}, return: A1};
let B2 = {type: 'div', props: {id: 'B2'}, return: A1};
let C1 = {type: 'div', props: {id: 'C1'}, return: B1};
let C2 = {type: 'div', props: {id: 'C2'}, return: B2};

A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

function hasTime() {
  return true;
}

// 下一个工作单元
let nextUnitOfWork = null;
// render工作循环
function workLoop() {
  // 每个fiber 执行完成后都可以放弃执行，让浏览器执行更高优先级的任务
  while (nextUnitOfWork && hasTime()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log('render阶段结束');
}

function performUnitOfWork(fiber) {
  let child = beginWork(fiber);
  if (child) {
    return child;
  }
  // 如果没有子节点，完成当前fiber，继续寻找兄弟fiber
  // 如果有兄弟fiber，返回兄弟fiber
  // 没有字fiber并且没有兄弟fiber的情况下，开始处理父fiber的完成工作
  while (fiber) {
    completeWork(fiber);
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function beginWork(fiber) {
  console.log('beginWork', fiber.props.id);
  return fiber.child;
}

function completeWork(fiber) {
  console.log('completeWork', fiber.props.id);
}

nextUnitOfWork = A1;
workLoop();
