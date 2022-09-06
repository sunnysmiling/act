
# Skeleton 骨架屏

### 介绍

用于在内容加载过程中展示一组占位图形。

### 引入

```js
import "../../components/act/a-skeleton";
```

## 代码演示

### 基础用法

通过 title 属性显示标题占位图，通过 row 属性配置占位段落行数。

```html
<a-skeleton title row="3"/>
```

![](https://docs.apicloud.com/act/skeleton/1.png)

### 显示头像

通过 avatar 属性显示头像占位图。

```html
<a-skeleton title avatar row="3"/>
```

![](https://docs.apicloud.com/act/skeleton/2.png)

### 展示子组件

将 loading 属性设置成 false 表示内容加载完成，此时会隐藏占位图，并显示 Skeleton 的子组件。

```html
<switch style="margin-bottom:16px" onchange="onchange"/>

<a-skeleton loading={loading} title avatar row="3">
  <view class="demo-preview">
    <view>
      <image class="demo-img" src="https://docs.apicloud.com/apicloud3/favicon.png" />
    </view>
    <view style="flex:1">
      <text class="demo-title">{title}</text>
      <text class="demo-desc">{desc}</text>
    </view>
  </view>
</a-skeleton>
</view>
```
```js
export default {
  name: "simple-skeleton",
  data() {
    return {
      title: '关于 act',
      desc: 'act 是一套轻量、可靠的 avm 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。',
      loading: true
    }
  },
  methods: {
    onchange(e) {
      this.data.loading = !e.detail.value;
    }
  }
}
```

![](https://docs.apicloud.com/act/skeleton/3.png)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| loading | 是否显示骨架屏，传 false 时会展示子组件内容  | boolean  | true |
| row     | 段落占位图行数 | number | 0 |
| row-width | 段落占位图宽度，可传数组来设置每一行的宽度 | number / string / (number / string)[] | 100%       |
| title   | 是否显示标题占位图  | boolean  | false |
| avatar | 是否显示头像占位图  | boolean  | false |
| round | 是否将标题和段落显示为圆角风格  | boolean  | false |
| title-width | 标题占位图宽度 | number / string | 40%     |
| avatar-size | 头像占位图大小 | number / string | 32px    |
| avatar-shape | 头像占位图形状，可选值为 square | string | round   |