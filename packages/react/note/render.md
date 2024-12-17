# Render

## 触发更新的方式

- ReactDOM.createRoot().render() 首次更新
- this.setState()
- useState或useReducer 的dispatch方法

### react实现了一套统一的更新机制

- 兼容上述的更新方式
- 方便后续扩展（优先级机制）

### 更新机制的组成部分

- 代表更新的数据结构Update
- 消费update的数据结构 - UpdateQueue
