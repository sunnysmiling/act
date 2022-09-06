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

	var APullRefresh = /*@__PURE__*/ (function(Component) {
		function APullRefresh(props) {
			this.data = {
				status: "normal",
				refreshState: "normal",
				distance: 0,
				showSuccess: false,
				loadingImg: "https://docs.apicloud.com/act/img/loading.gif",
				desc: {
					pullingText: "下拉即可刷新...",
					loosingText: "释放即可刷新...",
					loadingText: "加载中..."
				}
			};
			this.compute = {
				headHeight: function() {
					return this.props["head-height"] || 50;
				},
				shouldLoading: function() {
					var this$1 = this;

					if (this.$model && this.$model.refreshing) {
						return true;
					}
					if (this.data.refreshState == "refreshing" && this.props["success-text"]) {
						this.data.showSuccess = true;
						var duration = this.props["success-duration"];
						setTimeout(function() {
							this$1.data.refreshState = "normal";
							this$1.data.showSuccess = false;
						}, (duration && parseInt(duration)) || 500);
						return true;
					}
					return false;
				},
				refreshStateDesc: function() {
					var refreshState = this.data.refreshState;
					if (refreshState == "normal") {
						if (this.data.distance == 0) {
							return "";
						}
						return this.props["pulling-text"] || this.data.desc.pullingText;
					} else if (refreshState == "dragging") {
						return this.props["loosing-text"] || this.data.desc.loosingText;
					} else if (refreshState == "refreshing") {
						if (this.data.showSuccess) {
							return this.props["success-text"] || "";
						}
						return this.props["loading-text"] || this.data.desc.loadingText;
					}
				},
				status: function() {
					var refreshState = this.data.refreshState;
					if (refreshState == "normal") {
						if (this.data.distance == 0) {
							return "normal";
						}
						return "pulling";
					} else if (refreshState == "dragging") {
						return "loosing";
					} else if (refreshState == "refreshing") {
						if (this.data.showSuccess) {
							return "success";
						}
						return "loading";
					}
				}
			};
		}

		if (Component) APullRefresh.__proto__ = Component;
		APullRefresh.prototype = Object.create(Component && Component.prototype);
		APullRefresh.prototype.constructor = APullRefresh;
		APullRefresh.prototype.onStateChange = function(e) {
			var state = e.detail.state;
			if (state == "refreshing") {
				this.$model.refreshing = true;
				this.data.refreshState = state;
				this.fire("refresh", {});
				return;
			}
			this.data.refreshState = state;
		};
		APullRefresh.prototype.onPulling = function(e) {
			this.data.distance = e.detail.distance;
			this.fire("pulling", e.detail);
		};
		APullRefresh.prototype.beforeRender = function() {
			if (!this.$model) {
				syncModel.call(this);
			}
		};
		APullRefresh.prototype.render = function() {
			return slotSupport(
				apivm.h(
					"refresh",
					{
						class: this.props.class || "",
						style: "height:" + this.headHeight + "px;" + (this.props.style || ""),
						threshold: this.props["pull-distance"] || this.headHeight,
						state: this.shouldLoading ? "refreshing" : "normal",
						onStatechange: this.onStateChange,
						onPulling: this.onPulling
					},
					apivm.h(
						"view",
						{
							class: "a-pull-refresh-head",
							style: "height:" + this.headHeight + "px;"
						},
						apivm.h("view", {_slot: this.status}),
						!haveSlot(this.status, this.props)
							? apivm.h(
									"view",
									{class: "a-pull-refresh-head-default"},
									this.$model.refreshing
										? apivm.h("image", {
												class: "a-pull-refresh-loading-img",
												src: this.data.loadingImg
										  })
										: null,
									apivm.h("text", {class: "a-pull-refresh-text"}, this.refreshStateDesc)
							  )
							: null
					)
				),
				this.props.children
			);
		};

		return APullRefresh;
	})(Component);
	APullRefresh.css = {
		".a-pull-refresh-head": {
			position: "absolute",
			left: "0",
			bottom: "0",
			width: "100%",
			height: "50px",
			overflow: "hidden",
			userSelect: "none"
		},
		".a-pull-refresh-head-default": {
			flexDirection: "row",
			alignItems: "center",
			margin: "auto"
		},
		".a-pull-refresh-text": {color: "#969799", fontSize: "14px"},
		".a-pull-refresh-loading-img": {
			width: "16px",
			height: "16px",
			marginRight: "12px"
		}
	};
	apivm.define("a-pull-refresh", APullRefresh);

	var ATab = /*@__PURE__*/ (function(Component) {
		function ATab(props) {}

		if (Component) ATab.__proto__ = Component;
		ATab.prototype = Object.create(Component && Component.prototype);
		ATab.prototype.constructor = ATab;
		ATab.prototype.install = function() {
			this.render = function(props) {
				return props.children;
			};
		};
		ATab.prototype.render = function() {
			return;
		};

		return ATab;
	})(Component);
	apivm.define("a-tab", ATab);

	var ATabs = /*@__PURE__*/ (function(Component) {
		function ATabs(props) {
			this.data = {
				// current: 0
			};
		}

		if (Component) ATabs.__proto__ = Component;
		ATabs.prototype = Object.create(Component && Component.prototype);
		ATabs.prototype.constructor = ATabs;
		ATabs.prototype.install = function() {
			var this$1 = this;

			var ns = "a-tabs";
			syncModel.call(this);
			this.breakpoint = this.props.breakpoint || 5;

			var isScroll = this.props.children.length > this.breakpoint;
			var scrollCls = function(pos) {
				return ns + "__" + pos + "--" + (isScroll ? "scroll" : "flat");
			};
			this.render = function(props) {
				this$1.current = this$1.$model.active || 0;
				var h = apivm.h;
				var type = props.type;
				if (type === void 0) type = "line";
				return h(
					"view",
					{
						class: ns + " " + ns + "--" + type + " " + (props.class || ""),
						style: props.style
					},
					h(
						isScroll ? "scroll-view" : "view",
						{
							class:
								ns + "__wrap  " + ns + "__wrap--" + type + " " + scrollCls("wrap"),
							"scroll-x": true,
							"scroll-y": false
						},

						props.children.map(function(child, index) {
							var navProps = {
								class:
									ns +
									"__nav " +
									scrollCls("nav") +
									"  " +
									ns +
									"__nav--" +
									type +
									" " +
									ns +
									"__nav--" +
									type +
									"--" +
									(index === props.children.length - 1 ? "last" : "not-last") +
									" " +
									(parseInt(this$1.current) === index
										? ns + "__nav--active--" + type
										: ns + "__nav--normal--" + type),
								onclick: this$1.onclick.bind(this$1, index)
							};

							if (isScroll) {
								navProps.style =
									"width:" + api.winWidth / this$1.breakpoint + "px;flex-shrink:0;";
							}

							return h("text", navProps, child.attributes.title);
						})
					),

					h(
						"swiper",
						{
							class: ns + "__content",
							onchange: this$1.onchange,
							current: this$1.current
						},

						props.children.map(function(child, index) {
							return h(
								"swiper-item",
								{
									class: ns + "__pane"
								},
								child
							);
						})
					)
				);
			};
		};
		ATabs.prototype.onchange = function(ref) {
			var current = ref.detail.current;

			this.fire("change", {current: current, type: "swiper"});
			this.current = current;
			this.$model.active = current;
			this.update();
			if (current >= this.breakpoint - 1) {
				this.setNavPos();
			}
		};
		ATabs.prototype.onclick = function(current) {
			var this$1 = this;

			var _run = function() {
				this$1.fire("change", {current: current, type: "click"});
				this$1.current = current;
				this$1.$model.active = current;
				this$1.update();
			};

			if (this.props["before-change"]) {
				var result = this.props["before-change"](current);

				var _run$1 = function(_) {
					return _ && _run();
				};

				result.then ? result.then(_run$1) : _run$1(result);
			} else {
				_run();
			}
		};
		ATabs.prototype.setNavPos = function() {
			api.toast({
				msg: "调整Nav位置逻辑等待外形查询功能后完善"
			});
		};
		ATabs.prototype.render = function() {
			return;
		};

		return ATabs;
	})(Component);
	ATabs.css = {
		".a-tabs--line": {background: "#FFF"},
		".a-tabs--card": {background: "transparent"},
		".a-tabs__wrap": {flexFlow: "row nowrap", alignItems: "center"},
		".a-tabs__wrap--line": {},
		".a-tabs__wrap--scroll": {display: "flex !important"},
		".a-tabs__wrap--card": {
			height: "32px",
			margin: "0 16px",
			border: "1px solid #ee0a24",
			borderRadius: "2px"
		},
		".a-tabs__nav": {textAlign: "center", fontSize: "14px"},
		".a-tabs__nav--line": {height: "44px", lineHeight: "44px"},
		".a-tabs__nav--card": {height: "30px", lineHeight: "30px"},
		".a-tabs__nav--scroll": {whiteSpace: "nowrap"},
		".a-tabs__nav--flat": {flex: "1"},
		".a-tabs__nav--normal--line": {color: "#666", fontWeight: "normal"},
		".a-tabs__nav--active--line": {color: "#333", fontWeight: "bold"},
		".a-tabs__nav--normal--card": {color: "#ee0a24", backgroundColor: "#fff"},
		".a-tabs__nav--active--card": {
			color: "#fff",
			backgroundColor: "#ee0a24",
			borderRight: "none"
		},
		".a-tabs__nav--card--last": {borderRight: "none"},
		".a-tabs__nav--card--not-last": {borderRight: "1px solid #ee0a24"},
		".a-tabs__content": {flex: "1", minHeight: "100px"},
		".a-tabs__pane": {flex: "1", padding: "24px 20px"}
	};
	apivm.define("a-tabs", ATabs);

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

	var SimplePullRefresh = /*@__PURE__*/ (function(Component) {
		function SimplePullRefresh(props) {
			this.data = {
				active: 0,
				isLoading1: false,
				isLoading2: false,
				isLoading3: false,
				distance: 0
			};
		}

		if (Component) SimplePullRefresh.__proto__ = Component;
		SimplePullRefresh.prototype = Object.create(Component && Component.prototype);
		SimplePullRefresh.prototype.constructor = SimplePullRefresh;
		SimplePullRefresh.prototype.onChange = function(e) {
			this.data.active = e.detail.current;
		};
		SimplePullRefresh.prototype.onRefresh = function() {
			var this$1 = this;

			setTimeout(function() {
				this$1.data.isLoading1 = false;
				this$1.data.isLoading2 = false;
				this$1.data.isLoading3 = false;
			}, 2000);
		};
		SimplePullRefresh.prototype.onPulling = function(e) {
			this.data.distance = e.detail.distance;
		};
		SimplePullRefresh.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("a-nav-bar", {title: "simple-pull-refresh", "left-arrow": true}),
				apivm.h(
					"a-tabs",
					{style: "flex:1;", $active: "active", onChange: this.onChange},
					apivm.h(
						"a-tab",
						{title: "基础用法"},
						apivm.h(
							"scroll-view",
							{style: "height:100%;", "scroll-y": true, "show-scrollbar": false},
							apivm.h("a-pull-refresh", {
								$refreshing: "isLoading1",
								onRefresh: this.onRefresh
							}),
							apivm.h("text", {class: "simple-title"}, "下拉刷新示例")
						)
					),
					apivm.h(
						"a-tab",
						{title: "成功提示"},
						apivm.h(
							"scroll-view",
							{style: "height:100%;", "scroll-y": true, "show-scrollbar": false},
							apivm.h("a-pull-refresh", {
								$refreshing: "isLoading2",
								"success-text": "刷新成功",
								"success-duration": "1000",
								onRefresh: this.onRefresh
							}),
							apivm.h("text", {class: "simple-title"}, "下拉刷新示例")
						)
					),
					apivm.h(
						"a-tab",
						{title: "自定义提示"},
						apivm.h(
							"scroll-view",
							{style: "height:100%;", "scroll-y": true, "show-scrollbar": false},
							apivm.h(
								"a-pull-refresh",
								{
									$refreshing: "isLoading3",
									"head-height": "80",
									onRefresh: this.onRefresh,
									onPulling: this.onPulling
								},

								apivm.h(
									"template",
									{_slot: "pulling"},
									apivm.h("img", {
										src: "https://docs.apicloud.com/act/img/doge.png",
										class: "doge",
										style: "transform:scale(" + Math.min(this.data.distance / 80, 1) + ")"
									})
								),
								apivm.h(
									"template",
									{_slot: "loosing"},
									apivm.h("img", {
										src: "https://docs.apicloud.com/act/img/doge.png",
										class: "doge"
									})
								),
								apivm.h(
									"template",
									{_slot: "loading"},
									apivm.h("img", {
										src: "https://docs.apicloud.com/act/img/doge-fire.jpg",
										class: "doge"
									})
								)
							),
							apivm.h("text", {class: "simple-title"}, "下拉刷新示例")
						)
					)
				)
			);
		};

		return SimplePullRefresh;
	})(Component);
	SimplePullRefresh.css = {
		".page": {height: "100%", backgroundColor: "#F8F8F8"},
		".simple-title": {margin: "16px", fontSize: "18px"},
		".doge": {width: "140px", height: "72px", margin: "auto", borderRadius: "4px"}
	};
	apivm.define("simple-pull-refresh", SimplePullRefresh);
})();
