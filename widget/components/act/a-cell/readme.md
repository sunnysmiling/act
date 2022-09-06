
# Cell 单元格

### 介绍

单元格为列表中的单个展示项。

#### 引入

~~~js
import ACellGroup from "../../components/act/a-cell-group";
import ACell from "../../components/act/a-cell";
~~~

## 代码演示

### 基础用法

`Cell` 可以单独使用，也可以与 `CellGroup` 搭配使用，`CellGroup` 可以为 `Cell` 提供上下外边框。

```html
<a-cell-group>
    <a-cell title="单元格" value="内容"/>
    <a-cell title="单元格" value="内容" label="描述信息"/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/mlUjEHgRY1NIMDA.png)

### 单元格大小

通过 `size` 属性可以控制单元格的大小。

```html
<a-cell-group>
    <a-cell title="单元格" value="内容" size="large"/>
    <a-cell title="单元格" value="内容" size="large" label="描述信息"/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/VMbyBCuFwj4IUKW.png)

### 展示图标

通过 `icon` 属性在标题左侧展示图标。

```html
<a-cell title="单元格" icon="map"/>
```

![](https://i.loli.net/2021/02/25/iTbnAsM9le6Yyj2.png)

### 快捷标题

子节点是纯文本的时候被理解成 ` title ` 。

```html
<a-cell>单元格</a-cell>
```

![](https://i.loli.net/2021/02/25/Ye1JjTtsPlVCzKg.png)

### 展示箭头

设置 `is-link` 属性后会在单元格右侧显示箭头，并且可以通过 `arrow-direction` 属性控制箭头方向。

```html
<a-cell-group>
    <a-cell title="单元格" is-link/>
    <a-cell title="单元格" is-link value="内容"/>
    <a-cell title="单元格" is-link arrow-direction="down" value="内容"/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/DlBUyqm8VLATHub.png)

### 页面导航

可以通过 `url` 属性进行 URL 跳转，或通过 `to` 属性进行路由跳转。

```html
<a-cell title="URL 跳转" is-link url="../simple-button/simple-button"/>
<a-cell title="路由跳转" is-link to="simple-button"/>
```

### 分组标题

通过 `CellGroup` 的 `title` 属性可以指定分组标题。

```html
<a-cell-group title="分组1">
    <a-cell title="单元格" value="内容"/>
</a-cell-group>

<a-cell-group title="分组2">
    <a-cell title="单元格" value="内容"/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/ixQIaPjLnUurm1G.png)

### 分组圆角

通过  ` round `  属性让一个 `  cell-group ` 组变成圆角。

```html
<a-cell-group round>
    <a-cell title="单元格"/>
</a-cell-group>
```

![](https://i.loli.net/2021/02/25/mdNnoBJKRjAU3yH.png)

### 使用插槽

如以上用法不能满足你的需求，可以使用插槽来自定义内容。

```html
<a-cell-group>
    <a-cell value="内容" is-link>
        <!-- 使用 title 插槽来自定义标题 -->
        <template _slot="title">
            <text class="custom-title">自定义标题</text>
            <a-tag type="danger">标签</a-tag>
        </template>
    </a-cell>
    
    <a-cell title="相机扫码" icon="camera">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template _slot="right-icon">
            <a-icon name="scanning" class="search-icon"/>
        </template>
    </a-cell>
</a-cell-group>

<style>
  .custom-title {
    margin-right: 4px;
    vertical-align: middle;
  }

  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }
</style>
```

![](https://i.loli.net/2021/02/25/EZ1xTaScCDw8KIe.png)

### 垂直居中

通过 `center` 属性可以让 `Cell` 的左右内容都垂直居中。

```html
<a-cell center title="单元格" value="内容" label="描述信息"/>
```

![](https://i.loli.net/2021/02/25/SW6MDLlUAyRebHX.png)

## API

### CellGroup Props

| 参数   | 说明           | 类型      | 默认值 |
| ------ | -------------- | --------- | ------ |
| title  | 分组标题       | _string_  | `-`    |
| round | 是否为圆角 | _boolean_ | `false` |

### Cell Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 左侧标题 | _number / string_ | - |
| value | 右侧内容 | _number / string_ | - |
| label | 标题下方的描述信息 | _string_ | - |
| size | 单元格大小，可选值为 `large` | _string_ | - |
| icon | 左侧图标名称或图片链接 | _string_ | - |
| url | 点击后跳转的链接stml路径地址 | _string_ | - |
| to | 点击后跳转的目标页面简写地址 | _string / object_ | - |
| is-link | 是否展示右侧箭头并开启点击反馈 | _boolean_ | `false` |
| center | 是否使内容垂直居中 | _boolean_ | `false` |
| arrow-direction | 箭头方向，可选值为 `left` `up` `down` | _string_ | `right` |

### Cell Events

| 事件名 | 说明             | 回调参数            |
| ------ | ---------------- | ------------------- |
| click  | 点击单元格时触发 | _event: MouseEvent_ |

### Cell Slots

| 名称       | 说明                          |
| ---------- | ----------------------------- |
| title      | 自定义左侧 title 的内容       |         |
| right-icon | 自定义右侧按钮，默认为`arrow` |
