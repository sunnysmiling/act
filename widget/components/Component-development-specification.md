/*
Title: AVM 组件开发规范
Urltitle: APICloud API对象 – 手机App开发、App制作、App定制平台
Description: AVM 组件开发规范
*/

## 一、AVM 组件介绍

<a href='https://docs.apicloud.com/apicloud3/' target='_blank'>AVM</a> (Application-View-Model) 跨端框架是一个移动优先的高性能跨端JavaScript框架，支持一次编写多端渲染。
它提供更趋近于原生的编程体验，通过简洁的模型来分离应用的用户界面、业务逻辑和数据模型，适合高度定制的应用开发。

AVM 中的绝大多数代码和部件都是以组件化的方式组织的，在这个条件下，可以产出大量可复用、实用性强的功能组件和业务组件。

因此我们希望在APICloud平台现有的模块生态下，新增 “AVM组件” ，为开发者建立AVM组件代码复用的桥梁。
该类型模块要求提交AVM组件源码，该源码可以是某个基础组件的框架，例如自定义渲染的选择器组件、日历等，
也可以是某个业务场景的封装，例如收货地址地图选点、联系人信息卡片和购物车页面交互等，或是对原生功能模块的UI封装，例如基于融云IM模块封装的会话列表，聊天窗口等。
开发者通过平台获取到该模块的源码后，可以通过 Studio3 导入自身APP项目中直接使用。

以下规范旨在统一 AVM 组件的的标准和形式，同时帮助审核人员提高审核效率，保证组件品质。

## 二、组件审核规范

### 0. 总则
AVM 组件包需要尽可能能支持多端运行，包含 STML（或者是 JS ）、CSS、 JS 代码以及所依赖的图片等资源文件和帮助文档。 应遵循简洁，抽象，低耦合的原则，避免冗余的 CSS/JS 代码。
充分考虑拓展性和普适性，能够对多种场景和业务做到最大程度适用。

### 1. 组件包资源结构

~~~ js 
┌─component-name/               // 组件根目录 以组件名称命名
│  ├─asset/                     // 组件附件资源目录 包括图片资源 字体等
│  ├─demo-component-name/       // 组件演示目录 格式为demo-组件名称
│  │  ├─demo-component-name.stml// 组件演示页面文件 与父文件夹同名
│  ├─component-name.stml/js     // 组件入口文件 (可以是 STML / JS )
│  ├─component-name.css         // 组件依赖的独立外部css文件
│  ├─readme.md                  // 组件的说明文档
│  ├─package.json               // 包信息文件
└────────────────
~~~
##### 1.0. 最外层目录和压缩包

1.0.1. 模块包的最外层目录必须为该组件名。
压缩包在预览时，看起来应该像这样：

