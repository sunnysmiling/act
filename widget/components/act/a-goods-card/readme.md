
# GoodsCard 商品卡片

### 介绍

商品卡片，用于展示商品的图片、价格等信息。

### 引入

```js
import AGoodsCard from "../../components/act/a-goods-card";
```

## 代码演示

### 基础用法

```html
  <a-goods-card
      num="2"
      price="2.00"
      desc="描述信息"
      title="商品标题"
      thumb="https://www.apicloud.com/icon/91/d1/91d1cae110eb88a6789da0d63b418f5c.png"
  />
```

### 营销信息

通过 `origin-price` 设置商品原价，通过 `tag` 设置商品左上角标签。

```html
  <a-goods-card
      num="2"
      tag="标签"
      price="2.00"
      desc="描述信息"
      title="商品标题"
      thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
      origin-price="10.00"
  />
```

### 自定义内容

`GoodsCard` 组件提供了多个插槽，可以灵活地自定义内容。

```html
  <a-goods-card
      num="2"
      price="2.00"
      desc="描述信息"
      title="商品标题"
      thumb="https://www.apicloud.com/img/default.png">
    
    <template _slot="tags">
      <a-tag plain type="danger">标签</a-tag>
      <a-tag plain type="danger">标签</a-tag>
    </template>
    <template _slot="footer">
      <a-button size="mini" round @click="test">按钮</a-button>
      <a-button size="mini" round>按钮</a-button>
    </template>
  </a-goods-card>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| thumb | 左侧图片 URL | _string_ | - |
| title | 标题 | _string_ | - |
| desc | 描述 | _string_ | - |
| tag | 图片角标 | _string_ | - |
| num | 商品数量 | _number / string_ | - |
| price | 商品价格 | _number / string_ | - |
| origin-price | 商品划线原价 | _number / string_ | - |
| currency | 货币符号 | _string_ | `¥` |

### Events

| 事件名      | 说明                 | 回调参数            |
| ----------- | -------------------- | ------------------- |
| click-thumb | 点击自定义图片时触发 | _event: MouseEvent_ |

### Slots

| 名称         | 说明                   |
| ------------ | ---------------------- |
| tags         | 自定义描述下方标签区域 |
| footer       | 自定义右下角内容       |
