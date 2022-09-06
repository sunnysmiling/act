# Layout 布局

#### 介绍

Layout 提供了 a-row 和 a-col 两个组件来进行行列布局。

#### 引入

```js
import ARow from "../../components/act/a-row";
import ACol from "../../components/act/a-col";
```

## 代码演示

### 基础用法

Layout 组件提供了 `24列栅格`，通过在 `Col` 上添加 `span` 属性设置列所占的宽度百分比。 此外，添加 `offset` 属性可以设置列的偏移宽度，计算方式与 span 相同。

```html
  <a-row>
    <a-col span="8">
      <text>span: 8</text>
    </a-col>
    <a-col span="8">
      <text>span: 8</text>
    </a-col>
    <a-col span="8">
      <text>span: 8</text>
    </a-col>
  </a-row>

  <a-row>
    <a-col span="4">
      <text>span: 4</text>
    </a-col>
    <a-col span="10" offset="4">
      <text>offset: 4, span: 10</text>
    </a-col>
  </a-row>

  <a-row>
    <a-col offset="12" span="12">
      <text>offset: 12, span: 12</text>
    </a-col>
  </a-row>
```

![](https://i.loli.net/2021/02/25/AbXJPtNvzIUVeMK.png)

### 设置列元素间距

通过 `gutter` 属性可以设置列元素之间的间距，默认间距为 0。

```html
<a-row gutter="20">
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
</a-row>
    
<a-row gutter="40">
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
    <a-col span="8">
      <view><text>span: 8</text></view>
    </a-col>
</a-row>
```

![](https://i.loli.net/2021/02/25/nTBHOR5z7ruLgAq.png)

### 对齐方式

通过 `justify` 属性可以设置主轴上内容的对齐方式，等价于 flex 布局中的 `justify-content` 属性。

```html
  <!-- 居中 -->
  <a-row justify="center">
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
  </a-row>


  <!-- 右对齐 -->
  <a-row justify="end">
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
  </a-row>

  <!-- 两端对齐 -->
  <a-row justify="space-between">
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
  </a-row>

  <!-- 每个元素的两侧间隔相等 -->
  <a-row justify="space-around">
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
    <a-col span="6"><text>span: 6</text></a-col>
  </a-row>
```

![](https://i.loli.net/2021/02/25/kI1JXc5BbmEDzGK.png)

## API

### Row Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 列元素之间的间距（单位为 px） | _number / string_ | - |
| justify | 主轴对齐方式，可选值为 `end` `center` <br> `space-around` `space-between` | _string_ | `start` |

### Col Props

| 参数   | 说明           | 类型               | 默认值 |
| ------ | -------------- | ------------------ | ------ |
| span   | 列元素宽度     | _number / string_ | -      |
| offset | 列元素偏移距离 | _number / string_ | -      |
