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

	function dateFormat(fmt, date) {
		var ret;
		var opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
			// 有其他格式化字符需求可以继续添加，必须转化成字符串
		};
		for (var k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(
					ret[1],
					ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
				);
			}
		}
		return fmt;
	}

	/**
	 * 日期比较
	 * @param day1
	 * @param day2
	 * @returns {number}
	 */
	function compareDay(day1, day2) {
		// const compareMonthResult = compareMonth(day1, day2);
		//
		// if (compareMonthResult === 0) {
		//     const date1 = day1.getDate();
		//     const date2 = day2.getDate();
		//
		//     return date1 === date2 ? 0 : date1 > date2 ? 1 : -1;
		// }
		return (day1 - day2) / 86400000;
	}

	/**
	 * 倒计时组件使用的格式化代码
	 * @param format
	 * @param currentTime
	 * @returns {*}
	 */
	function parseFormat(format, currentTime) {
		var days = currentTime.days;
		var hours = currentTime.hours,
			minutes = currentTime.minutes,
			seconds = currentTime.seconds,
			milliseconds = currentTime.milliseconds;

		if (format.indexOf("DD") === -1) {
			hours += days * 24;
		} else {
			format = format.replace("DD", padZero(days));
		}

		if (format.indexOf("HH") === -1) {
			minutes += hours * 60;
		} else {
			format = format.replace("HH", padZero(hours));
		}

		if (format.indexOf("mm") === -1) {
			seconds += minutes * 60;
		} else {
			format = format.replace("mm", padZero(minutes));
		}

		if (format.indexOf("ss") === -1) {
			milliseconds += seconds * 1000;
		} else {
			format = format.replace("ss", padZero(seconds));
		}

		if (format.indexOf("S") !== -1) {
			var ms = padZero(milliseconds, 3);

			if (format.indexOf("SSS") !== -1) {
				format = format.replace("SSS", ms);
			} else if (format.indexOf("SS") !== -1) {
				format = format.replace("SS", ms.slice(0, 2));
			} else {
				format = format.replace("S", ms.charAt(0));
			}
		}

		return format;
	}

	/**
	 * 补齐 0
	 * @param num
	 * @param targetLength
	 * @returns {string}
	 */
	function padZero(num, targetLength) {
		if (targetLength === void 0) {
			targetLength = 2;
		}
		var str = num + "";
		while (str.length < targetLength) {
			str = "0" + str;
		}
		return str;
	}

	var SECOND = 1000;
	var MINUTE = 60 * SECOND;
	var HOUR = 60 * MINUTE;
	var DAY = 24 * HOUR;

	/**
	 * 转换时间
	 * @param time
	 * @returns {{milliseconds: number, total, hours: number, seconds: number, minutes: number, days: number}}
	 */
	function parseTime(time) {
		var days = Math.floor(time / DAY);
		var hours = Math.floor((time % DAY) / HOUR);
		var minutes = Math.floor((time % HOUR) / MINUTE);
		var seconds = Math.floor((time % MINUTE) / SECOND);
		var milliseconds = Math.floor(time % SECOND);

		return {
			total: time,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
			milliseconds: milliseconds
		};
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

	/**
	 * 快捷 toast
	 * @param msg
	 * @param location
	 * @param duration
	 * @returns {*}
	 * @constructor
	 */
	function Toast(msg, location, duration) {
		if (location === void 0) {
			location = "middle";
		}
		if (duration === void 0) {
			duration = 1500;
		}
		if (typeof msg === "string") {
			api.toast({
				msg: msg,
				location: location,
				duration: duration
			});
		} else {
			api.toast({
				msg: msg.message,
				location: msg.position,
				duration: msg.duration
			});
		}
	}

	Toast.loading = function(options) {
		if (
			Object.keys(options).find(function(k) {
				return ["message", "forbidClick", "position"].includes(k);
			})
		) {
			api.showProgress({
				title: "",
				text: options.message,
				modal: options.forbidClick,
				location: options.position
			});
		} else {
			api.showProgress(options);
		}
	};

	Toast.clear = api.hideProgress;

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

	var ACalendar = /*@__PURE__*/ (function(Component) {
		function ACalendar(props) {
			this.data = {
				selectDay: [],
				subTitle: ""
			};
		}

		if (Component) ACalendar.__proto__ = Component;
		ACalendar.prototype = Object.create(Component && Component.prototype);
		ACalendar.prototype.constructor = ACalendar;
		ACalendar.prototype.confirmBtnAble = function() {
			if (this.props.type === "range") {
				return this.data.selectDay.length === 2;
			}
			return this.selectDay.length > 0;
		};
		ACalendar.prototype.install = function() {
			var this$1 = this;

			syncModel.call(this);

			this.render = function(props) {
				var obj;

				var h = apivm.h;
				var now = new Date();

				if (!props.type) {
					props.type = "single";
				}

				if (!props["min-date"]) {
					props["min-date"] = new Date(
						dateFormat("Y/mm/dd 00:00:00", new Date(now.setMonth(now.getMonth())))
					);
				}

				if (!props["max-date"]) {
					props["max-date"] = new Date(
						new Date(props["min-date"]).setMonth(props["min-date"].getMonth() + 3)
					);
				}

				this$1.hideConfirmBtn = props["show-confirm"] === false;

				!this$1.data.subTitle &&
					(this$1.data.subTitle = dateFormat("Y-mm", props["min-date"]));

				this$1.monthDiff =
					(props["max-date"].getFullYear() - props["min-date"].getFullYear()) * 12 +
					(props["max-date"].getMonth() - props["min-date"].getMonth());

				var dayNames = ["日", "一", "二", "三", "四", "五", "六"];
				var renderHeader = h(
					"view",
					{
						class: "a-calendar__header",
						onClick: function(ev) {
							return ev.stopPropagation
								? ev.stopPropagation()
								: (ev.cancelBubble = true);
						}
					},

					props.title !== false &&
						h("text", {class: "a-calendar__title"}, props.title || "日期选择"),
					h("text", {class: "a-calendar__subtitle"}, this$1.data.subTitle),
					h(
						"view",
						{class: "a-calendar__weekdays"},
						dayNames.map(function(name) {
							return h("text", {class: "a-calendar__weekday"}, name);
						})
					)
				);

				var renderFooter = this$1.hideConfirmBtn
					? h("safe-area", {class: "a-calendar__footer"})
					: this$1.confirmBtnAble()
					? h(
							"safe-area",
							{
								class: "a-calendar__footer safe-area",
								onClick: function(_) {
									return this$1.onConfirm(_);
								}
							},
							h(
								"text",
								{class: "a-calendar__btn a-calendar__btn--able"},
								props["confirm-text"] || "确定"
							)
					  )
					: h(
							"safe-area",
							{
								class: "a-calendar__footer safe-area",
								onClick: function(ev) {
									return ev.stopPropagation
										? ev.stopPropagation()
										: (ev.cancelBubble = true);
								}
							},
							h(
								"text",
								{class: "a-calendar__btn  a-calendar__btn--disabled "},
								props["confirm-disabled-text"] || "确定"
							)
					  );

				return h(
					APopup,
					Object.assign(
						{},
						props,
						{class: "a-calendar " + (props.class || "")},
						{style: "" + props.style},
						{position: "bottom"},
						((obj = {}), (obj["$show"] = props.$show), obj),
						{closeable: true}
					),
					renderHeader,
					this$1.renderBody(),
					renderFooter
				);
			};
		};
		ACalendar.prototype.renderBody = function() {
			var this$1 = this;

			var h = apivm.h;

			var baseTime = this.props["min-date"].setDate(1);

			var offset = 0;

			this.monthList = Array.from({length: this.monthDiff + 1}).map(function(
				_,
				index
			) {
				var month = new Date(
					new Date(baseTime).setMonth(this$1.props["min-date"].getMonth() + index)
				);
				var dayOffset = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
				var dayNumber = new Date(
					month.getFullYear(),
					month.getMonth() + 1,
					0
				).getDate();
				var height = Math.ceil((dayOffset + dayNumber) / 7) * 64; // 64 是单元格的高度
				var heightOffset = (offset += height);
				return {
					month: month,
					dayOffset: dayOffset,
					dayNumber: dayNumber,
					heightOffset: heightOffset,
					height: height
				};
			});

			return h.apply(
				void 0,
				[
					"scroll-view",
					{
						class: "a-calendar__body",
						scroll: "y",
						scrollY: true,
						"scroll-y": true,
						onScroll: function(ref) {
							var scrollTop = ref.detail.scrollTop;
							if (scrollTop === void 0) scrollTop = 0;

							var currentIndex = 0;
							for (var i = 0; i < this$1.monthList.length; i++) {
								if (scrollTop >= this$1.monthList[i].heightOffset) {
									currentIndex = i + 1;
								}
							}
							this$1.data.subTitle = dateFormat(
								"Y-mm",
								this$1.monthList[currentIndex].month
							);
						}
					}
				].concat(
					this.monthList.map(function(monthInfo) {
						return h(
							"view",
							{class: "a-calendar__month"},
							h(
								"text",
								{
									class: "a-calendar__month-mark",
									style:
										"height:" +
										monthInfo.height +
										"px;line-height:" +
										monthInfo.height +
										"px;"
								},
								monthInfo.month.getMonth() + 1
							),
							this$1.renderDays(monthInfo)
						);
					})
				)
			);
		};
		ACalendar.prototype.renderDays = function(monthInfo) {
			var this$1 = this;

			var h = apivm.h;
			return h.apply(
				void 0,
				["view", {class: "a-calendar__days"}].concat(
					Array.from({length: monthInfo.dayNumber}).map(function(_, index) {
						var date = new Date(
							monthInfo.month.getFullYear(),
							monthInfo.month.getMonth(),
							index + 1
						);

						var day = this$1.getDayInfo(date);

						return h(
							"view",
							{
								class: "a-calendar__day  a-calendar__day--" + day.type,
								style: index
									? ""
									: "margin-left:" + monthInfo.dayOffset * 14.285 + "%;",
								onClick: function(_) {
									return this$1.handleDateCellClick(day, _);
								}
							},

							day.topInfo &&
								h(
									"text",
									{class: "a-calendar__top-info a-calendar__top-info--" + day.type},
									day.topInfo
								),
							h(
								"text",
								{class: "a-calendar__day-num  a-calendar__day-num--" + day.type},
								day.text || day.date.getDate()
							),
							day.bottomInfo &&
								h(
									"text",
									{
										class: "a-calendar__bottom-info a-calendar__bottom-info--" + day.type
									},
									day.bottomInfo
								)
						);
					})
				)
			);
		};
		ACalendar.prototype.handleDateCellClick = function(day, ev) {
			ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);

			if (day.type === "disabled") {
				// console.log('该日期被禁用', day);
				return false;
			}

			this.fire("select", day);

			if (this.props.type === "single") {
				// 单选逻辑
				this.data.selectDay = [day.format];

				if (this.hideConfirmBtn) {
					this.onConfirm(ev);
				}
			} else if (this.props.type === "range") {
				//范围逻辑
				if (this.data.selectDay.length < 2) {
					var later = compareDay(
						new Date(day.format),
						new Date(this.data.selectDay[0])
					);
					if (later > 0) {
						if (this.props["max-range"] && later >= this.props["max-range"]) {
							Toast(
								this.props["range-prompt"]
									? this.props["range-prompt"].replace("$", later)
									: "选择天数不能超过 " + this.props["max-range"] + " 天"
							);
						} else {
							this.data.selectDay.push(day.format);
							if (this.hideConfirmBtn) {
								this.onConfirm(ev);
							}
						}
					} else {
						this.data.selectDay = [day.format];
					}
				} else {
					this.data.selectDay = [day.format];
				}
			} else {
				//其他多选
				var findIndex = this.data.selectDay.indexOf(day.format);
				if (findIndex === -1) {
					this.data.selectDay.push(day.format);
				} else {
					this.data.selectDay.splice(findIndex, 1);
				}
			}
		};
		ACalendar.prototype.onConfirm = function(ev) {
			ev.stopPropagation ? ev.stopPropagation() : (ev.cancelBubble = true);
			var result =
				this.props.type === "single" ? this.data.selectDay[0] : this.data.selectDay;
			this.$model.show = false;
			this.fire("confirm", result);
			this.$model["default-date"] = result;
		};
		ACalendar.prototype.getDayInfo = function(date) {
			var day = {date: date, format: dateFormat("Y-mm-dd", date)};
			day.type = "normal";
			if (date >= this.props["min-date"] && date <= this.props["max-date"]) {
				var findIndex = this.data.selectDay.indexOf(day.format);
				if (this.props.type === "range") {
					if (findIndex === 0) {
						day.type = "start";
						day.bottomInfo = "开始";
					} else if (findIndex === 1) {
						day.type = "end";
						day.bottomInfo = "结束";
					} else if (
						this.data.selectDay.length === 2 &&
						date > new Date(this.data.selectDay[0]) &&
						date < new Date(this.data.selectDay[1])
					) {
						day.type = "middle";
					}
				} else if (findIndex >= 0) {
					day.type = "selected";
				}
			} else {
				day.type = "disabled";
			}

			return typeof this.props.formatter === "function"
				? this.props.formatter(day)
				: day;
		};
		ACalendar.prototype.render = function() {
			return;
		};

		return ACalendar;
	})(Component);
	ACalendar.css = {
		".a-calendar": {},
		".a-calendar__header": {borderBottom: "2px solid #eee", flexShrink: "0"},
		".a-calendar__title": {
			fontSize: "16px",
			height: "44px",
			fontWeight: "500",
			lineHeight: "44px",
			textAlign: "center"
		},
		".a-calendar__subtitle": {
			fontSize: "14px",
			height: "44px",
			fontWeight: "500",
			lineHeight: "44px",
			textAlign: "center"
		},
		".a-calendar__weekdays": {flexFlow: "row nowrap"},
		".a-calendar__weekday": {
			flex: "1",
			fontSize: "12px",
			height: "30px",
			lineHeight: "30px",
			textAlign: "center"
		},
		".a-calendar__body": {flex: "1", overflowY: "scroll"},
		".a-calendar__month": {position: "relative"},
		".a-calendar__month-mark": {
			position: "absolute",
			color: "rgba(242, 243, 245, 0.8)",
			fontSize: "160px",
			fontWeight: "bold",
			pointerEvents: "none",
			width: "100%",
			textAlign: "center",
			justifyContent: "center",
			display: "flex",
			alignItems: "center",
			fontFamily: "monospace"
		},
		".a-calendar__days": {flexFlow: "row wrap"},
		".a-calendar__day": {
			width: "14.285%",
			height: "64px",
			fontSize: "16px",
			cursor: "pointer",
			justifyContent: "center",
			alignItems: "center"
		},
		".a-calendar__day--normal": {
			backgroundColor: "transparent",
			borderRadius: "0"
		},
		".a-calendar__day--selected, .a-calendar__day--start, .a-calendar__day--end": {
			backgroundColor: "#ee0a24",
			borderRadius: "4px"
		},
		".a-calendar__day-num--normal, .a-calendar__top-info--normal, .a-calendar__bottom-info--normal": {
			color: "#323233"
		},
		".a-calendar__day-num--selected, .a-calendar__day-num--start, .a-calendar__day-num--end,\n.a-calendar__bottom-info--selected, .a-calendar__bottom-info--start, .a-calendar__bottom-info--end,\n.a-calendar__top-info--selected, .a-calendar__top-info--start, .a-calendar__top-info--end": {
			color: "#FFF"
		},
		".a-calendar__day--middle": {background: "rgba(238, 10, 36, 0.1)"},
		".a-calendar__day-num--middle": {color: "#ee0a24"},
		".a-calendar__footer": {
			WebkitFlexShrink: "0",
			flexShrink: "0",
			padding: "0 16px",
			paddingBottom: [
				"constant(safe-area-inset-bottom)",
				"env(safe-area-inset-bottom)"
			]
		},
		".a-calendar__btn": {
			color: "#fff",
			backgroundColor: "#ee0a24",
			border: "1px solid #ee0a24",
			height: "36px",
			margin: "8px",
			borderRadius: "18px",
			lineHeight: "36px",
			textAlign: "center",
			boxSizing: "border-box",
			fontSize: "14px"
		},
		".a-calendar__btn--able": {opacity: "1"},
		".a-calendar__btn--disabled": {opacity: "0.5"},
		".a-calendar__top-info, .a-calendar__bottom-info": {
			fontSize: "10px",
			lineHeight: "14px"
		},
		".a-calendar--disabled": {opacity: "0.2"}
	};
	apivm.define("a-calendar", ACalendar);

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

	var ACountDown = /*@__PURE__*/ (function(Component) {
		function ACountDown(props) {
			this.data = {
				time: 0
			};
			this.compute = {
				timeStr: function() {
					var format = this.props.format || "HH:mm:ss";
					return parseFormat(format, this.timeData);
				},
				timeData: function() {
					return parseTime(this.data.time);
				}
			};
		}

		if (Component) ACountDown.__proto__ = Component;
		ACountDown.prototype = Object.create(Component && Component.prototype);
		ACountDown.prototype.constructor = ACountDown;
		ACountDown.prototype.install = function() {
			var this$1 = this;
			this.render = function(props) {
				var h = apivm.h;
				return slotSupport(
					h(
						"view",
						{
							class: "a-count-down " + (props.class || ""),
							style: "" + (props.style || ""),
							_slot: "default"
						},
						h("text", {class: "a-count-down__text"}, this$1.timeStr)
					),
					props.children,
					this$1
				);
			};
		};
		ACountDown.prototype.installed = function() {
			this.data.time = this.props.time || 0;
			if (this.props["auto-start"] !== false) {
				this.start();
			}
		};
		ACountDown.prototype.start = function() {
			var this$1 = this;

			if (this.timer || this.data.time === 0) {
				return;
			}
			var step = this.props.millisecond ? 1 : 1000;

			var _run = function() {
				this$1.data.time -= step;
				if (this$1.data.time) {
					this$1.timer = setTimeout(_run, step);
					this$1.fire("change", this$1.timeData);
				} else {
					this$1.pause();
					this$1.fire("finish");
				}
			};

			_run();
		};
		ACountDown.prototype.pause = function() {
			clearTimeout(this.timer);
			this.timer = false;
		};
		ACountDown.prototype.reset = function() {
			this.pause();
			this.data.time = this.props.time || 0;
		};
		ACountDown.prototype.render = function() {
			return;
		};

		return ACountDown;
	})(Component);
	ACountDown.css = {".a-count-down": {flexFlow: "row nowrap"}};
	apivm.define("a-count-down", ACountDown);

	var ADivider = /*@__PURE__*/ (function(Component) {
		function ADivider(props) {
			this.compute = {
				boxClass: function() {
					return "a-divider " + (this.props.class || "");
				},
				lineStyle: function() {
					return this.props["line-color"]
						? "border-top-color:" + this.props["line-color"] + ";"
						: "";
				},
				textStyle: function() {
					return this.props.color ? "color:" + this.props.color + ";" : "";
				}
			};
		}

		if (Component) ADivider.__proto__ = Component;
		ADivider.prototype = Object.create(Component && Component.prototype);
		ADivider.prototype.constructor = ADivider;
		ADivider.prototype.lineClass = function(position) {
			var width =
				this.props["content-position"] == position
					? "a-divider_line-width"
					: "a-divider_line-flex";
			var style = this.props.dashed
				? "a-divider_line-dashed"
				: "a-divider_line-solid";
			return "a-divider_line " + width + " " + style;
		};
		ADivider.prototype.render = function() {
			return this.props.content
				? apivm.h(
						"view",
						{class: this.boxClass, style: this.props.style || ""},
						apivm.h("view", {class: this.lineClass("left"), style: this.lineStyle}),
						apivm.h(
							"text",
							{class: "a-divider_text", style: this.textStyle},
							this.props.content
						),
						apivm.h("view", {class: this.lineClass("right"), style: this.lineStyle})
				  )
				: apivm.h(
						"view",
						{class: this.boxClass, style: this.props.style || ""},
						apivm.h("view", {class: this.lineClass("center"), style: this.lineStyle})
				  );
		};

		return ADivider;
	})(Component);
	ADivider.css = {
		".a-divider": {flexDirection: "row", alignItems: "center"},
		".a-divider_line": {borderTopWidth: "1px", borderTopColor: "#ebedf0"},
		".a-divider_line-solid": {borderTopStyle: "solid"},
		".a-divider_line-dashed": {borderTopStyle: "dashed"},
		".a-divider_line-width": {width: "10%"},
		".a-divider_line-flex": {flex: "1"},
		".a-divider_text": {fontSize: "14px", color: "#969799", padding: "0 16px"}
	};
	apivm.define("a-divider", ADivider);

	var AEmpty = /*@__PURE__*/ (function(Component) {
		function AEmpty(props) {}

		if (Component) AEmpty.__proto__ = Component;
		AEmpty.prototype = Object.create(Component && Component.prototype);
		AEmpty.prototype.constructor = AEmpty;
		AEmpty.prototype.install = function() {
			var this$1 = this;

			this.render = function(props) {
				var h = apivm.h;

				if (!props.image) {
					props.image = "default";
				}

				if (!props.image.includes("/")) {
					props.image = this$1.asset("empty-image-" + (props.image || "") + ".png");
				}

				var imgAttr = {class: "a-empty__image", src: props.image};

				if (props["image-size"]) {
					imgAttr.style =
						"width:" +
						props["image-size"] +
						"px;height:" +
						props["image-size"] +
						"px;";
				} else {
					imgAttr.class += " a-empty__image--default-size";
				}

				return h(
					"view",
					{class: "a-empty " + (props.class || ""), style: props.style + "||''"},
					h("img", imgAttr),
					h("text", {class: "a-empty__description"}, props.description),
					h("view", {class: "a-empty__bottom"}, props.children)
				);
			};
		};
		AEmpty.prototype.asset = function(name) {
			return "../../image/act/" + name;
		};
		AEmpty.prototype.render = function() {
			return;
		};

		return AEmpty;
	})(Component);
	AEmpty.css = {
		".a-empty": {
			display: "flex",
			WebkitBoxOrient: "vertical",
			WebkitBoxDirection: "normal",
			WebkitFlexDirection: "column",
			flexDirection: "column",
			WebkitBoxAlign: "center",
			WebkitAlignItems: "center",
			alignItems: "center",
			WebkitBoxPack: "center",
			WebkitJustifyContent: "center",
			justifyContent: "center",
			boxSizing: "border-box",
			padding: "32px 0"
		},
		".a-empty__image": {},
		".a-empty__image--default-size": {width: "160px", height: "160px"},
		".a-empty__description": {
			marginTop: "16px",
			padding: "0 60px",
			color: "#969799",
			fontSize: "14px",
			lineHeight: "20px",
			textAlign: "center"
		},
		".a-empty__bottom": {marginTop: "24px"}
	};
	apivm.define("a-empty", AEmpty);

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

	global.markFirstSlotChild = function markFirstSlotChild(children, namespace) {
		if (namespace === void 0) namespace = "";

		children.map(function(VNode) {
			if (VNode.attributes && VNode.attributes._slot) {
				var className = namespace + "__" + VNode.attributes._slot + "--first";
				VNode.children.map(function(child, index) {
					if (index === 0) {
						if (child.attributes.class) {
							child.attributes.class += className;
						} else {
							child.attributes.class = className;
						}
					}
				});
			}
		});

		return children;
	};
	var AGoodsCard = /*@__PURE__*/ (function(Component) {
		function AGoodsCard(props) {}

		if (Component) AGoodsCard.__proto__ = Component;
		AGoodsCard.prototype = Object.create(Component && Component.prototype);
		AGoodsCard.prototype.constructor = AGoodsCard;
		AGoodsCard.prototype.install = function() {
			var this$1 = this;

			this.render = function(props) {
				var h = apivm.h;

				if (!props.currency) {
					props.currency = "¥";
				}

				var price = Number(props.price || 0)
					.toFixed(2)
					.split(".");
				var priceNode = h(
					"view",
					{class: "a-goods-card__price"},
					h("text", {class: "a-goods-card__price-text"}, props.currency),
					h("text", {class: "a-goods-card__price-integer"}, price[0]),
					h("text", {class: "a-goods-card__price-text"}, "." + price[1])
				);

				return slotSupport(
					h(
						"view",
						Object.assign({}, props, {
							class: "a-goods-card " + (props.class || ""),
							style: "" + (props.style || "")
						}),

						h(
							"view",
							{class: "a-goods-card__header"},
							h(
								"view",
								{
									class: "a-goods-card__thumb",
									onClick: function(_) {
										return this$1.fire("click-thumb", _);
									}
								},
								h("img", {class: "a-goods-card__thumb-img", src: props.thumb}),
								props.tag &&
									h(
										"view",
										{class: "a-goods-card__tag"},
										h(ATag, {mark: true, type: "danger"}, props.tag)
									)
							),

							h(
								"view",
								{class: "a-goods-card__content"},
								h(
									"view",
									{},
									h("text", {class: "a-goods-card__title"}, props.title),
									h("text", {class: "a-goods-card__desc"}, props.desc)
								),

								h("view", {_slot: "tags", class: "a-goods-card__tags"}),
								h(
									"view",
									{class: "a-goods-card__bottom"},
									priceNode,
									props["origin-price"] &&
										h(
											"text",
											{class: "a-goods-card__origin-price"},
											"" + props.currency + props["origin-price"]
										),
									h("text", {class: "a-goods-card__num"}, "×" + props.num)
								)
							)
						),

						h("view", {class: "a-goods-card__footer", _slot: "footer"})
					),
					markFirstSlotChild(props.children, "a-goods-card")
				);
			};
		};
		AGoodsCard.prototype.render = function() {
			return;
		};

		return AGoodsCard;
	})(Component);
	AGoodsCard.css = {
		".a-goods-card": {
			position: "relative",
			boxSizing: "border-box",
			padding: "8px 16px",
			color: "#323233",
			fontSize: "12px",
			backgroundColor: "#fafafa"
		},
		".a-goods-card__header": {flexFlow: "row nowrap"},
		".a-goods-card__thumb": {
			position: "relative",
			flexShrink: "0",
			width: "88px",
			height: "88px",
			marginRight: "8px"
		},
		".a-goods-card__thumb-img": {
			width: "100%",
			height: "100%",
			objectFit: "cover"
		},
		".a-goods-card__tag": {position: "absolute", top: "2px", left: "0"},
		".a-goods-card__content": {flex: "1", justifyContent: "space-between"},
		".a-goods-card__title": {
			maxHeight: "32px",
			fontWeight: "500",
			lineHeight: "16px"
		},
		".a-goods-card__desc": {
			maxHeight: "20px",
			color: "#646566",
			lineHeight: "20px"
		},
		".a-goods-card__bottom": {lineHeight: "20px", flexFlow: "row nowrap"},
		".a-goods-card__price": {lineHeight: "20px", flexFlow: "row nowrap"},
		".a-goods-card__price-text": {
			lineHeight: "20px",
			color: "#323233",
			fontWeight: "500",
			fontSize: "12px"
		},
		".a-goods-card__price-integer": {
			lineHeight: "20px",
			fontSize: "16px",
			fontFamily: "Avenir-Heavy, PingFang SC, Helvetica Neue, Arial, sans-serif"
		},
		".a-goods-card__num": {
			lineHeight: "20px",
			flex: "1",
			textAlign: "right",
			color: "#969799"
		},
		".a-goods-card__origin-price": {
			marginLeft: "5px",
			color: "#969799",
			fontSize: "10px",
			textDecoration: "line-through"
		},
		".a-goods-card__tags": {flexFlow: "row nowrap"},
		".a-goods-card__tags--first": {marginRight: "5px"},
		".a-goods-card__footer": {flexFlow: "row nowrap", justifyContent: "flex-end"},
		".a-goods-card__footer--first": {marginRight: "5px"}
	};
	apivm.define("a-goods-card", AGoodsCard);

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

	var ALink = /*@__PURE__*/ (function(Component) {
		function ALink(props) {}

		if (Component) ALink.__proto__ = Component;
		ALink.prototype = Object.create(Component && Component.prototype);
		ALink.prototype.constructor = ALink;
		ALink.prototype.install = function() {
			this.render = function(props) {
				var VNode = props.children[0];
				VNode.attributes.onClick = function(_) {
					return linkTo(props.to, props.title);
				};
				return props.children[0];
			};
		};
		ALink.prototype.render = function() {
			return;
		};

		return ALink;
	})(Component);
	apivm.define("a-link", ALink);

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

	var ARef = /*@__PURE__*/ (function(Component) {
		function ARef(props) {}

		if (Component) ARef.__proto__ = Component;
		ARef.prototype = Object.create(Component && Component.prototype);
		ARef.prototype.constructor = ARef;
		ARef.prototype.install = function() {
			this.render = function(props) {
				return props.children[0];
			};
		};
		ARef.prototype.installed = function() {
			var obj;

			if (this._host.$refs) {
				this._host.$refs[this.props.name] = this._child[0];
			} else {
				this._host.$refs =
					((obj = {}), (obj[this.props.name] = this._child[0]), obj);
			}
		};
		ARef.prototype.render = function() {
			return;
		};

		return ARef;
	})(Component);
	apivm.define("a-ref", ARef);

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

	var AStepper = /*@__PURE__*/ (function(Component) {
		function AStepper(props) {
			this.data = {
				value: this.reviseValue(this.props.value)
			};
			this.compute = {
				range: function() {
					return this.getRange(this.data.value);
				}
			};
		}

		if (Component) AStepper.__proto__ = Component;
		AStepper.prototype = Object.create(Component && Component.prototype);
		AStepper.prototype.constructor = AStepper;
		AStepper.prototype.install = function() {
			var this$1 = this;
			this.render = function(props) {
				var h = apivm.h;
				syncModel.call(this$1);
				if (this$1.$model.value) {
					this$1.data.value = this$1.reviseValue(this$1.$model.value);
				}
				var ref = this$1.range;
				var isMin = ref[0];
				var isMax = ref[1];
				return h(
					"view",
					{
						class: "a-stepper " + (props.class || ""),
						style: "" + (props.style || "")
					},
					h(
						"view",
						{
							class:
								"a-stepper__btn  a-stepper__minus" +
								(props.theme ? "--" + props.theme : "") +
								(isMin || props.disabled ? "--disabled" : ""),
							onClick: function(_) {
								return isMin || props.disabled ? {} : this$1.handleClick(-1, _);
							}
						},
						h(AIcon, {
							class: "a-stepper__icon",
							name: "minus",
							size: (props["button-size"] || 28) - 6,
							color: props.theme
								? "#FFF"
								: isMin || props.disabled
								? "#c8c9cc"
								: "#323233"
						})
					),
					h("input", {
						class: mixedClass(
							"a-stepper__input a-stepper__input--" +
								(props.theme ? props.theme : "normal"),
							{"a-stepper__input--disabled": props.disabled}
						),
						value: props["decimal-length"]
							? this$1.data.value.toFixed(Number(props["decimal-length"]))
							: this$1.data.value,
						onblur: this$1.handleBlur,
						"keyboard-type": props.integer ? "number" : "decimal",
						disabled: !!(props.disabled || props["disable-input"]),
						style:
							"width:" +
							(props["input-width"] || 32) +
							"px;height:" +
							(props["button-size"] || 28) +
							"px;"
					}),
					h(
						"view",
						{
							class:
								"a-stepper__btn a-stepper__plus" +
								(props.theme ? "--" + props.theme : "") +
								(isMax || props.disabled ? "--disabled" : ""),
							onClick: function(_) {
								return isMax || props.disabled ? {} : this$1.handleClick(1, _);
							}
						},
						h(AIcon, {
							class: "a-stepper__icon",
							name: "add",
							size: (props["button-size"] || 28) - 6,
							color: props.theme
								? "#FFF"
								: isMax || props.disabled
								? "#c8c9cc"
								: "#323233"
						})
					)
				);
			};
		};
		AStepper.prototype.handleClick = function(change, _) {
			change *= typeof this.props.step === "undefined" ? 1 : this.props.step;
			var value = this.data.value + change;
			this.handleValue(value, "click");
		};
		AStepper.prototype.handleValue = function(value, type) {
			var this$1 = this;

			var _run = function() {
				value = this$1.reviseValue(Number(value));
				this$1.$model.value = value;
				this$1.fire("change", {value: value, type: type});
				this$1.data.value = value;
			};

			if (this.props["before-change"]) {
				this.props["before-change"](value).then(function(_) {
					_ && _run();
				});
			} else {
				_run();
			}
		};
		AStepper.prototype.handleBlur = function(ref) {
			var value = ref.detail.value;

			this.handleValue(value, "blur");
		};
		AStepper.prototype.reviseValue = function(value) {
			var ref = this.getRange(value);
			var isMin = ref[0];
			var isMax = ref[1];
			if (isMin) {
				value = this.props.min;
			} else if (isMax) {
				value = this.props.max;
			}

			if (this.props.integer) {
				value = Math.trunc(value);
			}

			return Number(value);
		};
		AStepper.prototype.getRange = function(value) {
			value = Number(value);
			var props = this.props;
			if (!props || typeof props.min === "undefined") {
				this.props.min = 1;
			}
			if (!props || typeof props.max === "undefined") {
				this.props.max = Infinity;
			}
			return [value <= Number(props.min), value >= Number(props.max)];
		};
		AStepper.prototype.render = function() {
			return;
		};

		return AStepper;
	})(Component);
	AStepper.css = {
		".a-stepper": {flexFlow: "row nowrap"},
		".a-stepper__btn": {
			margin: "0",
			color: "#323233",
			verticalAlign: "middle",
			backgroundColor: "#f2f3f5",
			border: "0 #FFF",
			cursor: "pointer",
			textAlign: "center"
		},
		".a-stepper__plus--round, .a-stepper__minus--round": {
			borderRadius: "50%",
			backgroundColor: "#ee0a24"
		},
		".a-stepper__minus": {borderRadius: "4px 0 0 4px"},
		".a-stepper__plus": {borderRadius: "0 4px 4px 0"},
		".a-stepper__input": {
			boxSizing: "border-box",
			margin: "0 2px",
			padding: "0",
			color: "#323233",
			fontSize: "14px",
			lineHeight: "normal",
			textAlign: "center",
			verticalAlign: "middle",
			border: "0 #fff",
			borderRadius: "0",
			WebkitAppearance: "none"
		},
		".a-stepper__input--normal": {backgroundColor: "#f2f3f5"},
		".a-stepper__input--round": {backgroundColor: "transparent"},
		".a-stepper__input--disabled": {opacity: "0.5"},
		".a-stepper__minus--disabled, .a-stepper__plus--disabled": {
			backgroundColor: "#f7f8fa",
			cursor: "not-allowed"
		},
		".a-stepper__minus--round--disabled, .a-stepper__plus--round--disabled": {
			backgroundColor: "#fbd6d9",
			cursor: "not-allowed",
			borderRadius: "50%"
		},
		".a-stepper__icon": {margin: "3px"}
	};
	apivm.define("a-stepper", AStepper);

	function _defineProperty(obj, key, value) {
		if (key in obj) {
			Object.defineProperty(obj, key, {
				value: value,
				enumerable: true,
				configurable: true,
				writable: true
			});
		} else {
			obj[key] = value;
		}

		return obj;
	}

	function _inheritsLoose(subClass, superClass) {
		subClass.prototype = Object.create(superClass.prototype);
		subClass.prototype.constructor = subClass;

		_setPrototypeOf(subClass, superClass);
	}

	function _setPrototypeOf(o, p) {
		_setPrototypeOf =
			Object.setPrototypeOf ||
			function _setPrototypeOf(o, p) {
				o.__proto__ = p;
				return o;
			};

		return _setPrototypeOf(o, p);
	}

	function _assertThisInitialized(self) {
		if (self === void 0) {
			throw new ReferenceError(
				"this hasn't been initialised - super() hasn't been called"
			);
		}

		return self;
	}

	var ASwipeCell = /*#__PURE__*/ (function(_Component) {
		_inheritsLoose(ASwipeCell, _Component);
		function ASwipeCell() {
			var _this;
			for (
				var _len = arguments.length, args = new Array(_len), _key = 0;
				_key < _len;
				_key++
			) {
				args[_key] = arguments[_key];
			}
			_this = _Component.call.apply(_Component, [this].concat(args)) || this;
			_defineProperty(
				_assertThisInitialized(_this),
				"ns",

				"a-swipe-cell"
			);
			_defineProperty(_assertThisInitialized(_this), "preEvent", function() {});
			return _this;
		}
		var _proto = ASwipeCell.prototype;
		_proto.install = function install() {
			var _this2 = this;

			this[this.ns] = {
				slots: {},
				body: []
			};

			this.props.children.forEach(function(child) {
				if (child.nodeName === "template") {
					_this2[_this2.ns].slots[child.attributes._slot] = child;
				} else {
					console.log(child);
					_this2[_this2.ns].body.push(child);
				}
			});

			console.log(this);
		};
		_proto.render = function render(props) {
			return apivm.h(
				"view",
				{className: this.ns},
				this[this.ns].slots.left &&
					apivm.h(
						"view",
						{class: this.ns + "__left"},
						this[this.ns].slots.left.children
					),

				apivm.h(
					"view",
					{
						class: this.ns + "__body",
						ontouchmove: this.ontouchmove,
						onclick: this.preEvent
					},
					this[this.ns].body
				),

				this[this.ns].slots.right &&
					apivm.h(
						"view",
						{className: this.ns + "__right"},
						this[this.ns].slots.right.children
					)
			);
		};
		_proto.ontouchmove = function ontouchmove(e) {
			console.log(e);
		};
		return ASwipeCell;
	})(Component);

	var SimpleCalendar = /*@__PURE__*/ (function(Component) {
		function SimpleCalendar(props) {
			this.data = {
				value: Array.from({length: 11}).fill(""),
				show: Array.from({length: 11}).fill(false),
				show1: true
			};
		}

		if (Component) SimpleCalendar.__proto__ = Component;
		SimpleCalendar.prototype = Object.create(Component && Component.prototype);
		SimpleCalendar.prototype.constructor = SimpleCalendar;
		SimpleCalendar.prototype.choose = function(index) {
			this.data.show[index] = true;
		};
		SimpleCalendar.prototype.myConfirm = function(ref) {
			var detail = ref.detail;

			this.data.value[0] = detail;
			Toast("onConfirm: " + detail);
		};
		SimpleCalendar.prototype.myConfirm2 = function(ref) {
			var detail = ref.detail;

			this.data.value[2] = "选择了" + detail.length + "个日期";
			Toast("onConfirm: 选择了" + detail.length + "个日期");
		};
		SimpleCalendar.prototype.myConfirm3 = function(ref) {
			var detail = ref.detail;

			this.data.value[3] = detail[0] + " - " + detail[1];
			Toast("onConfirm: " + detail[0] + " - " + detail[1]);
		};
		SimpleCalendar.prototype.myConfirm5 = function(ref) {
			var detail = ref.detail;

			this.data.value[5] = detail[0] + " - " + detail[1];
			Toast("onConfirm: " + detail[0] + " - " + detail[1]);
		};
		SimpleCalendar.prototype.myConfirm9 = function(ref) {
			var detail = ref.detail;

			this.data.value[9] = detail[0] + " - " + detail[1];
			Toast("onConfirm: " + detail[0] + " - " + detail[1]);
		};
		SimpleCalendar.prototype.myConfirm10 = function(ref) {
			var detail = ref.detail;

			this.data.value[10] = detail[0] + " - " + detail[1];
			Toast("onConfirm: " + detail[0] + " - " + detail[1]);
		};
		SimpleCalendar.prototype.formatter = function(day) {
			var month = day.date.getMonth() + 1;
			var date = day.date.getDate();

			if (month === 5) {
				if (date === 1) {
					day.topInfo = "劳动节";
				} else if (date === 4) {
					day.topInfo = "青年节";
				} else if (date === 11) {
					day.text = "今天";
				}
			}

			if (day.type === "start") {
				day.bottomInfo = "入住";
			} else if (day.type === "end") {
				day.bottomInfo = "离店";
			}

			return day;
		};
		SimpleCalendar.prototype.myClose = function(e) {
			console.log("myClose", JSON.stringify(e));
		};
		SimpleCalendar.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-calendar", "left-arrow": true}),
				apivm.h(
					"scroll-view",
					{style: "flex: 1;", "scroll-y": true},

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "选择单个日期"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"下面演示了结合单元格来使用日历组件的用法，日期选择完成后会触发 confirm 事件。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(0);
								},
								title: "选择单个日期",
								value: this.data.value[0]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "双向绑定"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"下面演示了使用 $default-date 来做双向绑定，自动接管数据变化绑定。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(1);
								},
								title: "选择单个日期",
								value: this.data.value[1]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "选择多个日期"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 type 为 multiple 后可以选择多个日期，此时 confirm 事件返回的 date 为数组结构，数组包含若干个选中的日期。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(2);
								},
								title: "选择多个日期",
								value: this.data.value[2]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "选择日期区间"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"设置 type 为 range 后可以选择日期区间，此时 confirm 事件返回的 date 为数组结构，数组第一项为开始时间，第二项为结束时间。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(3);
								},
								title: "选择日期区间",
								value: this.data.value[3]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "快捷选择"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"将 show-confirm 设置为 false 可以隐藏确认按钮，这种情况下选择完成后会立即触发 confirm 事件。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(4);
								},
								title: "快捷选择",
								value: this.data.value[4]
							}),
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(5);
								},
								title: "快捷选择范围",
								value: this.data.value[5]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple todo"},
						apivm.h("text", {class: "simple-title"}, "自定义颜色"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 color 属性可以自定义日历的颜色，对选中日期和底部按钮生效。"
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义日期范围"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 min-date 和 max-date 定义日历的范围。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(7);
								},
								title: "自定义日期范围",
								value: this.data.value[7]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义按钮文字"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 confirm-text 设置按钮文字，通过 confirm-disabled-text 设置按钮禁用时的文字。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(8);
								},
								title: "自定义按钮文字",
								value: this.data.value[8]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义日期文案"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过传入 formatter 函数来对日历上每一格的内容进行格式化。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(9);
								},
								title: "自定义日期文案",
								value: this.data.value[9]
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "日期区间最大范围"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"选择日期区间时，可以通过 max-range 属性来指定最多可选天数，选择的范围超过最多可选天数时，会弹出相应的提示文案。"
						),
						apivm.h(
							"a-cell-group",
							{round: true},
							apivm.h("a-cell", {
								"is-link": true,
								onClick: function() {
									return this$1.choose(10);
								},
								title: "日期区间最大范围",
								value: this.data.value[10]
							})
						)
					)
				),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[0]",
					onConfirm: this.myConfirm,
					onClose: this.myClose
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[1]",
					"$default-date": "value[1]"
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[2]",
					onConfirm: this.myConfirm2,
					type: "multiple"
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[3]",
					onConfirm: this.myConfirm3,
					type: "range"
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[4]",
					"show-confirm": false,
					"$default-date": "value[4]"
				}),
				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[5]",
					"show-confirm": false,
					type: "range",
					onConfirm: this.myConfirm5
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[7]",
					"$default-date": "value[7]",
					"min-date": new Date("2009/12/15"),
					"max-date": new Date("2010/3/9")
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[8]",
					type: "range",
					"$default-date": "value[8]",
					"confirm-text": "完成",
					"confirm-disabled-text": "请选择结束时间"
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[9]",
					formatter: this.formatter,
					type: "range",
					onConfirm: this.myConfirm9,
					"min-date": new Date("2021/5/1"),
					"max-date": new Date("2021/6/25")
				}),

				apivm.h("a-calendar", {
					style: "height: 500px;",
					$show: "show[10]",
					onConfirm: this.myConfirm10,
					type: "range",
					"max-range": 5
				})
			);
		};

		return SimpleCalendar;
	})(Component);
	SimpleCalendar.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".demo-calendar": {
			margin: "12px 12px 0",
			overflow: "hidden",
			borderRadius: "8px"
		},
		".todo": {background: "#f1e9d5"}
	};
	apivm.define("simple-calendar", SimpleCalendar);
})();
