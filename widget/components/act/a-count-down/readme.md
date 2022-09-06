
# CountDown 倒计时

### 介绍

用于实时展示倒计时数值。

### 引入

```js
import ACountDown from "../../components/act/a-count-down";
```

## 代码演示

### 基础用法

`time` 属性表示倒计时总时长，单位为毫秒。

```html
<a-count-down :time="time"/>
```

```js
export default {
  name: "simple-count-down",
  data() {
    return {
      time: 30 * 60 * 60 * 1000
    }
  }
}
```

### 自定义格式

通过 `format` 属性设置倒计时文本的内容。

```html
<a-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒"/>
```

### 自定义样式

通过插槽自定义倒计时的样式，`timeData` 对象格式见下方表格。

```html
  <a-count-down :time="time">
    <template _slot="default:timeData">
      <text class="block">[[timeData.hours]]</text>
      <text class="colon">:</text>
      <text class="block">[[timeData.minutes]]</text>
      <text class="colon">:</text>
      <text class="block">[[timeData.seconds]]</text>
    </template>
  </a-count-down>

<style>
.colon {
  display: inline-block;
  margin: 0 4px;
  color: #ee0a24;
  line-height: 22px;
}

.block {
  display: inline-block;
  width: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background-color: #ee0a24;
  line-height: 22px;
  height: 22px;
  border-radius: 4px;
}
</style>
```

### 手动控制

通过 ref 获取到组件实例后，可以调用 `start`、`pause`、`reset` 方法。

```html
  <a-ref name="countDown">
    <a-count-down
        ref="countDown"
        :time="3000"
        millisecond
        :auto-start="false"
        format="ss:SSS"
        @finish="onFinish"/>
  </a-ref>
```

```js

import ARef from "../../components/act/a-ref";

export default {
  name: "simple-count-down",
  methods: {
    onFinish() {
      Toast('倒计时结束')
    },
    start() {
      this.$refs.countDown.start();
    },
    pause() {
      this.$refs.countDown.pause();
    },
    reset() {
      this.$refs.countDown.reset();
    }
  }
}
```

![image.png](https://i.loli.net/2021/04/08/RF2S6nats3VqQy4.png)

## API

### Props

| 参数        | 说明                 | 类型               | 默认值     |
| ----------- | -------------------- | ------------------ | ---------- |
| time        | 倒计时时长，单位毫秒 | _number / string_ | `0`        |
| format      | 时间格式             | _string_           | `HH:mm:ss` |
| auto-start  | 是否自动开始倒计时   | _boolean_          | `true`     |

### format 格式

| 格式 | 说明         |
| ---- | ------------ |
| DD   | 天数         |
| HH   | 小时         |
| mm   | 分钟         |
| ss   | 秒数         |
| S    | 毫秒（1 位） |
| SS   | 毫秒（2 位） |
| SSS  | 毫秒（3 位） |

### Events

| 事件名 | 说明             | 回调参数                   |
| ------ | ---------------- | -------------------------- |
| finish | 倒计时结束时触发 | -                          |
| change | 倒计时变化时触发 | _currentTime: CurrentTime_ |

### Slots

| 名称    | 说明       | 参数                       |
| ------- | ---------- | -------------------------- |
| default | 自定义内容 | _currentTime: CurrentTime_ |

### CurrentTime 格式

| 名称         | 说明                   | 类型     |
| ------------ | ---------------------- | -------- |
| total        | 剩余总时间（单位毫秒） | _number_ |
| days         | 剩余天数               | _number_ |
| hours        | 剩余小时               | _number_ |
| minutes      | 剩余分钟               | _number_ |
| seconds      | 剩余秒数               | _number_ |
| milliseconds | 剩余毫秒               | _number_ |

### 方法

通过 ref 可以获取到 CountDown 实例并调用实例方法。

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| start | 开始倒计时 | - | - |
| pause | 暂停倒计时 | - | - |
| reset | 重设倒计时，若 `auto-start` 为 `true`，重设后会自动开始倒计时 | - | - |
