# Badge 徽标

### 介绍

在右上角展示徽标数字或小红点。

### 引入

~~~js
import ABadge from "../../components/act/a-badge";
~~~

## 代码示例

### 基础用法

设置  ` content `  属性后， ` Badge `  会在子元素的右上角显示对应的徽标，也可以通过 dot 来显示小红点。

~~~html
<a-badge :content="5">
    <div class="child"/>
</a-badge>

<a-badge :content="10">
    <div class="child"/>
</a-badge>

<a-badge content="Hot">
    <div class="child"/>
</a-badge>

<a-badge dot>
    <div class="child"/>
</a-badge>
~~~

![](https://i.loli.net/2021/02/24/r6WsDdoB8eFhwYE.png)

### 最大值

设置  ` max `  属性后，当  ` content `  的数值超过最大值时，会自动显示为  ` max+ ` 。

~~~html
<a-badge :content="20" max="9">
    <div class="child"/>
</a-badge>

<a-badge :content="50" max="20">
    <div class="child"/>
</a-badge>
          
<a-badge :content="200" max="99">
    <div class="child"/>
</a-badge>
~~~

![](https://i.loli.net/2021/02/24/dPQNopJWnh4la2L.png)

### 自定义颜色

通过  ` color `  属性来设置徽标的颜色。

~~~html
<a-badge :content="5" color="#1989fa">
    <div class="child"/>
</a-badge>
          
<a-badge :content="10" color="#1989fa">
    <div class="child"/>
</a-badge>
          
<a-badge dot color="#1989fa">
    <div class="child"/>
</a-badge>
~~~

![](https://i.loli.net/2021/02/24/P6iMGXrTfgANnme.png)

### 独立展示

当  ` Badge `  没有子元素时，会作为一个独立的元素进行展示。

~~~html
<a-badge :content="20"/>

<a-badge :content="200" max="99"/>
~~~

![](https://i.loli.net/2021/02/24/hz9jMqmHtgXyWcf.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 徽标内容 | _number_ | string_ | - |
| color | 徽标背景颜色 | _string_ | `#ee0a24` |
| dot | 是否展示为小红点 | _boolean_ | `false` |
| max | 最大值，超过最大值会显示 `{max}+`，仅当  ` content `  为数字时有效 | _number / string_ | - |
| offsetX | 从右侧开始计算横向的偏移量 | _number_ | `-5` |
| offsetY | 从顶侧开始计算纵向的偏移量 | _number_ | `-5` |
| size | 徽标内文字大小 | _number_ | `10` |
