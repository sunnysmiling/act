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

	/**
	 * v-model 双向绑定模拟
	 * @returns {{}}
	 */
	function syncModel() {
		var $model = {};
		var _host = this._host;
		Object.entries(this.props).forEach(function(_ref3) {
			var k = _ref3[0],
				v = _ref3[1];
			if (k.startsWith("$")) {
				var path = v.replace(/]/g, "").split(/[.[]/);
				while (typeof _host.data[path[0]] === "undefined") {
					if (_host._host) {
						_host = _host._host;
					} else {
						break;
					}
				}
				var data = _host.data;
				var lastKey = path.pop();
				path.forEach(function(p) {
					return (data = data[p]);
				});
				// $model[k.substr(1)] = value => {
				//     return value === undefined ? data[lastKey] : data[lastKey] = value;
				// };

				Object.defineProperty($model, k.substr(1), {
					get: function get() {
						return data[lastKey];
					},
					set: function set(v) {
						return (data[lastKey] = v);
					}
				});
			}
		});
		this.$model = $model;
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

	var APopup = /*@__PURE__*/ (function(Component) {
		function APopup(props) {}

		if (Component) APopup.__proto__ = Component;
		APopup.prototype = Object.create(Component && Component.prototype);
		APopup.prototype.constructor = APopup;
		APopup.prototype.install = function() {
			var this$1 = this;

			syncModel.call(this);

			this.render = function(props) {
				var obj;

				var h = apivm.h;
				var extractClass = apivm.extractClass;
				return this$1.$model.show
					? h(
							"view",
							Object.assign({}, extractClass(props, "a-popup__overlay"), {
								onClick: function(_) {
									return this$1.handleClose(_, "overlay");
								}
							}),

							h(
								"view",
								Object.assign(
									{},
									extractClass(
										props,
										"a-popup  a-popup--position-" + (props.position || "center"),
										((obj = {}),
										(obj["a-popup--round-" + (props.position || "center")] = props.round),
										obj)
									),

									{style: props.style + "||''"}
								),
								props.children,
								props.closeable &&
									h(AIcon, {
										name: props["close-icon"] || "close",
										size: 22,
										color: props["close-icon-color"] || "#c8c9cc",
										class:
											"a-popup__close a-popup__close--" +
											(props["close-icon-position"] || "top-right"),
										onClick: function(_) {
											return this$1.handleClose(_, "icon");
										}
									})
							)
					  )
					: h("text", {display: "none"}, "");
			};
		};
		APopup.prototype.handleClose = function(ev, type) {
			ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);
			this.$model.show = false;
			this.fire("close", {type: type});
		};
		APopup.prototype.render = function() {
			return;
		};

		return APopup;
	})(Component);
	APopup.css = {
		".a-popup__overlay": {
			position: "absolute",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			backgroundColor: "rgba(0, 0, 0, 0.7)"
		},
		".a-popup--state-0": {backgroundColor: "rgba(0, 0, 0, 0)"},
		".a-popup--state-1": {backgroundColor: "rgba(0, 0, 0, 0.7)"},
		".a-popup": {
			position: "absolute",
			maxHeight: "100%",
			overflowY: "auto",
			backgroundColor: "#fff",
			WebkitTransition: "-webkit-transform 0.3s",
			transition: "transform 0.3s",
			WebkitOverflowScrolling: "touch"
		},
		".a-popup--position-center": {
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)"
		},
		".a-popup--position-top": {top: "0", left: "0", width: "100%"},
		".a-popup--position-bottom": {bottom: "0", left: "0", width: "100%"},
		".a-popup--position-left": {left: "0"},
		".a-popup--position-right": {right: "0"},
		".a-popup__close": {position: "absolute"},
		".a-popup__close--top-left": {top: "16px", left: "16px"},
		".a-popup__close--top-right": {top: "16px", right: "16px"},
		".a-popup__close--bottom-left": {bottom: "16px", left: "16px"},
		".a-popup__close--bottom-right": {bottom: "16px", right: "16px"},
		".a-popup--round-center": {borderRadius: "16px"},
		".a-popup--round-top": {borderRadius: "0 0 16px 16px"},
		".a-popup--round-bottom": {borderRadius: "16px 16px 0 0"},
		".a-popup--round-left": {borderRadius: "0 16px 16px 0"},
		".a-popup--round-right": {borderRadius: "16px 0 0 16px"}
	};
	apivm.define("a-popup", APopup);

	global.PRESET_ICONS = [
		"qq",
		"link",
		"weibo",
		"wechat",
		"poster",
		"qrcode",
		"weapp-qrcode"
	];
	var AShareSheet = /*@__PURE__*/ (function(Component) {
		function AShareSheet(props) {
			this.data = {
				show: true
			};
			this.compute = {
				options: function() {
					var ref = this.props;
					var options = ref.options;
					if (Array.isArray(options) && Array.isArray(options[0])) {
						return options;
					}
					return [options];
				}
			};
		}

		if (Component) AShareSheet.__proto__ = Component;
		AShareSheet.prototype = Object.create(Component && Component.prototype);
		AShareSheet.prototype.constructor = AShareSheet;
		AShareSheet.prototype.onCancel = function() {
			this.data.show = false;
			this.$model.show = false;
		};
		AShareSheet.prototype.onSelect = function(e) {
			var detail = {option: e.currentTarget.dataset.option};
			this.fire("select", detail);
			this.onCancel();
		};
		AShareSheet.prototype.onClose = function() {
			this.fire("click-overlay", {});
			if (
				"close-on-click-overlay" in this.props &&
				!this.props["close-on-click-overlay"]
			) {
				return;
			}
			this.onCancel();
		};
		AShareSheet.prototype.onBlock = function(e) {
			e.stopPropagation && e.stopPropagation();
		};
		AShareSheet.prototype.getIconURL = function(icon) {
			if (PRESET_ICONS.indexOf(icon) !== -1) {
				return "https://docs.apicloud.com/act/img/share-icon-" + icon + ".png";
			}
			return icon;
		};
		AShareSheet.prototype.beforeRender = function() {
			this.data.show = true;
			if (!this.$model) {
				syncModel.call(this);
			}
		};
		AShareSheet.prototype.render = function() {
			var this$1 = this;
			return (
				this.$model.show &&
				apivm.h(
					"a-popup",
					{$show: "show", round: true, position: "bottom", onClose: this.onClose},
					apivm.h(
						"view",
						{onClick: this.onBlock},
						apivm.h(
							"view",
							{class: "a-share-sheet-header"},
							this.props.title
								? apivm.h(
										"text",
										{class: "a-share-sheet-header-title"},
										this.props.title
								  )
								: null,
							this.props.description
								? apivm.h(
										"text",
										{class: "a-share-sheet-header-desc"},
										this.props.description
								  )
								: null
						),
						(Array.isArray(this.options)
							? this.options
							: Object.values(this.options)
						).map(function(option, i) {
							return apivm.h(
								"scroll-view",
								{
									class:
										"a-share-sheet-options" +
										(i > 0 ? " a-share-sheet-options-border" : ""),
									"scroll-x": true,
									"always-bounces": false,
									"show-scrollbar": false
								},
								(Array.isArray(option) ? option : Object.values(option)).map(function(
									item$1,
									j
								) {
									return apivm.h(
										"view",
										{
											class: "a-share-sheet-option",
											"data-option": item$1,
											onClick: this$1.onSelect
										},
										apivm.h("image", {
											src: this$1.getIconURL(item$1.icon),
											class: "a-share-sheet-icon",
											policy: "cache_only"
										}),
										item$1.name
											? apivm.h("text", {class: "a-share-sheet-name"}, item$1.name)
											: null,
										item$1.description
											? apivm.h(
													"text",
													{class: "a-share-sheet-option-description"},
													item$1.description
											  )
											: null
									);
								})
							);
						}),
						apivm.h(
							"button",
							{class: "a-share-sheet-cancel", onClick: this.onCancel},
							"取消"
						),
						!("safe-area-inset-bottom" in this.props) ||
							this.props["safe-area-inset-bottom"]
							? apivm.h("view", {style: "height:" + api.safeArea.bottom + "px;"})
							: null
					)
				)
			);
		};

		return AShareSheet;
	})(Component);
	AShareSheet.css = {
		".a-share-sheet": {
			zIndex: "99",
			width: "200px",
			height: "100px",
			background: "red"
		},
		".a-share-sheet-header": {padding: "12px 16px 4px"},
		".a-share-sheet-header-title": {
			marginTop: "8px",
			color: "#323233",
			textAlign: "center",
			fontWeight: "normal",
			fontSize: "14px",
			lineHeight: "20px"
		},
		".a-share-sheet-header-desc": {
			marginTop: "8px",
			color: "#969799",
			textAlign: "center",
			fontSize: "12px",
			lineHeight: "16px"
		},
		".a-share-sheet-options": {padding: "16px 0 16px 8px"},
		".a-share-sheet-options-border": {borderTop: "0.5px solid #ebedf0"},
		".a-share-sheet-option": {display: "inline-flex", alignItems: "center"},
		".a-share-sheet-icon": {width: "48px", height: "48px", margin: "0 16px"},
		".a-share-sheet-name": {
			marginTop: "8px",
			padding: "0 4px",
			color: "#646566",
			fontSize: "12px"
		},
		".a-share-sheet-option-description": {
			padding: "0 4px",
			color: "#c8c9cc",
			fontSize: "12px"
		},
		".a-share-sheet-cancel": {
			width: "100%",
			padding: "0",
			fontSize: "16px",
			lineHeight: "48px",
			textAlign: "center",
			background: "white",
			border: "none",
			borderTop: "8px solid #f7f8fa"
		}
	};
	apivm.define("a-share-sheet", AShareSheet);

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

	var SimpleShareSheet = /*@__PURE__*/ (function(Component) {
		function SimpleShareSheet(props) {
			this.data = {
				showBasic: false,
				showMultiLine: false,
				showCustomIcon: false,
				showWithDesc: false,
				"zh-CN": {
					qq: "QQ",
					link: "复制链接",
					weibo: "微博",
					wechat: "微信",
					poster: "分享海报",
					qrcode: "二维码",
					weappQrcode: "小程序码"
				}
			};
			this.compute = {
				options: function() {
					return [
						{name: this.t("wechat"), icon: "wechat"},
						{name: this.t("weibo"), icon: "weibo"},
						{name: this.t("link"), icon: "link"},
						{name: this.t("poster"), icon: "poster"},
						{name: this.t("qrcode"), icon: "qrcode"}
					];
				},
				name: function() {},
				icon: function() {},
				multiLineOptions: function() {
					return [
						[
							{name: this.t("wechat"), icon: "wechat"},
							{name: this.t("weibo"), icon: "weibo"},
							{name: this.t("qq"), icon: "qq"}
						],

						[
							{name: this.t("link"), icon: "link"},
							{name: this.t("poster"), icon: "poster"},
							{name: this.t("qrcode"), icon: "qrcode"},
							{name: this.t("weappQrcode"), icon: "weapp-qrcode"}
						]
					];
				},
				customIconOptions: function() {
					return [
						{
							name: "名称",
							icon: "https://docs.apicloud.com/act/img/custom-icon-fire.png"
						},

						{
							name: "名称",
							icon: "https://docs.apicloud.com/act/img/custom-icon-light.png"
						},

						{
							name: "名称",
							icon: "https://docs.apicloud.com/act/img/custom-icon-water.png"
						}
					];
				},
				optionsWithDesc: function() {
					return [
						{name: this.t("wechat"), icon: "wechat"},
						{name: this.t("weibo"), icon: "weibo"},
						{
							name: this.t("link"),
							icon: "link",
							description: "描述信息"
						},

						{name: this.t("poster"), icon: "poster"},
						{name: this.t("qrcode"), icon: "qrcode"}
					];
				},
				description: function() {}
			};
		}

		if (Component) SimpleShareSheet.__proto__ = Component;
		SimpleShareSheet.prototype = Object.create(Component && Component.prototype);
		SimpleShareSheet.prototype.constructor = SimpleShareSheet;
		SimpleShareSheet.prototype.onSelect = function(e) {
			api.toast({msg: e.detail.option.name});
			this.data.showBasic = false;
			this.data.showWithDesc = false;
			this.data.showMultiLine = false;
			this.data.showCustomIcon = false;
		};
		SimpleShareSheet.prototype.t = function(key) {
			return this.data["zh-CN"][key];
		};
		SimpleShareSheet.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("a-nav-bar", {title: "simple-share-sheet", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "基础用法"),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								title: "显示分享面板",
								"is-link": true,
								onclick: function(_) {
									return (this$1.data.showBasic = true);
								}
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "展示多行选项"),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								title: "显示分享面板",
								"is-link": true,
								onclick: function(_) {
									return (this$1.data.showMultiLine = true);
								}
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义图标"),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								title: "显示分享面板",
								"is-link": true,
								onclick: function(_) {
									return (this$1.data.showCustomIcon = true);
								}
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "展示描述信息"),

						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								title: "显示分享面板",
								"is-link": true,
								onclick: function(_) {
									return (this$1.data.showWithDesc = true);
								}
							})
						)
					)
				),

				apivm.h("a-share-sheet", {
					$show: "showBasic",
					title: "立即分享给好友",
					options: this.options,
					onSelect: this.onSelect
				}),

				apivm.h("a-share-sheet", {
					$show: "showMultiLine",
					title: "立即分享给好友",
					options: this.multiLineOptions,
					onSelect: this.onSelect
				}),

				apivm.h("a-share-sheet", {
					$show: "showCustomIcon",
					title: "立即分享给好友",
					options: this.customIconOptions,
					onSelect: this.onSelect
				}),

				apivm.h("a-share-sheet", {
					$show: "showWithDesc",
					title: "立即分享给好友",
					description: "描述信息",
					options: this.optionsWithDesc,
					onSelect: this.onSelect
				})
			);
		};

		return SimpleShareSheet;
	})(Component);
	SimpleShareSheet.css = {
		".page": {height: "100%", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"}
	};
	apivm.define("simple-share-sheet", SimpleShareSheet);
})();
