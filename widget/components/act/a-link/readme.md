# Link

### 介绍

这是一个抽象组件，为组件提供统一的跳转路由功能。

### 引入

~~~js
import ALink from "../../components/act/a-link";
~~~

## 代码示例

### 基础用法

~~~html
<a-link to="simple-button">
    <view class="link">
        <text class="com-name">Button 按钮</text>
        <a-icon name="arrow-right"/>
    </view>
</a-link>
~~~

### 完整链接

~~~html
<a-link to="../../simple-button/simple-button" title="按钮示例页面">
    <view class="link">
        <text class="com-name">Button 按钮</text>
        <a-icon name="arrow-right"/>
    </view>
</a-link>
~~~

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| to | 路由名称或者完整路径 | _string_ | - |
| title | 页面的名称 | _string_ | - |
