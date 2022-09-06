
# Popup 弹出层

### 介绍

弹出层容器，用于展示弹窗、信息提示等内容，支持多个弹出层叠加展示。

### 引入

```js
import APopup from "../../components/act/a-popup";
```

## 代码演示

### 基础用法

通过  ` $show `  控制弹出层是否展示。

```html
  <a-cell is-link @click="showPopup">展示弹出层</a-cell>

  <a-popup $show="show">
    <text  @click="test"> 内容</text>
  </a-popup>
```

```js
export default {
  name: "simple-popup",
  data() {
    return {
      show: false
    }
  },
  methods: {
    showPopup() {
      this.data.show = true;
    }
  }
}
```

![](https://i.loli.net/2021/02/26/GXKvUSYVwmWL2jJ.png)

### 弹出位置

通过 `position` 属性设置弹出位置，默认居中弹出，可以设置为 `top`、`bottom`、`left`、`right`。

```html
  <a-popup $show="show" position="top"> <text> 上 </text> </a-popup>
  <a-popup $show="show" position="bottom"> <text> 下 </text> </a-popup>
  <a-popup $show="show" position="left"> <text> 左 </text> </a-popup>
  <a-popup $show="show" position="right"> <text> 右 </text> </a-popup>
```

### 关闭图标

设置 `closeable` 属性后，会在弹出层的右上角显示关闭图标，并且可以通过 `close-icon` 属性自定义图标，使用 `close-icon-position` 属性可以自定义图标位置。

```html
  <a-popup $show="show"
           closeable
           position="bottom"
           style="height: 30%;">
    <text class="demo-content">关闭图标</text>
  </a-popup>


  <a-popup $show="show"
           closeable
           close-icon="success"
           position="bottom"
           style="height: 30%;">
    <text class="demo-content">自定义图标</text>
  </a-popup>


  <a-popup $show="show"
           closeable
           close-icon="close"
           close-icon-position="top-left"
           position="bottom"
           style="height: 30%;">
    <text class="demo-content">关闭图标位置</text>
  </a-popup>


  <a-popup $show="show"
           closeable
           close-icon-color="red"
           position="bottom"
           style="height: 30%;">
    <text class="demo-content">关闭图标颜色</text>
  </a-popup>
```

### 圆角弹窗

设置 `round` 属性后，弹窗会根据弹出位置添加不同的圆角样式。

```html
  <a-popup $show="show"
           closeable
           round
           position="bottom"
           style="height: 30%;">
    <text class="demo-content">圆角弹窗</text>
  </a-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| $show | 是否显示弹出层 | _boolean_ | `false` |
| position | 弹出位置，可选值为 `top` `bottom` `right` `left` | _string_ | `center` |
| round | 是否显示圆角 | _boolean_ | `false` |
| closeable | 是否显示关闭图标 | _boolean_ | `false` |
| close-icon | 关闭图标名称或图片链接 | _string_ | `cross` |
| close-icon-position | 关闭图标位置，可选值为 `top-left`<br>`bottom-left` `bottom-right` | _string_ | `top-right` |

### Events

| 事件名           | 说明                       | 回调参数            |
| ---------------- | -------------------------- | ------------------- |
| close            | 关闭弹出层时触发           | {"detail":{"type":string}}                 |
