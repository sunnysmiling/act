
# PullRefresh 下拉刷新

### 介绍

用于提供下拉刷新的交互操作。放置在 scroll-view、list-view 等滚动组件内部时生效，只支持 App 端。

### 引入

```js
import "../../components/act/a-pull-refresh";
```

## 代码演示

### 基础用法

下拉刷新时会触发 refresh 事件，在事件的回调函数中可以进行获取数据等操作，操作完成后将 $refreshing 设置为 false，恢复刷新状态。

```html
<a-pull-refresh $refreshing="isLoading" @refresh="onRefresh"/>
```

```js
export default {
  name: "simple-pull-refresh",
  data() {
    return {
      isLoading: false
    }
  },
  methods:{
    onRefresh() {
      setTimeout(() => {
        this.data.isLoading = false;
      }, 2000);
    }
  }
}
</script>
```

![](https://docs.apicloud.com/act/pullrefresh/1.gif)

### 成功提示

通过 success-text 可以设置刷新成功后的顶部提示文案，通过 success-duration 可以设置文案展示的时长。

```html
<a-pull-refresh $refreshing="isLoading" success-text="刷新成功" success-duration="1000" @refresh="onRefresh"/>
```

```js
export default {
  name: "simple-pull-refresh",
  data() {
    return {
      isLoading: false
    }
  },
  methods:{
    onRefresh() {
      setTimeout(() => {
        this.data.isLoading = false;
      }, 2000);
    }
  }
}
</script>
```

![](https://docs.apicloud.com/act/pullrefresh/2.gif)

### 自定义提示

通过插槽可以自定义下拉刷新过程中的提示内容。

```html
<a-pull-refresh $refreshing="isLoading" head-height="80" @refresh="onRefresh" @pulling="onPulling">
  <!-- 下拉提示，通过 scale 实现一个缩放效果 -->
  <template _slot="pulling">
    <img 
      src="https://docs.apicloud.com/act/img/doge.png" 
      class="doge"
      style={`transform:scale(${Math.min(distance/80,1)})`}
    />
  </template>
  <template _slot="loosing">
    <img src="https://docs.apicloud.com/act/img/doge.png" class="doge" />
  </template>
  <template _slot="loading">
    <img src="https://docs.apicloud.com/act/img/doge-fire.jpg" class="doge" />
  </template>
</a-pull-refresh>
```

```js
export default {
  name: "simple-pull-refresh",
  data() {
    return {
      isLoading: false,
      distance: 0
    }
  },
  methods:{
    onRefresh() {
      setTimeout(() => {
        this.data.isLoading = false;
      }, 2000);
    },
    onPulling(e) {
      this.data.distance = e.detail.distance;
    }
  }
}
</script>
```

![](https://docs.apicloud.com/act/pullrefresh/3.gif)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| $refreshing | 是否处于加载中状态 | boolean | - |
| pulling-text | 下拉过程提示文案 | string | 下拉即可刷新... |
| loosing-text | 释放过程提示文案 | string | 释放即可刷新... |
| loading-text | 加载过程提示文案 | string | 加载中... |
| success-text | 刷新成功提示文案 | string | - |
| success-duration | 刷新成功提示展示时长 (ms) | number | 500 |
| head-height | 顶部内容高度 | number | 50 |
| pull-distance | 触发下拉刷新的距离 | number | 与 head-height 一致 |

### Events

| 事件名 | 说明             | 回调参数                   |
| ------ | ---------------- | -------------------------- |
| refresh | 下拉刷新时触发    | event.detail = {} |
| pulling | 拖动时触发 | event.detail = {distance}，distance 为拖动距离 |

### Slots

| 名称    | 说明       |
| ------- | --------- |
| normal | 非下拉状态时顶部内容 |
| pulling | 下拉过程中顶部内容 |
| loosing | 释放过程中顶部内容 |
| loading | 加载过程中顶部内容 |
| success | 刷新成功提示内容 |