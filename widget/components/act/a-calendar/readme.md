
# Calendar 日历

### 介绍

日历组件用于选择日期或日期区间。

### 引入

```js
import ACalendar from "../../components/act/a-calendar";
```

> 注意:该组件展示的时候为全屏形态，请将组件最好放置于根节点下。

## 代码演示

### 选择单个日期

下面演示了结合单元格来使用日历组件的用法，日期选择完成后会触发 `confirm` 事件。

```html
<a-cell-group round>
    <a-cell is-link @click="open" title="选择单个日期" :value="value"/>
</a-cell-group>

<a-calendar style="height: 500px;" $show="show" @confirm="myConfirm"/>
```

```js
export default {
    name: "simple-calendar",
    data(){
        return {
            show:false,
            value:''
        }
    },
    methods: {
        open(){
            this.data.show = true;
        },
        myConfirm({detail}) {
          this.data.value = detail;
          Toast(`onConfirm: ${detail}`)
        }
    }
}
```

![](https://i.loli.net/2021/02/24/pFXyD2tmaWKBzrf.png)

### 双向绑定

演示了使用  ` $default-date `  来做双向绑定，自动接管数据变化绑定。

```html
<a-cell-group round>
    <a-cell is-link @click="open" title="双向绑定" :value="value"/>
</a-cell-group>

<a-calendar style="height: 500px;" $show="show" $default-date="value"/>
```

```js
export default {
    name: "simple-calendar",
    data(){
        return {
            show:false,
            value:''
        }
    },
    methods: {
        open(){
            this.data.show = true;
        }
    }
}
```

### 选择多个日期

设置 `type` 为 `multiple` 后可以选择多个日期，此时 `confirm` 事件返回的 date 为数组结构，数组包含若干个选中的日期。

```html
<a-cell-group round>
    <a-cell is-link @click="open" title="选择多个日期" :value="value"/>
</a-cell-group>

<a-calendar style="height: 500px;" $show="show" @confirm="myConfirm" type="multiple"/>
```

```js
export default {
    name: "simple-calendar",
    data(){
        return {
            show:false,
            value:''
        }
    },
    methods: {
        open(){
            this.data.show = true;
        },
        myConfirm({detail}) {
            this.data.value = `选择了${detail.length}个日期`;
            Toast(`onConfirm: 选择了${detail.length}个日期`)
        }
    }
}
```

![](https://i.loli.net/2021/02/24/SPwAphYoy6BlOKD.png)

### 选择日期区间

设置 `type` 为 `range` 后可以选择日期区间，此时 `confirm` 事件返回的 date 为数组结构，数组第一项为开始时间，第二项为结束时间。

```html
<a-cell-group round>
    <a-cell is-link @click="open" title="选择日期区间" :value="value"/>
</a-cell-group>

<a-calendar style="height: 500px;" $show="show" @confirm="myConfirm3" type="range"/>
```

```js
export default {
    name: "simple-calendar",
    data(){
        return {
            show:false,
            value:''
        }
    },
    methods: {
        open(){
            this.data.show = true;
        },
        myConfirm3({detail}) {
          this.data.value = `${detail[0]} - ${detail[1]}`;
          Toast(`onConfirm: ${detail[0]} - ${detail[1]}`)
        }
    }
}
```

![](https://i.loli.net/2021/02/24/k53j2dzBsXfmDSq.png)

### 快捷选择

将 `show-confirm` 设置为 `false` 可以隐藏确认按钮，这种情况下选择完成后会立即触发 `confirm` 事件。

```html
<a-calendar style="height: 500px;" $show="show" :show-confirm="false" $default-date="value"/>
```

### 自定义日期范围

通过 `min-date` 和 `max-date` 定义日历的范围。

```html
<a-calendar style="height: 500px;" $show="show" $default-date="value"
    :min-date="new Date('2009/12/15')"
    :max-date="new Date('2010/3/9')"/>
```

### 自定义按钮文字

通过 `confirm-text` 设置按钮文字，通过 `confirm-disabled-text` 设置按钮禁用时的文字。

```html
<a-calendar style="height: 500px;" 
    $show="show" 
    type="range" 
    $default-date="value" 
    confirm-text="完成"
    confirm-disabled-text="请选择结束时间"
/>
```

![](https://i.loli.net/2021/02/24/QyNDXabxgjSLkHc.png)

### 自定义日期文案

通过传入 `formatter` 函数来对日历上每一格的内容进行格式化。

```html
    <a-calendar style="height: 500px;" $show="show" 
                :formatter="this.formatter"
                type="range" @confirm="myConfirm9"
                :min-date="new Date('2021/5/1')"
                :max-date="new Date('2021/6/25')"
    />
```

```js
export default {
    name: "simple-calendar",
    data(){
        return {
            show:true,
            value:''
        }
    },
    methods: {
        open(){
            this.data.show = true;
        },
        myConfirm9({detail}) {
            this.data.value = `${detail[0]} - ${detail[1]}`;
            Toast(`onConfirm: ${detail[0]} - ${detail[1]}`)
        },
        formatter(day) {
          const month = day.date.getMonth() + 1;
          const date = day.date.getDate();
    
          if (month === 5) {
            if (date === 1) {
              day.topInfo = '劳动节';
            } else if (date === 4) {
              day.topInfo = '青年节';
            } else if (date === 11) {
              day.text = '今天';
            }
          }
    
    
          if (day.type === 'start') {
            day.bottomInfo = '入住';
          } else if (day.type === 'end') {
            day.bottomInfo = '离店';
          }
    
          return day;
        }
    }
}
```

![](https://i.loli.net/2021/02/24/MjV7rTNJan3ybZF.png)

### 日期区间最大范围

选择日期区间时，可以通过 `max-range` 属性来指定最多可选天数，选择的范围超过最多可选天数时，会弹出相应的提示文案。

```html
<a-calendar style="height: 500px;" $show="show" @confirm="myConfirm10" type="range"
                :max-range="5"
```

![](https://i.loli.net/2021/02/24/prFHoimf67vQe4G.png)

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 选择类型:<br>`single` 表示选择单个日期，<br>`multiple` 表示选择多个日期，<br>`range` 表示选择日期区间 | _string_ | `single` |
| title | 日历标题 | _string_ | `日期选择` |
| min-date | 可选择的最小日期 | _Date_ | 当前日期 |
| max-date | 可选择的最大日期 | _Date_ | 当前日期的六个月后 |
| default-date | 默认选中的日期，`type` 为 `multiple` 或 `range` 时为数组，传入 `null` 表示默认不选择 | _Date / Date[] / null_ | 今天 |
| formatter | 日期格式化函数 | _(day: Day) => Day_ | - |
| show-confirm | 是否展示确认按钮 | _boolean_ | `true` |
| confirm-text | 确认按钮的文字 | _string_ | `确定` |
| confirm-disabled-text | 确认按钮处于禁用状态时的文字 | _string_ | `确定` |

### Range Props

当 Canlendar 的 `type` 为 `range` 时，支持以下 props:

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max-range | 日期区间最多可选天数 | _number / string_ | 无限制 |
| range-prompt | 范围选择超过最多可选天数时的提示文案 | _string_ | `选择天数不能超过 xx 天` |

### Multiple Props

当 Canlendar 的 `type` 为 `multiple` 时，支持以下 props:

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| max-range | 日期最多可选天数 | _number / string_ | 无限制 |
| range-prompt | 选择超过最多可选天数时的提示文案 | _string_ | `选择天数不能超过 xx 天` |

### Day 数据结构

日历中的每个日期都对应一个 Day 对象，通过`formatter`属性可以自定义 Day 对象的内容

| 键名 | 说明 | 类型 |
| --- | --- | --- |
| date | 日期对应的 Date 对象 | _Date_ |
| type | 日期类型，可选值为 `selected`、`start`、`middle`、`end`、`disabled` | _string_ |
| text | 中间显示的文字 | _string_ |
| topInfo | 上方的提示信息 | _string_ |
| bottomInfo | 下方的提示信息 | _string_ |
| className | 额外类名 | _string_ |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击并选中任意日期时触发 | _value: Date / Date[]_ |
| confirm | 日期选择完成后触发，若 `show-confirm` 为 `true`，则点击确认按钮后触发 | _value: Date / Date[]_ |
