# Tab 标签页

### 介绍

选项卡组件，用于在不同的内容区域之间进行切换。

### 引入

```js
import ATabs from "../../components/act/a-tabs";
import ATab from "../../components/act/a-tab";
```

## 代码演示

### 基础用法

通过 `$active` 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。

```html
  <a-tabs $active="active[0]">
    <a-tab title="标签 1"><text>内容 1</text></a-tab>
    <a-tab title="标签 2"><text>内容 2</text></a-tab>
    <a-tab title="标签 3"><text>内容 3</text></a-tab>
    <a-tab title="标签 4"><text>内容 4</text></a-tab>
  </a-tabs>
```

```js
export default {
  name: "simple-tab",
  components: {ATabs, ATab},
  data() {
    return {
      active: [2, 0]
    }
  }
};
```

### 标签栏滚动

标签数量超过 5 个时，标签栏可以在水平方向上滚动，切换时会自动将当前标签居中。

```html
  <a-tabs $active="active[1]">
    {Array.from({ length:8 },( _ , i ) => i + 1 ).map( i =>
    <a-tab title={`标签 ${i}`}>
      <text>内容 {i}</text>
    </a-tab>
    )}
  </a-tabs>
```

### 样式风格

`Tab` 支持两种样式风格：`line` 和`card`，默认为 `line` 样式，可以通过 `type` 属性切换样式风格。

```html
  <a-tabs type="card">
    <a-tab title="标签 1">
      <text>内容 1</text>
    </a-tab>
    <a-tab title="标签 2">
      <text>内容 2</text>
    </a-tab>
    <a-tab title="标签 3">
      <text>内容 3</text>
    </a-tab>
  </a-tabs>

```

### 异步切换

通过 `before-change` 属性可以在切换标签前执行特定的逻辑。

```html
  <a-tabs :before-change="this.beforeChange">
    {Array.from({ length:4 },( _ , i ) => i + 1 ).map( i =>
    <a-tab title={`标签 ${i}`}>
      <text>内容 {i}</text>
    </a-tab>
    )}
  </a-tabs>
```

```js

export default {
  name: "simple-tab",
  components: {ATabs, ATab},
  methods: {
    onClick: (name, title) => Toast(`${name}已被禁用`),
    beforeChange(index) {
      console.log('beforeChange')
      // 返回 false 表示阻止此次切换
      if (index === 1) {
        return false;
      }

      // 返回 Promise 来执行异步逻辑
      return new Promise((resolve) => {
        // 在 resolve 函数中返回 true 或 false

        Toast.loading({forbidClick: true, message: `正在异步请求`});

        setTimeout(() => {
          resolve(index !== 3);
          Toast.clear();
        }, 1000)
      });
    }
  }
}
```

## API

### Tabs Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| $active | 绑定当前选中标签的标识符 | _number \| string_ | `0` |
| type | 样式风格类型，可选值为 `card` | _string_ | `line` |
| breakpoint | 滚动阈值，标签数量超过阈值且总宽度超过标签栏宽度时开始横向滚动 | _number \| string_ | `5` |
| before-change | 切换标签前的回调函数，返回 `false` 可阻止切换，支持返回 Promise | _(name) => boolean \| Promise_ | - |

### Tabs Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当前激活的标签改变时触发 | _{"current":number,"type":string}_ |


