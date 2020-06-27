---
title: react
category:
 - javascript
tags:
 - react
publish: false
---

## start

```jsx
import ReactDOM from 'react-dom'
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
)
```

## jsx

` eg: `

```jsx
const name = 'world'
const element = <h1>Hello, { name }!</h1>
```

<b>jsx 可以有效地防止注入攻击(xss)</b>

` ReactDom `会对所有的输入内容进行转义

## components && props

独立的 可重用的代码片段

### 函数组件

```jsx
function hello(props) {
  return (
    <h1>hello, { props.name }</h1>
  )
}
```

### class组件

```jsx
class hello extends React.Component {
  render() {
    return (
      <h1>hello, { this.props.name }</h1>
    )
  }
}
```

