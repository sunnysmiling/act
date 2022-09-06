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
	 * 检测是否存在指定插槽
	 * @param name
	 * @param props
	 * @returns {Boolean}
	 */
	function haveSlot(name, props) {
		var flag = false;
		var children = props.children;
		children.forEach(function(node) {
			if (
				node &&
				node.nodeName === "template" &&
				node.attributes &&
				node.attributes._slot === name
			) {
				flag = true;
			}
		});
		return flag;
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

	var ASearch = /*@__PURE__*/ (function(Component) {
		function ASearch(props) {
			this.data = {};
			this.compute = {
				backgroundClass: function() {
					return (
						"a-search " +
						(this.props.class || "") +
						" " +
						(this.props["show-action"] ? " a-search-show-action" : "")
					);
				},
				backgroundStyle: function() {
					return (
						"background:" +
						(this.props.background || "white") +
						";" +
						(this.props.style || "")
					);
				},
				contentClass: function() {
					return (
						"a-search-content" +
						(this.props.shape == "round" ? " a-search-content-round" : "")
					);
				},
				fieldAttrs: function() {
					return Object.assign({}, this.props, {
						style:
							"background:transparent;flex-grow:1;padding-left:0;padding-right:0;",
						class: "form-search"
					});
				},
				style: function() {},
				class: function() {}
			};
		}

		if (Component) ASearch.__proto__ = Component;
		ASearch.prototype = Object.create(Component && Component.prototype);
		ASearch.prototype.constructor = ASearch;
		ASearch.prototype.onConfirm = function(e) {
			this.fire("search", e.detail);
		};
		ASearch.prototype.onCancel = function() {
			this.$model.value = "";
			this.fire("cancel", {});
		};
		ASearch.prototype.beforeRender = function() {
			if (!this.$model) {
				syncModel.call(this);
			}
		};
		ASearch.prototype.render = function() {
			return slotSupport(
				apivm.h(
					"view",
					{class: this.backgroundClass, style: this.backgroundStyle},
					apivm.h("view", {_slot: "left"}),
					apivm.h(
						"view",
						{class: this.contentClass},
						apivm.h(
							"view",
							null,

							this.props.label || haveSlot("label", this.props)
								? apivm.h(
										"view",
										{class: "a-search-label"},
										!haveSlot("label", this.props)
											? apivm.h(
													"text",
													{class: "a-search-label-default"},
													this.props.label
											  )
											: null,
										apivm.h("view", {_slot: "label"})
								  )
								: null
						),
						apivm.h(
							"a-field",
							Object.assign({}, {clearable: true}, this.fieldAttrs, {
								label: "",
								"left-icon": this.props["left-icon"] || "search",
								"confirm-type": "search",
								onConfirm: this.onConfirm
							})
						)
					),
					this.props["show-action"]
						? apivm.h(
								"view",
								{class: "a-search-action"},
								!haveSlot("action", this.props)
									? apivm.h(
											"text",
											{class: "a-search-action-cancel", onClick: this.onCancel},
											this.props["action-text"] || "取消"
									  )
									: null,
								apivm.h("view", {_slot: "action"})
						  )
						: null
				),
				this.props.children
			);
		};

		return ASearch;
	})(Component);
	ASearch.css = {
		".a-search": {
			flexDirection: "row",
			alignItems: "center",
			boxSizing: "border-box",
			padding: "10px 12px",
			background: "white"
		},
		".a-search-label": {
			flexDirection: "row",
			alignItems: "center",
			padding: "0 5px"
		},
		".a-search-label-default": {
			color: "#323233",
			fontSize: "14px",
			lineHeight: "34px"
		},
		".a-search-show-action": {paddingRight: "0"},
		".a-search-content": {
			flexDirection: "row",
			alignItems: "center",
			flex: "1",
			padding: "0 12px",
			backgroundColor: "#f7f8fa",
			borderRadius: "2px"
		},
		".a-search-content-round": {borderRadius: "999px"},
		".a-search-action": {padding: "0 8px"},
		".a-search-action-cancel": {
			color: "#323233",
			fontSize: "14px",
			lineHeight: "34px",
			cursor: "pointer",
			userSelect: "none"
		},
		".a-search-action-cancel:active": {opacity: "0.8"}
	};
	apivm.define("a-search", ASearch);

	var CarQ1 = /*@__PURE__*/ (function(Component) {
		function CarQ1(props) {}

		if (Component) CarQ1.__proto__ = Component;
		CarQ1.prototype = Object.create(Component && Component.prototype);
		CarQ1.prototype.constructor = CarQ1;
		CarQ1.prototype.render = function() {
			return apivm.h("view", null, apivm.h("a-search", null));
		};

		return CarQ1;
	})(Component);
	CarQ1.css = {".c": {backgroundColor: "green"}};
	apivm.define("car-q1", CarQ1);
})();
