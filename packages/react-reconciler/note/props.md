# props

- props在react中充当的角色：将父组件的数据传给子组件消费，可以通过callback向父组件传递信息，将视图容器作为props进行渲染
- vue更新力度会到组件级别，但是react的跟新是无法直接检测出数据更新所波及的范围，props是作为组件是否更新的重要准则，变化即更新，于是有了PureComponent和memo的性能优化方案

- 类组件监听 props的生命周期 getDerivedStateFromProps
- 函数组件中可以使用useEffect来监听props
