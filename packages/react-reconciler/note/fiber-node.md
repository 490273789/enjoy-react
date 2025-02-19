# Container

## HostRootFiber & FiberRootNode

```
FiberRootNode: {
  containerInfo: div#root
}
```

## createContainer

- 将rootDOM添加到FiberRoot的containerInfo属性中

## updateContainer

- 创建一个update
- 给update添加payload属性添加值，值为传入的ReactNodeList
- 将update添加到container对应的fiber上
- 调度更新

## updateQueue

- initializedUpdateQueue - 初始化一个fiber update队列
- createUpdate - 创建update
- enqueueUpdate - 将update放入队列中
- processUpdateQueue - 执行update队列， 更新fiber的memoizedStates
