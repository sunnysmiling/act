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

	/**
	 * 返回安全的 props
	 * @param props
	 * @returns {{[p: string]: unknown}}
	 */
	function safeProps(props) {
		// return Object.fromEntries(Object.entries(props).map(([k, v]) => [k.replace(/[$#;@]/g, '_'), v]))
		var o = {};
		for (var k in props) {
			o[k.replace(/[$#;@]/g, "_")] = props[k];
		}
		return o;
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

	var AField = /*@__PURE__*/ (function(Component) {
		function AField(props) {
			this.data = {
				value: props.value,
				isFocus: false
			};
		}

		if (Component) AField.__proto__ = Component;
		AField.prototype = Object.create(Component && Component.prototype);
		AField.prototype.constructor = AField;
		AField.prototype.install = function() {
			var this$1 = this;

			this.render = function(props) {
				syncModel.call(this$1);
				var h = apivm.h;

				if (this$1.$model.value) {
					this$1.data.value = this$1.$model.value;
				}

				var inputAlign = this$1.props["input-align"];
				var attr = {
					value: this$1.data.value,
					class: mixedClass("a-field__control", {
						"a-field__control--error": props.error,
						"a-field__control-center": inputAlign === "center",
						"a-field__control-right": inputAlign === "right"
					}),

					onInput: this$1.handleOnInput,
					onConfirm: this$1.handleOnConfirm,
					placeholder: props.placeholder,
					type: props.type === "password" ? "password" : "text",
					"keyboard-type": props.type || "default",
					"confirm-type": props["confirm-type"] || "done",
					onfocus: this$1.handleOnFocus,
					onblur: this$1.handleOnBlur,
					maxlength: props.maxlength || false
				};

				if (props.autofocus) {
					attr.autofocus = true;
				}

				if (props.type === "password") {
					//安卓端支持
					delete attr["keyboard-type"];
				}

				if (props.readonly) {
					attr.readonly = true;
					if (api.systemType === "android") {
						attr.disabled = true;
					}
				}

				if (props.disabled) {
					attr.disabled = true;
				}
				if (props.colon) {
					props.label += " :";
				}

				return h(
					ACell,
					Object.assign({}, safeProps(props), {
						title: props.label,
						label: "",
						class: mixedClass("a-field " + (props.class || "") + " ", {
							"a-field--disabled": props.disabled
						}),

						icon: props["left-icon"],
						style: (props.style || "") + " ",
						"label-width": props["label-width"] || 88,
						"label-align": props["label-align"] || "left"
					}),

					h(
						"template",
						{class: "a-field__body", _slot: "value"},
						h("input", attr),
						props["error-message"] &&
							h("text", {class: "a-field__error-msg"}, props["error-message"])
					),

					(props["clearable"] &&
						this$1.data.value &&
						(api.systemType === "android" || this$1.data.isFocus) &&
						h(
							"template",
							{
								_slot: "right-icon",
								onClick: function(_) {
									return this$1.onClear(_);
								}
							},
							h(AIcon, {
								name: "delete-filling",
								color: "#c8c9cc"
							})
						)) ||
						(props["right-icon"] &&
							h(
								"template",
								{_slot: "right-icon"},
								h(AIcon, {
									name: props["right-icon"]
								})
							)),

					props.children
				);
			};
		};
		AField.prototype.handleOnInput = function(ref) {
			var value = ref.detail.value;

			if (!this.props.readonly) {
				this.setValue(value, "input");
			}
		};
		AField.prototype.handleOnConfirm = function(e) {
			this.fire("confirm", e.detail);
		};
		AField.prototype.onClear = function(_) {
			this.setValue("", "clear");
		};
		AField.prototype.handleOnFocus = function(_) {
			this.data.isFocus = true;
			this.fire("focus", _);
		};
		AField.prototype.handleOnBlur = function(_) {
			this.data.isFocus = false;
			this.fire("blur", _);
		};
		AField.prototype.setValue = function(value, type) {
			this.$model.value = value;
			this.fire(type, {value: value});
			this.data.value = value;
		};
		AField.prototype.render = function() {
			return;
		};

		return AField;
	})(Component);
	AField.css = {
		".a-field__body": {flex: "1"},
		".a-field__control": {
			display: "block",
			boxSizing: "border-box",
			color: "#323233",
			border: "none",
			fontSize: "14px",
			height: "24px",
			lineHeight: "24px",
			width: "100%",
			flexShrink: "0",
			background: "transparent"
		},
		".a-field--disabled": {cursor: "not-allowed", opacity: "0.3"},
		".a-field__control-center": {textAlign: "center"},
		".a-field__control-right": {textAlign: "right"},
		".a-field__control--error": {color: "#ee0a24"},
		".a-field__error-msg": {color: "#ee0a24", fontSize: "12px"}
	};
	apivm.define("a-field", AField);

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

	var SimpleField = /*@__PURE__*/ (function(Component) {
		function SimpleField(props) {
			this.data = {
				value: "",
				value2: "阿萨德",
				state: {value2: 123},
				username: "错误的用户名",
				phone: "",
				sms: ""
			};
		}

		if (Component) SimpleField.__proto__ = Component;
		SimpleField.prototype = Object.create(Component && Component.prototype);
		SimpleField.prototype.constructor = SimpleField;
		SimpleField.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-field", "left-arrow": true}),
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
							"可以通过 $value 双向绑定输入框的值，通过 placeholder 设置占位提示文字。"
						),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"双向绑定测试: ",
							this.data.value,
							this.data.value2
						),

						apivm.h(
							"a-cell-group",
							null,
							apivm.h("a-field", {
								$value: "value",
								label: "姓氏",
								placeholder: "请输入用户名"
							}),
							apivm.h("a-field", {
								$value: "value2",
								label: "名字",
								placeholder: "请输入用户名"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义类型"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"根据 keyboard-type 属性定义不同类型的输入框，默认值为 text。"
						),

						apivm.h(
							"a-cell-group",
							null,

							apivm.h("a-field", {
								$value: "state.default",
								label: "文本",
								placeholder: "输入文本"
							}),

							apivm.h("a-field", {
								$value: "state.number",
								type: "number",
								label: "输入整数",
								placeholder: "输入整数"
							}),

							apivm.h("a-field", {
								$value: "state.decimal",
								type: "decimal",
								label: "带小数的数字",
								placeholder: "带小数的数字"
							}),

							apivm.h("a-field", {
								$value: "state.tel",
								type: "tel",
								label: "输入电话",
								placeholder: "输入电话"
							}),

							apivm.h("a-field", {
								$value: "state.email",
								type: "email",
								label: "输入email",
								placeholder: "输入email"
							}),

							apivm.h("a-field", {
								$value: "state.url",
								type: "url",
								label: "输入网站url",
								placeholder: "输入网站url"
							}),

							apivm.h("a-field", {
								$value: "state.password",
								type: "password",
								label: "输入密码",
								placeholder: "输入密码"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义按钮"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"根据 confirm-type 属性定义键盘右下角的按钮文案,默认是完成(done)。"
						),

						apivm.h(
							"a-cell-group",
							null,
							apivm.h("a-field", {
								$value: "state.default",
								label: "完成",
								placeholder: "done"
							}),
							apivm.h("a-field", {
								$value: "state.default",
								label: "发送",
								"confirm-type": "send",
								placeholder: "send"
							}),
							apivm.h("a-field", {
								$value: "state.default",
								label: "搜索",
								"confirm-type": "search",
								placeholder: "search"
							}),
							apivm.h("a-field", {
								$value: "state.default",
								label: "下一个",
								"confirm-type": "next",
								placeholder: "next"
							}),
							apivm.h("a-field", {
								$value: "state.default",
								label: "前往",
								"confirm-type": "go",
								placeholder: "go"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "禁用输入框"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 readonly 将输入框设置为只读状态，通过 disabled 将输入框设置为禁用状态。"
						),
						apivm.h(
							"a-cell-group",
							null,
							apivm.h("a-field", {label: "文本", value: "输入框只读", readonly: true}),
							apivm.h("a-field", {
								label: "文本",
								value: "输入框已禁用",
								disabled: true
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "显示图标"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 left-icon 和 right-icon 配置输入框两侧的图标，通过设置 clearable 在输入过程中展示清除图标。"
						),
						apivm.h(
							"a-cell-group",
							null,
							apivm.h("a-field", {
								$value: "state.value1",
								label: "文本",
								"left-icon": "link",
								"right-icon": "prompt",
								placeholder: "显示图标"
							}),
							apivm.h("a-field", {
								$value: "state.value2",
								clearable: true,
								label: "文本",
								"left-icon": "map",
								placeholder: "显示清除图标"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "错误提示"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 required 属性表示这是一个必填项，可以配合 error 或 error-message 属性显示对应的错误提示。"
						),
						apivm.h(
							"a-cell-group",
							null,
							apivm.h("a-field", {
								$value: "username",
								error: true,
								required: true,
								label: "用户名",
								placeholder: "请输入用户名"
							}),
							apivm.h("a-field", {
								$value: "phone",
								required: true,
								label: "手机号",
								placeholder: "请输入手机号",
								"error-message": "手机号格式错误"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "插入按钮"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 button 插槽可以在输入框尾部插入按钮。"
						),
						apivm.h(
							"a-cell-group",
							null,
							apivm.h(
								"a-field",
								{
									$value: "sms",
									center: true,
									clearable: true,
									label: "短信验证码",
									placeholder: "请输入短信验证码"
								},
								apivm.h(
									"template",
									{_slot: "button", class: "demo-button"},
									apivm.h("a-button", {size: "small", type: "primary"}, "发送验证码")
								)
							)
						)
					),

					apivm.h("view", {style: "height: 200px"})
				)
			);
		};

		return SimpleField;
	})(Component);
	SimpleField.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".todo": {background: "#f1e9d5"},
		".demo-button": {marginLeft: "5px"}
	};
	apivm.define("simple-field", SimpleField);
})();