![image.png](https://i.loli.net/2021/04/15/G95NFIkSJQLseD1.png)

1.0.2. 压缩格式为zip包，**请右键根目录进行压缩**，而不是在文件夹类全选进行压缩。 
> 使用 BandZip 类的用户请参考绿框的操作：压缩时请鼠标右键根目录，选择“添加到压缩文件(BandZip)...(B)"，在弹出的对话框中点击完成。

![image.png](https://i.loli.net/2021/04/15/jYXu9Sd7yvrAZil.png)

1.0.3. 本文档同目录附带一个 zip 参考示例。

 ` 下载地址 ` https://github.com/apicloudcom/act/blob/main/widget/components/simple-sfc.zip

##### 1.1. 组件包最佳实践

1.1.1. 应尽可能的确保组件的轻量，避免引入大的外部样式表、字体文件等外部资源

1.1.2. 对于使用图片等外部资源的组件，应将外部资源以 API 形式开放给使用者，避免将资源打包在组件包内

1.1.3. 本组件如果依赖其他组件，应将依赖的组件打包在本组件包内

##### 1.2. * 组件包处理流程

1.2.1. 组件包可通过开发工具导入到项目中直接使用。

1.2.2. 组件包中代码及资源在开发工具调试或云编译过程中将被还原至 widget 对应的目录中，具体规则为：
- asset 下图片/视频等多媒体资源拷贝至widget的image目录
- css/字体文件拷贝至widget的css目录
- js资源拷贝至widget的script目录。
- demo演示目录会拷贝到pages目录，所以在demo中的组件资源的引用路径层级，以在pages目录下的情况为准。

---

### 2. 组件包内包信息 package.json 模板说明

~~~ json
{
  "name": "test",
  "version": "1.0.0",
  "description": "just test",
  "main": "test.stml",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "apicloud",
  "license": "MIT",
  "avm": {
    "platform": ["app","web","mp"],
    "systemType": ["ios","android"],
    "keywords": ["ui","input","component"],
    "site":"http://baidu.cn",
    "price":100
  }
}
~~~

2.1. 使用标准的 json 格式创建包信息文件 (建议使用npm init 生成模板)

- name [String] 组件名称  
- version [String] 当前版本
- description [String] 简介
- main [String] 组件入口
- author 作者/联系邮箱

2.2. 添加 avm 字段，包含以下信息：

- platform [Array] 适配平台 {app:native,web:h5网页,mp:小程序}
- systemType [Array] 支持的系统类型 {ios,android}
- keywords  [Array] 组件关键字
- site [String] 支持网站网址
- price [Number] 整数售价(单位 分)
 

### 3. 组件命名规范

3.1. 组件包名即为组件名，并代表该组件的命名空间，组件名需要和2.1中提到的 package.json 的 name 保持一致。
组件名称使用全小写，多个单词使用 - （中划线）分割。

3.2. 组件名称需要在APICloud平台全局独立，建议使用个性化特殊前缀来作为组件命名空间。
> 例如写了一个输入框组件 ，如果直接叫做 input ，则比较泛，需要增加自己的个性标识，或者是使用意图性质的限定词语。

> 例如：my-input tom-input password-input 

3.3. 使用单语言模式的 js 组件的入口文件名推荐使用 index.js ，这样在引入的时候可以只书写到组件根目录即可。

3.4. [重要] 组件样式目前**需要附带组件名称作为前缀**来形成 scope 。样式规则推荐使用 BEM 规范。
> 例如组件名称叫做 simple-sfc 那么样式需要附带 simple-sfc 作为前缀
> 
> 按照 B__E--M 的规范来组织 css 结构，例如：
> 
> simple-sfc__title-text--disabled 表示组件（simple-sfc）内的标题的文本（title-text），是禁用状态（disabled）。

3.5. 其他资源和 js 函数命名等无严格要求，建议遵循语言特性和标准编程风格即可。

  注：如果组件引入了外部js文件，该js文件须按照ES6规范编写，即该js文件可通过export | import配对使用。

3.6. 组件中不能携带包括不限于 view text 这类通配选择器，避免干扰页面其他元素样式。 所有出现的css选择器必须携带前缀。

---

### 4. 组件包 README.MD 文档规范说明

说明文档是组件的说明书，有助于其他开发者更高效便捷地使用组件。请遵循以下示例文档：

~~~
# a-button 按钮

## 介绍

详细描述组件的功能和效果等。例如：xx按钮用于触发一个操作，如提交表单。xxx用于弹出一个actionSheet效果...


## 使用方式

import AButton from "../../components/act/a-button.stml";
import AButton from "../../components/act/a-button.js";
或
import "../../components/act/a-button.stml";
import "../../components/act/a-button.js";

## 代码示例

### 按钮类型
按钮支持 default、primary、success、warning、danger 五种类型，默认为 default。

<a-button type="primary">主要按钮</a-button>
<a-button type="success">成功按钮</a-button>
<a-button type="default">默认按钮</a-button>
<a-button type="warning">警告按钮</a-button>
<a-button type="danger">危险按钮</a-button>

[对应的运行效果图]

### 朴素按钮
通过 plain 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

<a-button plain type="primary">朴素按钮</a-button>
<a-button plain type="primary">朴素按钮</a-button>

[对应的运行效果图]

## API

### props 属性

|  参数   | 说明  | 类型  | 默认值  |
|  ----  | ----  |----  |----  |
| type  | 类型，可选值为 primary success warning danger |string|default|
| size  | 尺寸，可选值为 large small mini |string|normal|

### events 事件

 本组件开放的事件描述...


### methods 方法

本组件暴露的方法

## 依赖的原生模块

	无 或 module1、module2 …

## 帮助说明 联系方式等

### 帮助说明
	
	对本组件使用过程中需要特别注意或者额外信息等进行说明。

### 联系方式 

	如果您在使用本组件过程中，遇到任何问题，可通过xxx联系...
~~~

