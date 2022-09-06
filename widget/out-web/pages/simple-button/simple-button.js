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

	var AButton = /*@__PURE__*/ (function(Component) {
		function AButton(props) {}

		if (Component) AButton.__proto__ = Component;
		AButton.prototype = Object.create(Component && Component.prototype);
		AButton.prototype.constructor = AButton;
		AButton.prototype.install = function() {
			var h = avm.h;

			this.render = function(props) {
				var obj;

				if (!props.type) {
					props.type = "default";
				}
				if (!props.size) {
					props.size = "normal";
				}

				if (props.icon) {
					props.children.unshift({
						nodeName: AIcon,
						attributes: {name: props.icon, color: "#FFF", size: 20}
					});
				}

				return h(
					"button",
					Object.assign({}, props, {
						class: mixedClass(
							"a-button a-button--" +
								props.type +
								" a-button--" +
								props.size +
								" " +
								(props.class || ""),
							((obj = {}),
							(obj["a-button--plain a-button--plain---a-button--" + props.type] =
								props.plain),
							(obj["a-button--hairline"] = props.hairline),
							(obj["a-button--disabled"] = props.disabled),
							(obj["a-button--square"] = props.square),
							(obj["a-button--round"] = props.round),
							obj)
						)
					}),

					props.text,
					props.children
				);
			};
		};
		AButton.prototype.render = function() {
			return;
		};

		return AButton;
	})(Component);
	AButton.css = {
		".a-button": {
			padding: "0",
			boxSizing: "border-box",
			height: "44px",
			lineHeight: "44px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			textAlign: "center",
			borderRadius: "2px",
			cursor: "pointer",
			WebkitTransition: "opacity 0.2s",
			transition: "opacity 0.2s",
			WebkitAppearance: "none"
		},
		".a-button::after": {border: "none"},
		".a-button--primary": {
			color: "#fff",
			backgroundColor: "#1989fa",
			border: "1px solid #1989fa"
		},
		".a-button--success": {
			color: "#fff",
			backgroundColor: "#07c160",
			border: "1px solid #07c160"
		},
		".a-button--default": {
			color: "#323233",
			backgroundColor: "#fff",
			border: "1px solid #ebedf0"
		},
		".a-button--danger": {
			color: "#fff",
			backgroundColor: "#ee0a24",
			border: "1px solid #ee0a24"
		},
		".a-button--warning": {
			color: "#fff",
			backgroundColor: "#ff976a",
			border: "1px solid #ff976a"
		},
		".a-button--plain": {backgroundColor: "#fff"},
		".a-button--plain---a-button--primary": {color: "#1989fa"},
		".a-button--plain---a-button--success": {color: "#07c160"},
		".a-button--plain---a-button--danger": {color: "#ee0a24"},
		".a-button--plain---a-button--warning": {color: "#ff976a"},
		".a-button--hairline": {borderWidth: "0.5px"},
		".a-button--disabled": {cursor: "not-allowed", opacity: "0.5", color: "#fff"},
		".a-button--round": {borderRadius: "999px"},
		".a-button--square": {borderRadius: "0"},
		".a-button--large": {
			width: "100%",
			height: "50px",
			lineHeight: "50px",
			fontSize: "16px"
		},
		".a-button--normal": {padding: "0 15px", fontSize: "14px"},
		".a-button--small": {
			height: "32px",
			lineHeight: "32px",
			padding: "0 8px",
			fontSize: "12px"
		},
		".a-button--mini": {
			height: "24px",
			lineHeight: "24px",
			padding: "0 4px",
			fontSize: "10px"
		}
	};
	apivm.define("a-button", AButton);

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

	var SimpleButton = /*@__PURE__*/ (function(Component) {
		function SimpleButton(props) {
			this.data = {
				text: "哈哈哈 "
			};
		}

		if (Component) SimpleButton.__proto__ = Component;
		SimpleButton.prototype = Object.create(Component && Component.prototype);
		SimpleButton.prototype.constructor = SimpleButton;
		SimpleButton.prototype.test = function() {
			this.data.text = "测试";
		};
		SimpleButton.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("a-nav-bar", {title: "button", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},
					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "按钮类型"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"按钮支持 default、primary、success、warning、danger 五种类型，默认为 default。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h("a-button", {type: "primary", class: "demo"}, "主要按钮"),
							apivm.h("a-button", {type: "success", class: "demo"}, "成功按钮"),
							apivm.h("a-button", {class: "demo"}, "默认按钮")
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("a-button", {type: "warning", class: "demo"}, "警告按钮"),
							apivm.h("a-button", {type: "danger", class: "demo"}, "危险按钮")
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "朴素按钮"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 plain 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h(
								"a-button",
								{plain: true, type: "primary", class: "demo"},
								"主要按钮"
							),
							apivm.h(
								"a-button",
								{plain: true, type: "success", class: "demo"},
								"成功按钮"
							)
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h(
								"a-button",
								{plain: true, type: "warning", class: "demo"},
								"警告按钮"
							),
							apivm.h(
								"a-button",
								{plain: true, type: "danger", class: "demo"},
								"危险按钮"
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "细边框"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 hairline 属性可以展示 0.5px 的细边框。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h(
								"a-button",
								{plain: true, hairline: true, type: "primary", class: "demo"},
								"主要按钮"
							),
							apivm.h(
								"a-button",
								{plain: true, hairline: true, type: "success", class: "demo"},
								"成功按钮"
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "禁用状态"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 disabled 属性来禁用按钮，禁用状态下按钮不可点击。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h(
								"a-button",
								{disabled: true, type: "primary", class: "demo"},
								"主要按钮"
							),
							apivm.h(
								"a-button",
								{disabled: true, type: "success", class: "demo"},
								"成功按钮"
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "按钮形状"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 square 设置方形按钮，通过 round 设置圆形按钮。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h(
								"a-button",
								{square: true, type: "primary", class: "demo"},
								"主要按钮"
							),
							apivm.h(
								"a-button",
								{round: true, type: "success", class: "demo"},
								"成功按钮"
							)
						)
					),
					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "按钮图标"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 icon 属性设置按钮图标，支持 Icon 组件里的所有图标，也可以传入图标 URL。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;padding: 16px;"},
							apivm.h("a-button", {icon: "search", type: "primary", class: "demo"}),
							apivm.h("a-button", {icon: "add", type: "success", class: "demo"}),
							apivm.h("a-button", {
								plain: true,
								icon: "https://img.yzcdn.cn/vant/user-active.png",
								type: "primary",
								class: "demo"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title", onClick: this.test}, "按钮尺寸"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"支持 large、normal、small、mini 四种尺寸，默认为 normal。"
						),

						apivm.h(
							"view",
							{style: "flex-direction: row;flex-wrap:wrap;padding: 16px;"},
							apivm.h(
								"a-button",
								{type: "primary", size: "large", class: "demo"},
								"大号按钮"
							),
							apivm.h(
								"a-button",
								{type: "primary", size: "normal", class: "demo"},
								"普通按钮"
							),
							apivm.h(
								"a-button",
								{type: "primary", size: "small", class: "demo"},
								"小型按钮"
							),
							apivm.h(
								"a-button",
								{type: "primary", size: "mini", class: "demo"},
								"迷你按钮"
							)
						)
					)
				)
			);
		};

		return SimpleButton;
	})(Component);
	SimpleButton.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".row": {flexFlow: "row wrap", padding: "16px"},
		".demo": {marginLeft: "0", marginRight: "16px", marginBottom: "16px"},
		".simple": {marginBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"}
	};
	apivm.define("simple-button", SimpleButton);
})();
