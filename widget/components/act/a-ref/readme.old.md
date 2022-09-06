# Ref 组件引用

### 介绍

用于在父组件注册子组件对象的场景。可以在父组件调用子组件方法。

> ` 注意 ` 本组件已经弃用，请直接使用[框架内部引用方法](./readme.md)

### 引入

```js
import ARef from "../../components/act/a-ref";
```

## 代码演示

### 基础用法

通过 name 属性注册在组件 $refs 中的名称。

```html

 <a-ref name="countDown">
     <a-count-down @finish="onFinish"/>
 </a-ref>
  
```

在 script 中使用 $refs 获取子组件对象，访问子组件的方法。

```js
this.$refs.countDown.start();
```

