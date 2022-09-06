# Grid 宫格

### 介绍

宫格可以在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航。

### 引入

```js
import AGrid from "../../components/act/a-grid";
import AGridItem from "../../components/act/a-grid-item";
```

## 代码演示

### 基础用法

通过 `icon` 属性设置格子内的图标，`text` 属性设置文字内容。

```html
  <a-grid>
    <a-grid-item icon="picture" text="文字"/>
    <a-grid-item icon="picture" text="文字"/>
    <a-grid-item icon="picture" text="文字"/>
    <a-grid-item icon="picture" text="文字"/>
  </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/eajVH1yAbJUI69x.png)

### 自定义列数

默认一行展示四个格子，可以通过 `column-num` 自定义列数。

```html
  <a-grid :column-num="3">
    <a-grid-item v-for="value in Array.from({length:6})" icon="picture" text="文字"/>
  </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/YNmyOVrqETU5Zf2.png)

### 自定义内容

通过默认插槽可以自定义格子展示的内容。 通过 border 属性控制是否有边框。

```html
  <a-grid :border="false" :column-num="3">
    <a-grid-item>
      <img src="https://img.yzcdn.cn/vant/apple-1.jpg" alt="" class="demo-img"/>
    </a-grid-item>
    <a-grid-item>
      <img src="https://img.yzcdn.cn/vant/apple-2.jpg" alt="" class="demo-img"/>
    </a-grid-item>
    <a-grid-item>
      <img src="https://img.yzcdn.cn/vant/apple-3.jpg" alt="" class="demo-img"/>
    </a-grid-item>
  </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/CZfupc1aNrnJ3RD.png)

### 正方形格子

设置 `square` 属性后，格子的高度会和宽度保持一致。

```html
  <a-grid square>
    <a-grid-item v-for="value in Array.from({length:8})" :key="value" icon="picture" text="文字"/>
  </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/1gUS6Zqm52PNjVr.png)

### 格子间距

通过 `gutter` 属性设置格子之间的距离。

```html
<a-grid square>
   <a-grid-item v-for="value in Array.from({length:8})" :key="value" icon="picture" text="文字"/>
</a-grid>
```

![image.png](https://i.loli.net/2021/04/08/oPawODLZXjAbgn5.png)

### 内容横排

将 `direction` 属性设置为 `horizontal`，可以让宫格的内容呈横向排列。

```html
    <a-grid direction="horizontal" :column-num="3">
       <a-grid-item v-for="value in Array.from({length:3})" :key="value" icon="picture" text="文字"/>
    </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/7HPbzp4DO9BTr5l.png)

### 页面导航

可以通过 `url` 属性进行 URL 跳转，或通过 `to` 属性进行路由跳转。

```html
 <a-grid :column-num="2">
    <a-grid-item icon="home" text="路由跳转" to="simple-button"/>
    <a-grid-item icon="search" text="URL 跳转" url="../simple-button/simple-button"/>
  </a-grid>
```

### 徽标提示

设置 `dot` 属性后，会在图标右上角展示一个小红点。设置 `badge` 属性后，会在图标右上角展示相应的徽标。

```html
  <a-grid :column-num="2">
    <a-grid-item icon="home" text="文字" dot/>
    <a-grid-item icon="search" text="文字" badge="99+"/>
  </a-grid>
```

![image.png](https://i.loli.net/2021/04/08/mkMu9DtdxH12Kgc.png)

## API

### Grid Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| column-num | 列数 | _number \| string_ | `4` |
| icon-size | 图标大小，默认单位为`px` | _number \| string_ | `28px` |
| gutter | 格子之间的间距，默认单位为`px` | _number \| string_ | `0` |
| border | 是否显示边框 | _boolean_ | `true` |
| square | 是否将格子固定为正方形 | _boolean_ | `false` |
| direction | 格子内容排列的方向，可选值为 `horizontal` | _string_ | `vertical` |

### GridItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 文字 | _string_ | - |
| icon | 图标名称或图片链接 | _string_ | - |
| dot | 是否显示图标右上角小红点 | _boolean_ | `false` |
| badge | 图标右上角徽标的内容 | _number \| string_ | - |
| url | 点击后跳转的链接地址 | _string_ | - |
| to | 点击后跳转的目标路由对象 | _string \| object_ | - |
| center | 是否将格子内容居中显示 | _boolean_ | `true` |

### GridItem Events

| 事件名 | 说明           | 回调参数            |
| ------ | -------------- | ------------------- |
| click  | 点击格子时触发 | _event: MouseEvent_ |

### GridItem Slots

| 名称    | 说明                 |
| ------- | -------------------- |
| default | 自定义宫格的所有内容 |
