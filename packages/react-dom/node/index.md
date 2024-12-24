# react-dom

主要定义react DOM操作相关的API

## createRoot方法

- 创建应用程序的根 - ReactDOMRoot
- 给ReactDOMRoot定义render方法
- containerInfo部分是调用reconciler中的createContainer完成的

```
ReactDOMRoot: {
  _internalRoot: {
    containerInfo: div#root
  }
}
```

## render方法

开始在根节点渲染页面

- 调用reconciler中updateContainer方法开始渲染页面
