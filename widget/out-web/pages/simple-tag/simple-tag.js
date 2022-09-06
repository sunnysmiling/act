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

	var ACell = /*@__PURE__*/ (function(Component) {
		function ACell(props) {}

		if (Component) ACell.__proto__ = Component;
		ACell.prototype = Object.create(Component && Component.prototype);
		ACell.prototype.constructor = ACell;
		ACell.prototype.install = function() {
			this.render = function(props) {
				var h = apivm.h;

				var isLarge = props.size === "large" || props.large;
				var isField = props.class && props.class.includes("a-field");

				Array.isArray(props.children) &&
					props.children.length === 1 &&
					typeof props.children[0] === "string" &&
					(props.title = props.children);

				var attr = Object.assign({}, props, {
					class: mixedClass(
						"a-cell a-cell__root " +
							(props.class || "") +
							" " +
							(props.__last ? "a-cell__-last" : "a-cell__-not-last"),
						{
							"a-cell--large": isLarge,
							"a-cell--center": props.center,
							"a-cell__root-not-from-search":
								props.class && props.class.indexOf("form-search") === -1
						}
					),

					style: props.style
				});

				// if (!this._host['a-swipe-cell']) {
				//   attr.onClick = this.cellClick
				// }

				if (props.url) {
					attr.onClick = function() {
						return linkTo(props.url, props.title);
					};
				} else if (props.to) {
					attr.onClick = function() {
						return linkTo(props.to, props.title);
					};
				}

				return slotSupport(
					h(
						"view",
						attr,
						props.required && h("text", {class: "a-field__required"}, "*"),
						props.icon && h(AIcon, {name: props.icon, class: "a-cell__left-icon"}),
						props.title
							? h(
									"view",
									{
										class: "a-cell__title",
										style:
											"" +
											(isField
												? "width:" +
												  (props["label-width"] || 88) +
												  "px;text-align:" +
												  props["label-align"]
												: "flex:1;")
									},
									h(
										"text",
										{
											class: mixedClass("a-cell__title-text", {
												"a-cell__title-text--large": isLarge
											}),

											_slot: "title"
										},
										props.title
									),
									props.label &&
										h(
											"text",
											{
												class: mixedClass("a-cell__label", {
													"a-cell__label--large": isLarge
												})
											},

											props.label
										)
							  )
							: isField
							? null
							: h("view", {
									class: "a-cell__title",
									style: " flex-direction: row;flex:1;",
									_slot: "title"
							  }),

						h(
							"text",
							{
								class: mixedClass("a-cell__value", {
									"a-cell__value--alone": !props.title
								})
							},

							props.value
						),

						h("view", {
							_slot: "value"
						}),

						props["is-link"]
							? h(AIcon, {
									name: props["arrow-direction"]
										? "arrow-" + props["arrow-direction"]
										: "arrow-right",
									class: "a-cell__right-icon",
									_slot: "right-icon"
							  })
							: h("view", {
									class: "a-cell__value",
									style: "justify-content: center;",
									_slot: "right-icon"
							  }),

						h("view", {
							class: "a-field__button",
							_slot: "button"
						})
					),

					props.children
				);
			};
		};
		ACell.prototype.render = function() {
			return;
		};

		return ACell;
	})(Component);
	ACell.css = {
		".a-cell, .a-cell__root": {
			flexDirection: "row",
			padding: "10px 16px",
			lineHeight: "24px"
		},
		".a-cell__root--not-from-search": {background: "#fff"},
		".a-cell--large": {paddingTop: "12px", paddingBottom: "12px"},
		".a-cell--center": {alignItems: "center"},
		".a-cell__left-icon": {marginRight: "4px"},
		".a-cell__right-icon": {marginLeft: "4px"},
		".a-cell__-not-last": {borderBottom: "1px solid #f5f4f4"},
		".a-cell__title": {color: "#323233"},
		".a-cell__title-text": {fontSize: "14px", height: "24px", lineHeight: "24px"},
		".a-cell__title-text--large": {fontSize: "16px"},
		".a-cell__label": {
			marginTop: "4px",
			color: "#969799",
			fontSize: "12px",
			lineHeight: "18px"
		},
		".a-cell__label--large": {fontSize: "14px"},
		".a-cell__value--alone, .a-cell__value.a-cell__value--alone": {
			color: "#323233",
			height: "24px",
			lineHeight: "24px"
		},
		".a-cell__value": {
			fontSize: "14px",
			color: "#969799",
			height: "24px",
			lineHeight: "24px"
		},
		".a-field__required": {color: "red", alignSelf: "flex-start"},
		".a-field__button": {marginLeft: "6px"}
	};
	apivm.define("a-cell", ACell);

	var ACellGroup = /*@__PURE__*/ (function(Component) {
		function ACellGroup(props) {}

		if (Component) ACellGroup.__proto__ = Component;
		ACellGroup.prototype = Object.create(Component && Component.prototype);
		ACellGroup.prototype.constructor = ACellGroup;
		ACellGroup.prototype.install = function() {
			this.render = function(props) {
				var obj;

				// 最后一个cell 标记为last 方便实现last伪元素
				if (props.children.length) {
					var last = props.children[props.children.length - 1];
					if (last.attributes) {
						last.attributes.__last = true;
					} else {
						last.attributes = {__last: true};
					}
				}

				var h = apivm.h;
				var renderGroup = h(
					"view",
					{
						class: mixedClass(
							"a-cell-group",
							((obj = {}), (obj["a-cell-group--round"] = props.round), obj)
						)
					},
					props.children
				);

				if (props.title) {
					// TODO 暂不支持空节点编译
					return h(
						"view",
						false,
						h("text", {class: "a-cell-group__title"}, props.title),
						renderGroup
					);
				}
				return renderGroup;
			};
		};
		ACellGroup.prototype.render = function() {
			return;
		};

		return ACellGroup;
	})(Component);
	ACellGroup.css = {
		".a-cell-group": {backgroundColor: "#FFF", border: "0.5px solid #ebedf0"},
		".a-cell-group--round": {
			margin: "12px 12px 0",
			overflow: "hidden",
			borderRadius: "8px"
		},
		".a-cell-group__title": {
			padding: "16px 16px 8px",
			color: "#969799",
			fontSize: "14px",
			lineHeight: "16px"
		}
	};
	apivm.define("a-cell-group", ACellGroup);

	var ATag = /*@__PURE__*/ (function(Component) {
		function ATag(props) {}

		if (Component) ATag.__proto__ = Component;
		ATag.prototype = Object.create(Component && Component.prototype);
		ATag.prototype.constructor = ATag;
		ATag.prototype.install = function() {
			var this$1 = this;

			this.render = function(props) {
				var obj;

				if (typeof props.show !== "undefined" && props.show === false) {
					return false;
				}

				var h = apivm.h;

				var attr = Object.assign({}, props, {
					class: mixedClass(
						"a-tag a-tag--" + (props.type || "default") + " " + (props.class || ""),
						((obj = {}),
						(obj["a-tag--plain a-tag--plain---a-tag--" + props.type] = props.plain),
						(obj["a-tag--round"] = props.round),
						(obj["a-tag--mark"] = props.mark),
						obj)
					),

					style: "" + (props.style || "")
				});

				if (props.closeable) {
					attr.onClick = function(_) {
						return this$1.onClose(_);
					};

					return h(
						"view",
						attr,
						h("text", attr, props.children),
						h(AIcon, {
							name: "close",
							size: 12,
							color: "#FFF"
						})
					);
				} else {
					return h("text", attr, props.children);
				}
			};
		};
		ATag.prototype.onClose = function(_) {
			this.fire("close");
		};
		ATag.prototype.render = function() {
			return;
		};

		return ATag;
	})(Component);
	ATag.css = {
		".a-tag": {
			alignItems: "center",
			padding: "0 4px",
			color: "#fff",
			fontSize: "12px",
			lineHeight: "16px",
			borderRadius: "2px",
			flexFlow: "row nowrap"
		},
		".a-tag--primary": {
			color: "#fff",
			backgroundColor: "#1989fa",
			border: "1px solid #1989fa"
		},
		".a-tag--success": {
			color: "#fff",
			backgroundColor: "#07c160",
			border: "1px solid #07c160"
		},
		".a-tag--default": {
			color: "#969799",
			backgroundColor: "#ebedf0",
			border: "1px solid #ebedf0"
		},
		".a-tag--danger": {
			color: "#fff",
			backgroundColor: "#ee0a24",
			border: "1px solid #ee0a24"
		},
		".a-tag--warning": {
			color: "#fff",
			backgroundColor: "#ff976a",
			border: "1px solid #ff976a"
		},
		".a-tag--plain": {backgroundColor: "#fff"},
		".a-tag--plain---a-tag--primary": {color: "#1989fa"},
		".a-tag--plain---a-tag--success": {color: "#07c160"},
		".a-tag--plain---a-tag--danger": {color: "#ee0a24"},
		".a-tag--plain---a-tag--warning": {color: "#ff976a"},
		".a-tag--round": {borderRadius: "8px"},
		".a-tag--mark": {borderRadius: "0 8px 8px 0"}
	};
	apivm.define("a-tag", ATag);

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

	var SimpleTag = /*@__PURE__*/ (function(Component) {
		function SimpleTag(props) {
			this.data = {
				show: true
			};
		}

		if (Component) SimpleTag.__proto__ = Component;
		SimpleTag.prototype = Object.create(Component && Component.prototype);
		SimpleTag.prototype.constructor = SimpleTag;
		SimpleTag.prototype.close = function() {
			this.data.show = false;
		};
		SimpleTag.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-tag", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},
					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "基础用法"),
						apivm.h("text", {class: "simple-desc"}, "通过 type 属性控制标签颜色。"),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h(
								"a-cell",
								{title: "默认类型"},
								apivm.h("template", {_slot: "value"}, apivm.h("a-tag", null, "标签"))
							),
							apivm.h(
								"a-cell",
								{title: "primary 类型"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "primary"}, "标签")
								)
							),

							apivm.h(
								"a-cell",
								{title: "success 类型"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "success"}, "标签")
								)
							),

							apivm.h(
								"a-cell",
								{title: "danger 类型"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "danger"}, "标签")
								)
							),

							apivm.h(
								"a-cell",
								{title: "warning 类型"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "warning"}, "标签")
								)
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "样式风格"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 plain 属性设置为空心样式。"
						),
						apivm.h("text", {class: "simple-desc"}, "通过 round 设置为圆角样式。"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 mark 设置为标记样式(半圆角)。"
						),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"添加 closeable 属性表示标签是可关闭的，关闭标签时会触发 close 事件，在 close 事件中可以执行隐藏标签的逻辑。"
						),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h(
								"a-cell",
								{title: "空心样式 plain"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {plain: true, type: "primary"}, "标签")
								)
							),
							apivm.h(
								"a-cell",
								{title: "空心样式 round"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "primary", round: true}, "标签")
								)
							),

							apivm.h(
								"a-cell",
								{title: "标记样式 mark"},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h("a-tag", {type: "primary", mark: true}, "标签")
								)
							),

							apivm.h(
								"a-cell",
								{title: "可关闭 closeable "},
								apivm.h(
									"template",
									{_slot: "value"},
									apivm.h(
										"a-tag",
										{
											type: "primary",
											closeable: true,
											show: this.data.show,
											onClose: this.close
										},
										"标签"
									)
								)
							)
						)
					)
				)
			);
		};

		return SimpleTag;
	})(Component);
	SimpleTag.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".todo": {background: "#f1e9d5"}
	};
	apivm.define("simple-tag", SimpleTag);
})();
