# Ref 组件引用

### 介绍

用于在父组件注册子组件对象的场景。可以在父组件调用子组件方法。

> ` 注意 `  本组件已经弃用，请直接使用框架内部引用方法

## 代码演示

### 基础用法

在组件或者原生元素上使用 ref 创建一个匿名绑定函数，参数为当前组件或者元素的引用指向。

假设有一个 Foo 组件，内部有一个 bar 方法，具体代码如下：
```js
class Foo extends Component {
    render = props => <text>我是组件</text>

    bar() {
        console.log('我是组件内的方法')
    }
}
// (同样适用于 STML 组件，组件内的 methods 方法可以被访问)
```
在页面引用该组件，为其绑定该引用到当前 this 属性上。属性名称是自定义的，推荐 `${组件名}Ref` 这样的标识。

另外，第二行代码还展示了系统组件的引用也是支持的。
```html 
<Foo ref={ el => this.fooRef = el } />

<input ref={ el => this.iptRef = el } value="一个输入框" /> 
```

在 script 中直接使用该引用属性获取子组件对象，访问子组件的方法。

```js
console.log(this.fooRef.bar) // 访问自定义组件的方法
console.log(this.iptRef.value) // 访问系统组件的属性
```

