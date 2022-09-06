# Tag 标签

## 介绍

用于标记关键词和概括主要内容。

### 引入

```js
import ATag from "../../components/act/a-tag";
```

## 代码演示

### 基础用法

通过 `type` 属性控制标签颜色。

```html
<a-tag type="primary">标签</a-tag>
<a-tag type="success">标签</a-tag>
<a-tag type="danger">标签</a-tag>
<a-tag type="warning">标签</a-tag>
```

![](https://i.loli.net/2021/02/26/fo8YJt65xXa3Lzl.png)

### 空心样式

设置 `plain` 属性设置为空心样式。

```html
<a-tag plain type="primary">标签</a-tag>
```

### 圆角样式

通过 `round` 设置为圆角样式。

```html
<a-tag round type="primary">标签</a-tag>
```

### 标记样式

通过 `mark` 设置为标记样式(半圆角)。

```html
<a-tag mark type="primary">标签</a-tag>
```

### 可关闭标签

添加 `closeable` 属性表示标签是可关闭的，关闭标签时会触发 `close` 事件，在 `close` 事件中可以执行隐藏标签的逻辑。

```html
<a-tag :show="show" closeable type="primary" @close="close">
  标签
</a-tag>
```

```js
export default {
  name: "simple-tag",
  data() {
    return {
      show: true
    }
  },
  methods: {
    close() {
      this.data.show = false;
    }
  }
}
```

![](https://i.loli.net/2021/02/26/FCUDd6Vi21rONX5.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型，可选值为 `primary` `success` `danger` `warning` | _string_ | `default` |
| show | 是否展示标签 | _boolean_ | `true` |
| plain | 是否为空心样式 | _boolean_ | `false` |
| round | 是否为圆角样式 | _boolean_ | `false` |
| mark | 是否为标记样式 | _boolean_ | `false` |
| closeable | 是否为可关闭标签 | _boolean_ | `false` |

### Events

| 事件名 | 说明           | 回调参数            |
| ------ | -------------- | ------------------- |
| close  | 关闭标签时触发 | -                   |

# Toast 轻提示

### 介绍

在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。

### 引入

```js
import {Toast} from "../../components/act";
```

## 代码演示

### 文字提示

```js
Toast('提示内容');
```

### 加载提示

使用 `Toast.loading` 方法展示加载提示，通过 `forbidClick` 属性可以禁用背景点击。

```js
Toast.loading({
  message: '自动加载中...',
  forbidClick: true,
});
```

### 自定义位置

Toast 默认渲染在屏幕正中位置，通过 `position` 属性可以控制 Toast 展示的位置。

```js
Toast('提示内容', 'top');

Toast({
  message: '底部展示',
  position: 'bottom',
});
```

## API

### 方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| Toast | 展示提示 | `options / message` | toast 实例 |
| Toast.loading | 展示加载提示 | `options / message` | toast 实例 |
| Toast.clear | 关闭提示 | `clearAll: boolean` | `void` |

### Options

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| position | 位置，可选值为 `top` `bottom` | _string_ | `middle` |
| message | 文本内容，支持通过`\n`换行 | _string_ | `''` | - |
| forbidClick | 是否禁止背景点击 | _boolean_ | `false` |
| duration | 展示时长(ms) | _number_ | `1500` |
