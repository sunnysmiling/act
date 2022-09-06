(function() {
	global.DEFAULT_ROW_WIDTH = "100%";
	global.DEFAULT_LAST_ROW_WIDTH = "60%";
	var ASkeleton = /*@__PURE__*/ (function(Component) {
		function ASkeleton(props) {
			this.data = {};
			this.compute = {
				rows: function() {
					var row = this.props.row || 0;
					return Array.from({length: row}).fill("");
				},
				length: function() {},
				avatarClass: function() {
					return (
						"a-skeleton_avatar " +
						(this.props["avatar-shape"] == "square" ? "" : "a-skeleton_round")
					);
				},
				avatarStyle: function() {
					var size = this.props["avatar-size"];
					return size ? "width:" + size + ";height:" + size + ";" : "";
				},
				titleStyle: function() {
					var titleWidth = this.props["title-width"];
					return titleWidth ? "width:" + titleWidth + ";" : "";
				}
			};
		}

		if (Component) ASkeleton.__proto__ = Component;
		ASkeleton.prototype = Object.create(Component && Component.prototype);
		ASkeleton.prototype.constructor = ASkeleton;
		ASkeleton.prototype.beforeRender = function() {
			if (!("loading" in this.props)) {
				this.props.loading = true;
			}
		};
		ASkeleton.prototype.getChildNode = function() {
			return this.props.children.length > 0 ? this.props.children[0] : null;
		};
		ASkeleton.prototype.getRowStyle = function(index) {
			return "width:" + this.getRowWidth(index) + ";";
		};
		ASkeleton.prototype.getRowWidth = function(index) {
			var rowWidth = this.props["row-width"] || DEFAULT_ROW_WIDTH;

			if (rowWidth === DEFAULT_ROW_WIDTH && index === this.props.row - 1) {
				return DEFAULT_LAST_ROW_WIDTH;
			}

			if (Array.isArray(rowWidth)) {
				return rowWidth[index];
			}

			return rowWidth;
		};
		ASkeleton.prototype.render = function() {
			var this$1 = this;
			return (
				(this.props.loading &&
					apivm.h(
						"view",
						{class: "a-skeleton"},
						this.props.avatar &&
							apivm.h("view", {class: this.avatarClass, style: this.avatarStyle}),
						apivm.h(
							"view",
							{style: "flex:1"},
							this.props.title &&
								apivm.h(
									"text",
									{class: "a-skeleton_title", style: this.titleStyle},
									this.props.title
								),
							this.props.row &&
								apivm.h(
									"view",
									null,
									(Array.isArray(this.rows) ? this.rows : Object.values(this.rows)).map(
										function(item$1, index$1) {
											return apivm.h("view", {
												class: "a-skeleton_row",
												style: this$1.getRowStyle(index$1)
											});
										}
									)
								)
						)
					)) ||
				this.getChildNode()
			);
		};

		return ASkeleton;
	})(Component);
	ASkeleton.css = {
		".a-skeleton": {flexDirection: "row"},
		".a-skeleton_avatar": {
			flexShrink: "0",
			width: "32px",
			height: "32px",
			marginRight: "16px",
			backgroundColor: "#f2f3f5"
		},
		".a-skeleton_round": {borderRadius: "999px"},
		".a-skeleton_title": {
			width: "40%",
			height: "16px",
			backgroundColor: "#f2f3f5"
		},
		".a-skeleton_row": {
			marginTop: "12px",
			width: "40%",
			height: "16px",
			backgroundColor: "#f2f3f5"
		}
	};
	apivm.define("a-skeleton", ASkeleton);

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

	var SimpleSkeleton = /*@__PURE__*/ (function(Component) {
		function SimpleSkeleton(props) {
			this.data = {
				title: "关于 act",
				desc:
					"act 是一套轻量、可靠的 avm 组件库，提供了丰富的基础组件和业务组件，帮助开发者快速搭建移动应用。",
				loading: true
			};
		}

		if (Component) SimpleSkeleton.__proto__ = Component;
		SimpleSkeleton.prototype = Object.create(Component && Component.prototype);
		SimpleSkeleton.prototype.constructor = SimpleSkeleton;
		SimpleSkeleton.prototype.onchange = function(e) {
			this.data.loading = !e.detail.value;
		};
		SimpleSkeleton.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("a-nav-bar", {title: "simple-skeleton", "left-arrow": true}),
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
							"通过 title 属性显示标题占位图，通过 row 属性配置占位段落行数。"
						),

						apivm.h("a-skeleton", {title: true, row: "3"})
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "显示头像"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 avatar 属性显示头像占位图。"
						),

						apivm.h("a-skeleton", {title: true, avatar: true, row: "3"})
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "展示子组件"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"将 loading 属性设置成 false 表示内容加载完成，此时会隐藏占位图，并显示 Skeleton 的子组件。"
						),

						apivm.h("switch", {
							style: "margin-bottom:16px",
							onchange: function(event) {
								if (this$1.onchange) {
									this$1.onchange(event);
								} else {
									onchange(event);
								}
							}
						}),

						apivm.h(
							"a-skeleton",
							{loading: this.data.loading, title: true, avatar: true, row: "3"},
							apivm.h(
								"view",
								{class: "demo-preview"},
								apivm.h(
									"view",
									null,
									apivm.h("image", {
										class: "demo-img",
										src: "https://docs.apicloud.com/apicloud3/favicon.png"
									})
								),
								apivm.h(
									"view",
									{style: "flex:1"},
									apivm.h("text", {class: "demo-title"}, this.data.title),
									apivm.h("text", {class: "demo-desc"}, this.data.desc)
								)
							)
						)
					)
				)
			);
		};

		return SimpleSkeleton;
	})(Component);
	SimpleSkeleton.css = {
		".page": {height: "100%", backgroundColor: "#fff"},
		".simple": {margin: "16px"},
		".simple-title": {marginBottom: "16px", fontSize: "18px", fontWeight: "600"},
		".simple-desc": {marginBottom: "16px", fontSize: "14px", color: "#999"},
		".demo-preview": {flexDirection: "row", marginBottom: "16px"},
		".demo-img": {
			flexShrink: "0",
			width: "32px",
			height: "32px",
			marginRight: "16px",
			backgroundColor: "#f2f3f5",
			borderRadius: "999px"
		},
		".demo-title": {lineHeight: "20px", fontSize: "18px", fontWeight: "bold"},
		".demo-desc": {marginTop: "12px", lineHeight: "20px", fontSize: "14px"}
	};
	apivm.define("simple-skeleton", SimpleSkeleton);
})();
