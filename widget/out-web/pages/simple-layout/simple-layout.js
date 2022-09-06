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

	var ACol = /*@__PURE__*/ (function(Component) {
		function ACol(props) {}

		if (Component) ACol.__proto__ = Component;
		ACol.prototype = Object.create(Component && Component.prototype);
		ACol.prototype.constructor = ACol;
		ACol.prototype.install = function() {
			this.render = function(props) {
				var span = (props.span / 24) * 100 + "%";
				var offset = (props.offset / 24) * 100 + "%";

				var h = apivm.h;
				var extractClass = apivm.extractClass;

				return h(
					"view",
					Object.assign({}, extractClass(props, "a-col a-col--" + props.span), {
						style:
							"flex: 0 0 " +
							span +
							";max-width: " +
							span +
							";margin-left: " +
							offset +
							";" +
							(props.style || "")
					}),
					props.children
				);
			};
		};
		ACol.prototype.render = function() {
			return;
		};

		return ACol;
	})(Component);
	ACol.css = {".a-col": {boxSizing: "border-box"}};
	apivm.define("a-col", ACol);

	var ARow = /*@__PURE__*/ (function(Component) {
		function ARow(props) {}

		if (Component) ARow.__proto__ = Component;
		ARow.prototype = Object.create(Component && Component.prototype);
		ARow.prototype.constructor = ARow;
		ARow.prototype.install = function() {
			this.render = function(props) {
				var obj;

				var h = apivm.h;
				var extractClass = apivm.extractClass;

				var groups = [[]];

				var totalSpan = 0;
				props.children.forEach(function(child, index) {
					totalSpan += child.attributes ? Number(child.attributes.span) : 0;

					if (totalSpan > 24) {
						groups.push([index]);
						totalSpan -= 24;
					} else {
						groups[groups.length - 1].push(index);
					}
				});

				var gutter = Number(props.gutter);
				var spaces = [];

				if (gutter) {
					groups.forEach(function(group) {
						var averagePadding = (gutter * (group.length - 1)) / group.length;
						group.forEach(function(item, index) {
							if (index === 0) {
								spaces.push({right: averagePadding});
								props.children[item].attributes.style =
									"padding-right:" + averagePadding + "px";
							} else {
								var left = gutter - spaces[item - 1].right;
								var right = averagePadding - left;
								spaces.push({left: left, right: right});
								props.children[item].attributes.style =
									"padding-left:" + left + "px;padding-right:" + right + "px";
							}
						});
					});
				}
				return h(
					"view",
					Object.assign(
						{},
						extractClass(
							props,
							"a-row",
							((obj = {}), (obj["a-row--justify-" + props.justify] = true), obj)
						),

						{style: "" + (props.style || "")}
					),
					props.children
				);
			};
		};
		ARow.prototype.render = function() {
			return;
		};

		return ARow;
	})(Component);
	ARow.css = {
		".a-row": {flexFlow: "row wrap"},
		".a-row--justify-center": {
			WebkitBoxPack: "center",
			WebkitJustifyContent: "center",
			justifyContent: "center"
		},
		".a-row--justify-end": {
			WebkitBoxPack: "end",
			WebkitJustifyContent: "flex-end",
			justifyContent: "flex-end"
		},
		".a-row--justify-space-between": {
			WebkitBoxPack: "justify",
			WebkitJustifyContent: "space-between",
			justifyContent: "space-between"
		},
		".a-row--justify-space-around": {
			WebkitJustifyContent: "space-around",
			justifyContent: "space-around"
		}
	};
	apivm.define("a-row", ARow);

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

	var SimpleLayout = /*@__PURE__*/ (function(Component) {
		function SimpleLayout(props) {}

		if (Component) SimpleLayout.__proto__ = Component;
		SimpleLayout.prototype = Object.create(Component && Component.prototype);
		SimpleLayout.prototype.constructor = SimpleLayout;
		SimpleLayout.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-layout", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},
					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "基础用法"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"Layout 组件提供了 24列栅格，通过在 Col 上添加 span 属性设置列所占的宽度百分比。此外，添加 offset 属性可以设置列的偏移宽度，计算方式与 span 相同。"
						),

						apivm.h(
							"a-row",
							{class: "demo-row"},
							apivm.h(
								"a-col",
								{span: "8", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 8")
							),
							apivm.h(
								"a-col",
								{span: "8", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 8")
							),
							apivm.h(
								"a-col",
								{span: "8", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 8")
							)
						),

						apivm.h(
							"a-row",
							{class: "demo-row"},
							apivm.h(
								"a-col",
								{span: "4", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 4")
							),
							apivm.h(
								"a-col",
								{span: "10", offset: "4", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "offset: 4, span: 10")
							)
						),

						apivm.h(
							"a-row",
							{class: "demo-row"},
							apivm.h(
								"a-col",
								{offset: "12", span: "12", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "offset: 12, span: 12")
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "设置列元素间距"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 gutter 属性可以设置列元素之间的间距，默认间距为 0。"
						),

						apivm.h(
							"a-row",
							{class: "demo-row", gutter: "20"},

							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-even"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							),
							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-odd"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							),
							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-even"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							)
						),

						apivm.h(
							"a-row",
							{class: "demo-row", gutter: "40"},

							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-even"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							),
							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-odd"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							),
							apivm.h(
								"a-col",
								{span: "8"},
								apivm.h(
									"view",
									{class: "demo-col col-even"},
									apivm.h("text", {class: "demo-layout-text"}, "span: 8")
								)
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "对齐方式"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 justify 属性可以设置主轴上内容的对齐方式，等价于 flex 布局中的 justify-content 属性。"
						),

						apivm.h("text", {class: "simple-desc"}, "居中"),

						apivm.h(
							"a-row",
							{class: "demo-row", justify: "center"},
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							)
						),

						apivm.h("text", {class: "simple-desc"}, "右对齐"),

						apivm.h(
							"a-row",
							{class: "demo-row", justify: "end"},
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							)
						),

						apivm.h("text", {class: "simple-desc"}, "两端对齐"),

						apivm.h(
							"a-row",
							{class: "demo-row", justify: "space-between"},
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							)
						),

						apivm.h("text", {class: "simple-desc"}, "每个元素的两侧间隔相等"),

						apivm.h(
							"a-row",
							{class: "demo-row", justify: "space-around"},
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-odd"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							),
							apivm.h(
								"a-col",
								{span: "6", class: "demo-col col-even"},
								apivm.h("text", {class: "demo-layout-text"}, "span: 6")
							)
						)
					)
				)
			);
		};

		return SimpleLayout;
	})(Component);
	SimpleLayout.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".todo": {background: "#f1e9d5"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".demo-row": {margin: "8px 16px"},
		".col-odd": {backgroundColor: "#66c6f2"},
		".col-even": {backgroundColor: "#39a9ed"},
		".demo-col": {justifyContent: "center", backgroundClip: "content-box"},
		".demo-layout-text": {
			lineHeight: "30px",
			height: "30px",
			color: "#FFF",
			fontSize: "13px",
			textAlign: "center"
		}
	};
	apivm.define("simple-layout", SimpleLayout);
})();
