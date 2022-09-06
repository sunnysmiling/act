
# Empty 空状态

#### 介绍

空状态时的占位提示。

#### 引入

```js
import AEmpty from "../../components/act/a-empty";
```

## 代码演示

### 基础用法

```html
  <a-empty description="描述文字"/>
```

![](https://i.loli.net/2021/02/25/3K6JDIw7PB8Akvu.png)

### 图片类型

Empty 组件内置了多种占位图片类型，可以在不同业务场景下使用。

```html
<!-- 通用错误 -->
    <a-empty image="error" description="通用错误"/>
<!-- 网络错误 -->
    <a-empty image="network" description="网络错误"/>
<!-- 搜索提示 -->
    <a-empty image="search" description="搜索提示"/>
```

![](https://i.loli.net/2021/02/25/cV7apnWADFCoBNd.png)

### 自定义图片

需要自定义图片时，可以在 image 属性中传入任意图片 URL。

```html
<a-empty class="custom-image"
    image="https://icon.yangyongan.com/?name=warning&size=64&scale=2&color=_ddd"
    description="描述文字"/>
```

![](https://i.loli.net/2021/02/25/8fJTcIuNmB1QVxk.png)

### 底部内容

通过默认插槽可以在 Empty 组件的下方插入内容。

```html
<a-empty description="描述文字">
    <a-button round type="danger" class="bottom-button">按钮测试</a-button>
</a-empty>
```

![](https://i.loli.net/2021/02/25/EmoaektOl2pNFsA.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 图片类型，可选值为 `error` `network` `search`，支持传入图片 URL | _string_ | `default` |
| image-size | 图片大小，默认单位为 `px` | _number / string_ | - |
| description | 图片下方的描述文字 | _string_ | - |
