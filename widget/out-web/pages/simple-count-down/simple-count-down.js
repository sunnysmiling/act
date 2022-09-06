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

	var SimpleCountDown = /*@__PURE__*/ (function(Component) {
		function SimpleCountDown(props) {
			this.data = {
				time: Array.from({length: 5}).fill(30 * 60 * 60 * 1000)
			};
		}

		if (Component) SimpleCountDown.__proto__ = Component;
		SimpleCountDown.prototype = Object.create(Component && Component.prototype);
		SimpleCountDown.prototype.constructor = SimpleCountDown;
		SimpleCountDown.prototype.onFinish = function() {
			Toast("倒计时结束");
		};
		SimpleCountDown.prototype.start = function() {
			this.$refs.countDown.start();
		};
		SimpleCountDown.prototype.pause = function() {
			this.$refs.countDown.pause();
		};
		SimpleCountDown.prototype.reset = function() {
			this.$refs.countDown.reset();
		};
		SimpleCountDown.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-count-down", "left-arrow": true}),
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
							"time 属性表示倒计时总时长，单位为毫秒。"
						),
						apivm.h(
							"view",
							{class: "demo-row"},
							apivm.h("a-count-down", {time: this.data.time[0]})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义格式"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"time 属性表示倒计时总时长，单位为毫秒。"
						),

						apivm.h(
							"view",
							{class: "demo-row"},
							apivm.h("a-count-down", {
								time: this.data.time[1],
								format: "DD 天 HH 时 mm 分 ss 秒"
							})
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义样式"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过插槽自定义倒计时的样式，timeData 对象格式见下方表格。"
						),

						apivm.h(
							"view",
							{class: "demo-row"},
							apivm.h(
								"a-count-down",
								{time: this.data.time[3]},
								apivm.h(
									"template",
									{_slot: "default:timeData"},
									apivm.h("text", {class: "block"}, "[[timeData.hours]]"),
									apivm.h("text", {class: "colon"}, ":"),
									apivm.h("text", {class: "block"}, "[[timeData.minutes]]"),
									apivm.h("text", {class: "colon"}, ":"),
									apivm.h("text", {class: "block"}, "[[timeData.seconds]]")
								)
							)
						)
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "手动控制"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 ref 获取到组件实例后，可以调用 start、pause、reset 方法。"
						),

						apivm.h(
							"view",
							{class: "demo-row"},
							apivm.h(
								"a-ref",
								{name: "countDown"},
								apivm.h("a-count-down", {
									ref: "countDown",
									time: 3000,
									millisecond: true,
									"auto-start": false,
									format: "ss:SSS",
									onFinish: this.onFinish
								})
							)
						),

						apivm.h(
							"a-grid",
							{"column-num": "3", style: "margin-top: 10px;", gutter: "10"},
							apivm.h("a-grid-item", {
								text: "开始",
								icon: "play-circle",
								onClick: this.start
							}),
							apivm.h("a-grid-item", {
								text: "暂停",
								icon: "pause-circle",
								onClick: this.pause
							}),
							apivm.h("a-grid-item", {
								text: "重置",
								icon: "refresh",
								onClick: this.reset
							})
						)
					)
				)
			);
		};

		return SimpleCountDown;
	})(Component);
	SimpleCountDown.css = {
		".page": {height: "100%", flex: "1", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"},
		".todo": {background: "#f1e9d5"},
		".demo-row": {padding: "0 20px"},
		".colon": {
			display: "inline-block",
			margin: "0 4px",
			color: "#ee0a24",
			lineHeight: "22px"
		},
		".block": {
			display: "inline-block",
			width: "22px",
			color: "#fff",
			fontSize: "12px",
			textAlign: "center",
			backgroundColor: "#ee0a24",
			lineHeight: "22px",
			height: "22px",
			borderRadius: "4px"
		}
	};
	apivm.define("simple-count-down", SimpleCountDown);
})();
