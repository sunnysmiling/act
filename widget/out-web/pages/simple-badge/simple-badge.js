(function() {
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

	var SimpleBadge = /*@__PURE__*/ (function(Component) {
		function SimpleBadge(props) {}

		if (Component) SimpleBadge.__proto__ = Component;
		SimpleBadge.prototype = Object.create(Component && Component.prototype);
		SimpleBadge.prototype.constructor = SimpleBadge;
		SimpleBadge.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-badge", "left-arrow": true}),
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
							"设置 content 属性后，Badge 会在子元素的右上角显示对应的徽标，也可以通过 dot 来显示小红点。"
						),
						apivm.h(
							"a-row",
							{justify: "space-around"},
							apivm.h("a-badge", {content: 5}, apivm.h("div", {class: "child"})),
							apivm.h("a-badge", {content: 10}, apivm.h("div", {class: "child"})),
							apivm.h("a-badge", {content: "Hot"}, apivm.h("div", {class: "child"})),
							apivm.h("a-badge", {dot: true}, apivm.h("div", {class: "child"}))
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "最大值"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 max 属性后，当 content 的数值超过最大值时，会自动显示为 max+。"
						),
						apivm.h(
							"a-row",
							{justify: "space-around"},
							apivm.h(
								"a-badge",
								{content: 20, max: "9"},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{content: 50, max: "20"},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{content: 200, max: "99"},
								apivm.h("div", {class: "child"})
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义颜色"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 color 属性来设置徽标的颜色。"
						),
						apivm.h(
							"a-row",
							{justify: "space-around"},
							apivm.h(
								"a-badge",
								{content: 5, color: "#1989fa"},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{content: 10, color: "#1989fa"},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{dot: true, color: "#1989fa"},
								apivm.h("div", {class: "child"})
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "独立展示"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"当 Badge 没有子元素时，会作为一个独立的元素进行展示。"
						),
						apivm.h(
							"a-row",
							{justify: "space-around"},
							apivm.h("a-badge", {content: 20}),

							apivm.h("a-badge", {content: 200, max: "99"})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义偏移位置"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 offset 属性来自定义偏移位置。"
						),
						apivm.h(
							"a-row",
							{justify: "space-around"},
							apivm.h(
								"a-badge",
								{content: 5, offsetX: "0", offsetY: "0"},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{content: 10, offsetX: -10, offsetY: -15},
								apivm.h("div", {class: "child"})
							),
							apivm.h(
								"a-badge",
								{dot: true, offsetX: -20, offsetY: -20},
								apivm.h("div", {class: "child"})
							)
						)
					)
				)
			);
		};

		return SimpleBadge;
	})(Component);
	SimpleBadge.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".todo": {background: "#f1e9d5"},
		".child": {
			width: "40px",
			height: "40px",
			background: "#f2f3f5",
			borderRadius: "4px"
		}
	};
	apivm.define("simple-badge", SimpleBadge);
})();
