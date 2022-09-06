(function() {
	/**
	 * 插槽支持
	 * @param VNode
	 * @param children
	 * @param host
	 */
	function slotSupport(VNode, children, host) {
		var slots = {
			default: []
		};

		var dfsScope = function dfsScope(node) {
			if (node.nodeName === "text" && node.attributes) {
				var text = node.children[0];
				if (
					node.attributes.scoped ||
					(typeof text === "string" && text.startsWith("[[") && text.endsWith("]]"))
				) {
					var path = text.replace(/[\[\]]/g, "").split(/[.[]/);
					if (node.attributes.scoped) {
						path = node.attributes.scoped;
					} else {
						node.attributes.scoped = path;
					}
					var data = host;
					path.forEach(function(p) {
						return (data = data[p]);
					});
					node.children[0] = JSON.stringify(data);
				}
			}

			if (Array.isArray(node.children) && node.children.length) {
				node.children.forEach(dfsScope);
			}
		};

		children.forEach(function(node) {
			if (node) {
				if (
					node.nodeName === "template" &&
					node.attributes &&
					node.attributes._slot
				) {
					var slotInfo = node.attributes._slot.split(":");
					if (slotInfo.length === 2) {
						node.attributes.scope = slotInfo[1];
						node.attributes._slot = slotInfo[0];
					}
					slots[node.attributes._slot] = node;
				} else {
					slots.default.push(node);
				}
				dfsScope(node);
			}
		});

		if (Object.keys(slots).length === 1 && slots.default.length === 0) {
			// 没有 slot 项目 直接返回 不要再去查找组件
			return VNode;
		}

		var dfs = function dfs(node) {
			if (node.attributes && node.attributes._slot) {
				if (slots[node.attributes._slot]) {
					if (node.attributes._slot === "default") {
						node.children = [].concat(node.children, slots[node.attributes._slot]);
					} else {
						node.children = slots[node.attributes._slot].children;
						node.attributes = Object.assign(
							slots[node.attributes._slot].attributes,
							node.attributes
						);
					}
				}
				// delete node.attributes._slot;
			} else if (Array.isArray(node.children) && node.children.length) {
				node.children.forEach(dfs);
			}
		};
		dfs(VNode);

		return VNode;
	}

	/**
	 * 继承父组件的 class 、style
	 * @param VNode
	 * @param props
	 * @returns {*}
	 */
	function extendsClassStyle(VNode, props) {
		props.class && (VNode.attributes.class += " " + props.class);
		props.style && (VNode.attributes.style = props.style);
		return VNode;
	}

	/**
	 * 超级节点
	 * @param VNode
	 * @param props
	 * @returns {*}
	 */
	function superNode(VNode, props) {
		slotSupport(VNode, props.children);
		extendsClassStyle(VNode, props);
		// extendsEvent(VNode, props);
		// console.log('superNode', VNode)
		return VNode;
	}

	/**
	 * 通用api.openWin打开页面
	 * @param to
	 * @param title 标题
	 * @returns {*}
	 */
	function linkTo(to, title) {
		var options = {};
		if (typeof to === "string") {
			if (to.endsWith(".stml")) {
				options.name =
					title ||
					to
						.split("/")
						.pop()
						.replace(".stml", "");
				options.url = to;
			} else if (to.endsWith(".js")) {
				options.name =
					title ||
					to
						.split("/")
						.pop()
						.replace(".js", "");
				options.url = to;
			} else {
				options.name = title || to;
				options.url = "../" + to + "/" + to + ".stml";
			}
		} else {
			options = to;
		}

		if (!options.bgColor) options.bgColor = "#FFF";

		console.log(["a-link:to", JSON.stringify(options)]);
		return api.openWin(options);
	}

	/**
	 * 混合class类
	 * @param cls
	 * @param extra
	 * @returns {string}
	 */
	function mixedClass(cls, extra) {
		if (!extra) {
			return cls;
		} else {
			var classList = [cls];
			Object.entries(extra).forEach(function(_ref2) {
				var key = _ref2[0],
					val = _ref2[1];
				return val && classList.push(key);
			});
			return classList.join(" ");
		}
	}

	var ABadge = /*@__PURE__*/ (function(Component) {
		function ABadge(props) {}

		if (Component) ABadge.__proto__ = Component;
		ABadge.prototype = Object.create(Component && Component.prototype);
		ABadge.prototype.constructor = ABadge;
		ABadge.prototype.install = function() {
			this.render = function(props) {
				var h = apivm.h;

				if (props.max && parseInt(props.max) < parseInt(props.content)) {
					props.content = props.max + "+";
				}

				var color = props.color;
				if (color === void 0) color = "#ee0a24";
				var size = props.size;
				if (size === void 0) size = 10;

				var offsetX = props.offsetX;
				if (offsetX === void 0) offsetX = -5;
				var offsetY = props.offsetY;
				if (offsetY === void 0) offsetY = -5;
				var style =
					"top:" +
					offsetY +
					"px;right:" +
					offsetX +
					"px;background-color:" +
					color +
					";font-size:" +
					size +
					"px;";

				return h(
					"view",
					{
						class: "a-badge__wrapper " + (props.class || ""),
						style: props.style + "||''"
					},
					props.children,
					props.dot
						? h("view", {
								class: "a-badge a-badge--fixed a-badge--dot",
								style: style
						  })
						: props.content
						? slotSupport(
								h(
									"text",
									{
										class: "a-badge a-badge--fixed",
										style: style,
										_slot: "content"
									},
									props.content
								),
								props.children
						  )
						: ""
				);
			};
		};
		ABadge.prototype.render = function() {
			return;
		};

		return ABadge;
	})(Component);
	ABadge.css = {
		".a-badge__wrapper": {position: "relative"},
		".a-badge": {
			boxSizing: "border-box",
			minWidth: "16px",
			padding: "0 3px",
			color: "#fff",
			fontWeight: "500",
			fontFamily: "-apple-system-font, Helvetica Neue, Arial, sans-serif",
			textAlign: "center",
			border: "1px solid #fff",
			borderRadius: "999px",
			whiteSpace: "nowrap"
		},
		".a-badge--fixed": {position: "absolute"},
		".a-badge--dot": {
			width: "8px",
			minWidth: "0",
			height: "8px",
			borderRadius: "100%"
		}
	};
	apivm.define("a-badge", ABadge);

	var AIcon = /*@__PURE__*/ (function(Component) {
		function AIcon(props) {}

		if (Component) AIcon.__proto__ = Component;
		AIcon.prototype = Object.create(Component && Component.prototype);
		AIcon.prototype.constructor = AIcon;
		AIcon.prototype.install = function() {
			console.log(
				"[a-icon提示]:本组件是一个临时过渡方案。现在已经有更成熟、更自由、性能更好的 [a-iconfont] 方案。\n" +
					"          本组件是基于后端渲染实现，线上服务将于 2022 年 12 月 31 日 停止。 项目中有使用到的建议迁移到[a-iconfont] 组件，或者后端私有部署。\n" +
					"          私有部署源码参考：https://github.com/YangYongAn/icon.yangyongan.com"
			);

			this.render = function(props) {
				if (!props.size) {
					props.size = 16;
				}
				if (!props.scale) {
					props.scale = 2;
				} //2倍缩放 适配高分屏
				if (!props.color) {
					props.color = "#666";
				}
				props.color = props.color.replace("#", "_");

				var isImage = props.name.includes("/");

				var src = isImage
					? props.name
					: "http://icon.yangyongan.com/?name=" +
					  props.name +
					  "&color=" +
					  props.color +
					  "&size=" +
					  props.size +
					  "&scale=" +
					  props.scale;

				var h = apivm.h;

				var renderIcon = h(
					"img",
					Object.assign({}, props, {
						class:
							"a-icon a-icon__" +
							(isImage ? "image" : props.name) +
							" " +
							(props.class || ""),
						style:
							"width:" +
							props.size +
							"px;height:" +
							props.size +
							"px;" +
							(props.style || ""),
						src: src
					})
				);

				if (props.dot) {
					return h(
						"view",
						{
							class: "a-icon__wrapper a-icon__dot"
						},
						renderIcon,
						h("view", {class: "a-icon__dot"})
					);
				} else if (props.badge) {
					return h(
						"view",
						{
							class: "a-icon__wrapper a-icon__badge"
						},
						renderIcon
					);
				} else {
					return renderIcon;
				}
			};
		};
		AIcon.prototype.render = function() {
			return;
		};

		return AIcon;
	})(Component);
	AIcon.css = {
		".a-icon": {alignSelf: "center"},
		".a-icon__dot": {
			width: "8px",
			minWidth: "0",
			height: "8px",
			backgroundColor: "#ee0a24",
			borderRadius: "100%"
		}
	};
	apivm.define("a-icon", AIcon);

	var AGridItem = /*@__PURE__*/ (function(Component) {
		function AGridItem(props) {}

		if (Component) AGridItem.__proto__ = Component;
		AGridItem.prototype = Object.create(Component && Component.prototype);
		AGridItem.prototype.constructor = AGridItem;
		AGridItem.prototype.install = function() {
			var this$1 = this;

			this.render = function(props) {
				var h = apivm.h;

				var direction = this$1._host.props.direction || "vertical";

				var renderContent = [
					props.icon && h(AIcon, {name: props.icon, size: props["icon-size"] || 28}),
					props.text &&
						h(
							"text",
							{
								class: mixedClass("a-grid-item__text", {
									"van-grid-item__icon___van-grid-item__text":
										props.icon && direction === "vertical"
								})
							},

							props.text
						),
					props.children
				];

				return h(
					"view",
					Object.assign({}, props, {
						class: "a-grid-item " + (props.class || ""),
						style:
							"flex-basis: " +
							100 / this$1._host.props["column-num"] +
							"%;\n            " +
							(this$1._host.props["gutter"]
								? "padding-right:" + this$1._host.props["gutter"] + "px;"
								: "") +
							"\n            " +
							(props.pos.row && this$1._host.props["gutter"]
								? "margin-top:" + this$1._host.props["gutter"] + "px;"
								: "") +
							"\n            " +
							(props.style || ""),
						onclick: this$1.handleClick
					}),

					h(
						"view",
						{
							class: mixedClass(
								"a-grid-item__content a-grid-item__content--" + direction,
								{
									"a-grid-item__content--center": props.center !== false,
									"a-grid-item__content--border": this$1._host.props.border !== false
								}
							),

							style: this$1._host.props["square"]
								? "height:" + api.winWidth / this$1._host.props["column-num"] + "px;"
								: ""
						},

						props.dot || props.badge
							? h(
									ABadge,
									{
										class: "a-grid-item__badge-wrapper",
										dot: props.dot,
										content: props.badge
									},
									renderContent
							  )
							: renderContent
					)
				);
			};
		};
		AGridItem.prototype.handleClick = function(e) {
			this.fire("click", e);
			if (this.props.url) {
				linkTo(this.props.url, this.props.title);
			} else if (this.props.to) {
				linkTo(this.props.to, this.props.title);
			} else {
				this.props.onClick && this.props.onClick(e);
			}
		};
		AGridItem.prototype.render = function() {
			return;
		};

		return AGridItem;
	})(Component);
	AGridItem.css = {
		".a-grid-item": {boxSizing: "border-box"},
		".a-grid-item__text": {
			color: "#646566",
			fontSize: "12px",
			wordBreak: "break-all"
		},
		".a-grid-item__content": {
			display: "flex",
			flexDirection: "column",
			boxSizing: "border-box",
			padding: "16px 8px",
			background: "#fff"
		},
		".a-grid-item__content--border": {border: "0.5px solid #ebedf0"},
		".a-grid-item__content--center": {
			alignItems: "center",
			justifyContent: "center"
		},
		".a-grid-item__content--horizontal": {flexDirection: "row"},
		".a-grid-item__content--vertical": {flexDirection: "column"},
		".van-grid-item__icon___van-grid-item__text": {marginTop: "8px"},
		".a-grid-item__badge-wrapper": {padding: "0 5px"}
	};
	apivm.define("a-grid-item", AGridItem);

	var AGrid = /*@__PURE__*/ (function(Component) {
		function AGrid(props) {}

		if (Component) AGrid.__proto__ = Component;
		AGrid.prototype = Object.create(Component && Component.prototype);
		AGrid.prototype.constructor = AGrid;
		AGrid.prototype.install = function() {
			this.render = function(props) {
				if (!props["column-num"]) {
					props["column-num"] = 4;
				}

				props.children = props.children.map(function(child, index) {
					var pos = {
						col: index % props["column-num"],
						row: Math.trunc(index / props["column-num"])
					};

					return Object.assign({}, child, {
						attributes: Object.assign(
							{},
							child.attributes,
							{index: index, pos: pos},
							props
						)
					});
				});

				var h = apivm.h;
				return h(
					"view",
					{
						class: "a-grid " + (props.class || ""),
						style:
							(props.style || "") +
							" " +
							(props.gutter ? "padding-left:" + props.gutter + "px" : "")
					},
					props.children
				);
			};
		};
		AGrid.prototype.render = function() {
			return;
		};

		return AGrid;
	})(Component);
	AGrid.css = {
		".a-grid": {display: "flex", flexDirection: "row", flexWrap: "wrap"}
	};
	apivm.define("a-grid", AGrid);

	var ANavBar = /*@__PURE__*/ (function(Component) {
		function ANavBar(props) {}

		if (Component) ANavBar.__proto__ = Component;
		ANavBar.prototype = Object.create(Component && Component.prototype);
		ANavBar.prototype.constructor = ANavBar;
		ANavBar.prototype.install = function() {
			api.setStatusBarStyle &&
				api.setStatusBarStyle({
					style: "dark",
					color: "-"
				});
		};
		ANavBar.prototype.leftClick = function(ev) {
			ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);
			if (this.props["onClick-left"]) {
				this.fire("click-left", ev);
			} else {
				api.closeWin();
			}
		};
		ANavBar.prototype.rightClick = function(ev) {
			ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);
			this.fire("click-right", ev);
		};
		ANavBar.prototype.titleClick = function(ev) {
			this.fire("title-right", ev);
		};
		ANavBar.prototype.render = function() {
			return superNode(
				apivm.h(
					"safe-area",
					{
						class: "a-nav-bar" + (!this.props["hide-line"] ? " a-nav-bar--line" : "")
					},
					apivm.h(
						"view",
						{
							class: "a-nav-bar__content",
							style: "height: " + (this.props["height"] || 46) + "px"
						},

						this.props["left-arrow"]
							? apivm.h(
									"view",
									{
										class: "a-nav-bar__click-warp a-nav-bar__left",
										_slot: "left",
										onClick: this.leftClick
									},
									this.props["left-arrow"] &&
										apivm.h(AIcon, {
											name: "arrow-left",
											class: "a-nav-bar__icon",
											color: "#333"
										}),
									this.props["left-text"] &&
										apivm.h("text", {class: "a-nav-bar__text"}, this.props["left-text"])
							  )
							: null,

						apivm.h(
							"text",
							{
								class: "a-nav-bar__title",
								style:
									"font-size: " +
									(this.props["title-size"] || 16) +
									"px;color: " +
									(this.props["title-color"] || "#000") +
									";",
								onClick: this.titleClick
							},
							this.props["title"]
						),

						apivm.h(
							"view",
							{
								class: "a-nav-bar__click-warp a-nav-bar__right",
								_slot: "right",
								onClick: this.rightClick
							},
							apivm.h("text", {class: "a-nav-bar__text"}, this.props["right-text"])
						)
					)
				),
				this.props
			);
		};

		return ANavBar;
	})(Component);
	ANavBar.css = {
		".a-nav-bar": {backgroundColor: "#fff"},
		".a-nav-bar--line": {boxShadow: "1px 1px 1px #e6e6e6", marginBottom: "2px"},
		".a-nav-bar__content": {flexFlow: "row nowrap"},
		".a-nav-bar__click-warp": {
			position: "absolute",
			height: "100%",
			flexFlow: "row nowrap",
			alignItems: "center",
			padding: "0 16px",
			zIndex: "99"
		},
		".a-nav-bar__left": {left: "0"},
		".a-nav-bar__right": {right: "0"},
		".a-nav-bar__text": {color: "#333", fontSize: "14px"},
		".a-nav-bar__icon": {height: "16px", width: "16px"},
		".a-nav-bar__title": {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			flex: "1",
			alignSelf: "center",
			textAlign: "center",
			fontWeight: "500",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		}
	};
	apivm.define("a-nav-bar", ANavBar);

	var SimpleGrid = /*@__PURE__*/ (function(Component) {
		function SimpleGrid(props) {}

		if (Component) SimpleGrid.__proto__ = Component;
		SimpleGrid.prototype = Object.create(Component && Component.prototype);
		SimpleGrid.prototype.constructor = SimpleGrid;
		SimpleGrid.prototype.testClick = function() {
			api.toast({
				msg: "对对对"
			});
		};
		SimpleGrid.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-grid", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "介绍"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"宫格可以在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航。"
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "基础用法"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 icon 属性设置格子内的图标，text 属性设置文字内容。"
						),

						apivm.h(
							"a-grid",
							null,
							apivm.h("a-grid-item", {icon: "picture", text: "文字"}),
							apivm.h("a-grid-item", {icon: "picture", text: "文字"}),
							apivm.h("a-grid-item", {icon: "picture", text: "文字"}),
							apivm.h("a-grid-item", {icon: "picture", text: "文字"})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义列数"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"默认一行展示四个格子，可以通过 column-num 自定义列数。"
						),

						apivm.h(
							"a-grid",
							{"column-num": 3},
							(Array.isArray(Array.from({length: 6}))
								? Array.from({length: 6})
								: Object.values(Array.from({length: 6}))
							).map(function(value) {
								return apivm.h("a-grid-item", {icon: "picture", text: "文字"});
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义内容"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过默认插槽可以自定义格子展示的内容。通过 border 属性控制是否有边框。"
						),

						apivm.h(
							"a-grid",
							{border: false, "column-num": 3},
							apivm.h(
								"a-grid-item",
								null,
								apivm.h("img", {
									src: "https://img.yzcdn.cn/vant/apple-1.jpg",
									alt: "",
									class: "demo-img"
								})
							),
							apivm.h(
								"a-grid-item",
								null,
								apivm.h("img", {
									src: "https://img.yzcdn.cn/vant/apple-2.jpg",
									alt: "",
									class: "demo-img"
								})
							),
							apivm.h(
								"a-grid-item",
								null,
								apivm.h("img", {
									src: "https://img.yzcdn.cn/vant/apple-3.jpg",
									alt: "",
									class: "demo-img"
								})
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "正方形格子"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 square 属性后，格子的高度会和宽度保持一致。"
						),

						apivm.h(
							"a-grid",
							{square: true},
							(Array.isArray(Array.from({length: 8}))
								? Array.from({length: 8})
								: Object.values(Array.from({length: 8}))
							).map(function(value) {
								return apivm.h("a-grid-item", {
									key: value,
									icon: "picture",
									text: "文字"
								});
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "格子间距"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 gutter 属性设置格子之间的距离。"
						),

						apivm.h(
							"a-grid",
							{gutter: 10},
							(Array.isArray(Array.from({length: 8}))
								? Array.from({length: 8})
								: Object.values(Array.from({length: 8}))
							).map(function(value) {
								return apivm.h("a-grid-item", {
									key: value,
									icon: "picture",
									text: "文字"
								});
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "内容横排"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"将 direction 属性设置为 horizontal，可以让宫格的内容呈横向排列。"
						),

						apivm.h(
							"a-grid",
							{direction: "horizontal", "column-num": 3},
							(Array.isArray(Array.from({length: 3}))
								? Array.from({length: 3})
								: Object.values(Array.from({length: 3}))
							).map(function(value) {
								return apivm.h("a-grid-item", {
									key: value,
									icon: "picture",
									text: "文字"
								});
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "页面导航"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"将 direction 属性设置为 horizontal，可以让宫格的内容呈横向排列。"
						),

						apivm.h(
							"a-grid",
							{"column-num": 2},
							apivm.h("a-grid-item", {
								icon: "home",
								text: "路由跳转",
								to: "simple-button"
							}),
							apivm.h("a-grid-item", {
								icon: "search",
								text: "URL 跳转",
								url: "../simple-button/simple-button"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "徽标提示"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 dot 属性后，会在图标右上角展示一个小红点。设置 badge 属性后，会在图标右上角展示相应的徽标。"
						),

						apivm.h(
							"a-grid",
							{"column-num": 2},
							apivm.h("a-grid-item", {icon: "home", text: "文字", dot: true}),
							apivm.h("a-grid-item", {icon: "search", text: "文字", badge: "99+"})
						)
					)
				)
			);
		};

		return SimpleGrid;
	})(Component);
	SimpleGrid.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {marginBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".demo-img": {width: "50px", height: "50px"}
	};
	apivm.define("simple-grid", SimpleGrid);
})();
