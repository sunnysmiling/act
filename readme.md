# ACT

**A**VM **C**omponent & **T**emplate.

> Vant 组件库的 AVM 实现

## 介绍

AVM跨端框架（APICloud-View-Model)
AVM是一个跨端的高性能 JavaScript 框架，更趋近于原生的编程体验。 它提供简洁的模型来分离应用的用户界面、业务逻辑和数据模型，适合高度定制化的项目。

同时AVM中的绝大多数代码和部件都是以组件化的方式组织的。在这个条件下，可以产出大量可复用、实用性强的功能组件和业务组件。

在组件化开发的框架下，参考了业界使用率比较高的 Vant 组件库来作为设计范本， 使用 AVM 的组织方式来实现了ACT（AVM Component & Template.）。

## 框架特点

Vant 本身是大家所熟知的，常用的组件库。 Vant 有完整的设计体系和丰富的组件案例，能够满足绝大多数的业务场景。所以选择 Vant 作为实现目标。 最终的使用习惯几乎贴近 Vant ，拿着 Vant 的文档就能使用 ACT 。

尽可能地支持多端编译，一套代码能够适用于 APP 、H5和小程序。

支持类似 ref 等组件引用和 v-slot 插槽功能。

## 立即体验

![](qr-code.png)

## 使用文档

### 安装方式

1. 检出代码

~~~bash
git clone https://github.com/apicloudcom/act.git
~~~

2. 放置组件到组件目录

项目目录下的 ` /widget/components/act/ ` 文件夹即为本组件的核心代码，复制到自己项目的components目录下即可使用。

### 组件详细文档

详见组件内部的: [说明文档 README.md](./widget/components/act/readme.md)

## 贡献代码

修改代码请阅读我们的开发指南。

使用过程中发现任何问题都可以提 Issue 给我们，当然，我们也非常欢迎你给我们发 PR。

## 相关链接

- [AVM.js](https://www.apicloud.com/AVMframe)
- [Vant](https://vant-contrib.gitee.io/vant/v3/)
- [AVM讨论](https://community.apicloud.com/bbs/forum-71-1.html)
- AVM QQ群 : 339762594

## 开源协议

本项目基于 MIT 协议，请自由地享受和参与开源