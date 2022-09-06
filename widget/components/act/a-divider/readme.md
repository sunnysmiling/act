
# Divider 分割线

### 介绍

用于将内容分隔为多个区域。

### 引入

```js
import "../../components/act/a-divider";
```

## 代码演示

### 基础用法

默认渲染一条水平分割线。。

```html
<a-divider/>
```

![](https://docs.apicloud.com/act/divider/1.png)

### 展示文字

通过 content 可以在分割线中间插入内容。

```html
<a-divider content="文本"/>
```

![](https://docs.apicloud.com/act/divider/2.png)

### 内容位置

通过 content-position 指定内容所在位置。

```html
<a-divider content="文本" content-position="left"/>
<a-divider content="文本" content-position="right"/>
```

![](https://docs.apicloud.com/act/divider/3.png)

### 虚线

添加 dashed 属性使分割线渲染为虚线。

```html
<a-divider dashed content="文本"/>
```

![](https://docs.apicloud.com/act/divider/4.png)

### 自定义样式

可以通过 color 设置文字颜色，通过 line-color 设置线条颜色。

```html
<a-divider style="padding:0 16px;" color="#1989fa" line-color="#1989fa" content="文本"/>
```

![](https://docs.apicloud.com/act/divider/5.png)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| content     | 插入的文本内容 | string_ |     -    |
| content-position | 内容位置，可选值为 left、right | _string_           | center |
| dashed  | 是否使用虚线   | _boolean_          | false     |
| color | 文本颜色             | _string_           | #969799 |
| line-color | 线条颜色             | _string_           | #ebedf0 |
