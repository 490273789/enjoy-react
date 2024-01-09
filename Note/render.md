## React初始化流程

#### 初始化结构

```javascript
const element = (
  <h1
    onClick={() => console.log('父冒泡')}
    onClickCapture={() => console.log(`父捕获`)}>
    hello,
    <span
      onClick={() => console.log('子冒泡')}
      onClickCapture={() => console.log(`子捕获`)}
      style={{color: 'red'}}>
      world
    </span>
  </h1>
);
```
