
# Stepper 步进器

### 介绍

步进器由增加按钮、减少按钮和输入框组成，用于在一定范围内输入、调整数字。

### 引入

```js
import AStepper from "../../components/act/a-stepper";
```

## 代码演示

### 基础用法

通过  ` $value `  绑定输入值，可以通过  ` change `  事件监听到输入值的变化。

```html
  <a-stepper $value="value" onChange="onChange"/>
  <text>{{ value }}</text>
```

```js
import {Toast} from "../../components/act";
export default {
  name: "simple-stepper",
  data() {
    return {
      value: 2
    }
  },
  methods: {
    onChange(e) {
      Toast(`onChange:\n${JSON.stringify(e)}`)
    }
  }
}
```

![](https://i.loli.net/2021/02/26/W9pjeViUkqZPQ4s.png)

### 步长设置

通过 `step` 属性设置每次点击增加或减少按钮时变化的值，默认为 `1`。

```html
  <a-stepper $value="value" step="2"/>
```

### 限制输入范围

通过 `min` 和 `max` 属性限制输入值的范围。

```html
  <a-stepper $value="value" min="5" max="8" />
```

### 限制输入整数

设置 `integer` 属性后，输入框将限制只能输入整数。

```html
  <a-stepper $value="value" integer />
```

### 禁用状态

通过设置 `disabled` 属性来禁用步进器，禁用状态下无法点击按钮或修改输入框。

```html
  <a-stepper $value="value" disabled />
```

### 禁用输入框

通过设置 `disable-input` 属性来禁用输入框，此时按钮仍然可以点击。

```html
  <a-stepper $value="value" disable-input />
```

### 固定小数位数

通过设置 `decimal-length` 属性可以保留固定的小数位数。

```html
  <a-stepper $value="value" step="0.2" :decimal-length="1" />
```

![](https://i.loli.net/2021/02/26/TrApNbFOYeafP9x.png)

### 自定义大小

通过 `input-width` 属性设置输入框宽度，通过 `button-size` 属性设置按钮大小和输入框高度。

```html
  <a-stepper $value="value" input-width="40" button-size="32" />
```

![](https://i.loli.net/2021/02/26/xLVdwhDGuq7TF4B.png)

### 异步变更

通过 `before-change` 属性可以在

```html
<van-stepper v-model="value" :before-change="beforeChange" />
```

```js
import {Toast} from "../../components/act";

export default {
  name: "simple-stepper",
  data() {
    return {
      value: 2
    }
  },
  methods: {
    beforeChange(value) {
      Toast.loading({forbidClick: true, message: `正在提交 : ${value}`});
      return new Promise((resolve) => {
        setTimeout(() => {
          Toast.clear();
          // 在 resolve 函数中返回 true 或 false
          const result = Math.random() > 0.5;
          resolve(result);
          Toast(result ? '成功' : '失败')
        }, 1000);
      });
    }
  }
}
```

### 圆角风格

将 `theme` 设置为 `round` 来展示圆角风格的步进器。

```html
  <a-stepper $value="value" theme="round" button-size="22" disable-input />
```

![](https://i.loli.net/2021/02/26/C6G7hM5DbXPzl8J.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| $value | 当前输入的值 | _number / string_ | - |
| min | 最小值 | _number / string_ | `1` |
| max | 最大值 | _number / string_ | - |
| step | 步长，每次点击时改变的值 | _number / string_ | `1` |
| input-width | 输入框宽度，默认单位为 `px` | _number / string_ | `32px` |
| button-size | 按钮大小以及输入框高度，默认单位为 `px` | _number / string_ | `28px` |
| decimal-length | 固定显示的小数位数 | _number / string_ | - |
| theme | 样式风格，可选值为 `round` | _string_ | - |
| integer | 是否只允许输入整数 | _boolean_ | `false` |
| disabled | 是否禁用步进器 | _boolean_ | `false` |
| disable-input | 是否禁用输入框 | _boolean_ | `false` |
| before-change | 输入值变化前的回调函数，返回 `false` 可阻止输入，支持返回 Promise | _(value) => boolean / Promise_ | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 当绑定值变化时触发的事件 | _value: string, detail: { name: string }_ |
