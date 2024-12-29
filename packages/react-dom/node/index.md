# react-dom

主要定义react DOM操作相关的API

## 流程

### 1.createRoot方法

1. 创建应用程序的根 - ReactDOMRoot
2. 给ReactDOMRoot定义render方法
3. containerInfo部分是调用reconciler中的createContainer完成的
4. 创建FiberRoot和RootFiber，并相互绑定（current，stateNode）
5. 初始化更新队列 - updateQueue

```
ReactDOMRoot: {
  _internalRoot: {
    containerInfo: div#root
  }
}
```

### 2.render方法

开始在根节点渲染页面

1. 调用reconciler中updateContainer方法开始渲染页面
2. 创建当前元素的Update
3. 将update放入RootFiber的updateQueue
4. 开始调度更新
