(function() {
	var AEmpty = /*@__PURE__*/ (function(Component) {
		function AEmpty(props) {
			Component.call(this, props);
		}

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

	var AIcon = /*@__PURE__*/ (function(Component) {
		function AIcon(props) {
			Component.call(this, props);
		}

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

	var ATag = /*@__PURE__*/ (function(Component) {
		function ATag(props) {
			Component.call(this, props);
		}

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
		function ANavBar(props) {
			Component.call(this, props);
		}

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

	var EleMeInputFixed = /*@__PURE__*/ (function(Component) {
		function EleMeInputFixed(props) {
			Component.call(this, props);
			this.data = {
				showFix: false,
				fixedStyle: {
					top: api.safeArea ? api.safeArea.top : 0
				},

				menu: [
					{
						img:
							"https://cube.elemecdn.com/7/d8/a867c870b22bc74c87c348b75528djpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "美食"
					},

					{
						img:
							"https://cube.elemecdn.com/a/7b/b02bd836411c016935d258b300cfejpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "大牌会吃"
					},

					{
						img:
							"https://cube.elemecdn.com/e/58/bceb19258e3264e64fb856722c3c1jpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "跑腿"
					},

					{
						img:
							"https://cube.elemecdn.com/b/7f/432619fb21a40b05cd25d11eca02djpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "汉堡披萨"
					},

					{
						img:
							"https://cube.elemecdn.com/7/d6/6f2631288a44ec177204e05cbcb93jpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "地方小吃"
					},

					{
						img:
							"https://cube.elemecdn.com/e/89/185f7259ebda19e16123884a60ef2jpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "米粉面馆"
					},

					{
						img:
							"https://cube.elemecdn.com/5/1a/dc885d2ce022d2ee60495acafb795jpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "包子粥店"
					},

					{
						img:
							"https://cube.elemecdn.com/a/78/0fb469b2da210827ec16896e00420jpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed",
						title: "炸鸡烤串"
					}
				],

				shopList: Array.from({length: 2}, function(_) {
					return Math.random().toFixed(2) * 100 + 2;
				})
			};
		}

		if (Component) EleMeInputFixed.__proto__ = Component;
		EleMeInputFixed.prototype = Object.create(Component && Component.prototype);
		EleMeInputFixed.prototype.constructor = EleMeInputFixed;
		EleMeInputFixed.prototype.installed = function() {
			api.setStatusBarStyle &&
				api.setStatusBarStyle({style: "light", color: "#1989fa"});
		};
		EleMeInputFixed.prototype.handleScroll = function(ref) {
			var scrollTop = ref.detail.scrollTop;

			var showFix = scrollTop > 44;
			if (showFix !== this.data.showFix) {
				console.log("this.data.showFix = " + showFix);
				this.data.showFix = showFix;
			}
		};
		EleMeInputFixed.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(
					"scroll-view",
					{
						style: "flex: 1;",
						"scroll-y": true,
						onScroll: this.handleScroll,
						bounces: "false"
					},
					apivm.h(
						"safe-area",
						{class: "header"},
						apivm.h("text", {class: "address"}, " 📍 选择地址")
					),
					apivm.h(
						"view",
						{class: "my-input real"},
						apivm.h("text", {class: "input-text"}, " 🔍 搜索吃了么商家")
					),

					apivm.h(
						"view",
						{class: "main"},
						apivm.h(
							"view",
							{class: "menu"},
							(Array.isArray(this.data.menu)
								? this.data.menu
								: Object.values(this.data.menu)
							).map(function(m) {
								return apivm.h(
									"view",
									{class: "menu-item"},
									apivm.h("img", {class: "menu-item__img", src: m.img, alt: ""}),
									apivm.h("text", {class: "menu-item__text"}, m.title)
								);
							})
						),

						apivm.h(
							"view",
							{class: "banner"},
							apivm.h(
								"view",
								{class: "banner__left"},
								apivm.h("text", {class: "banner__title"}, "品质套餐"),
								apivm.h("text", {class: "banner__desc"}, "搭配齐全吃得好"),
								apivm.h("text", {class: "banner__link"}, "立即抢购 >")
							),

							apivm.h("img", {
								src:
									"https://cube.elemecdn.com/e/ee/df43e7e53f6e1346c3fda0609f1d3png.png?x-oss-process=image/format,webp/resize,w_282,h_188,m_fixed",
								alt: "",
								class: "banner-img"
							})
						),

						apivm.h(
							"view",
							{class: "vip"},

							apivm.h("img", {
								class: "vip-hat",
								src:
									"https://cube.elemecdn.com/8/0e/4dd212d831becab6e3ebd484c0941jpeg.jpeg?x-oss-process=image/format,webp/resize,w_34",
								alt: ""
							}),

							apivm.h(
								"text",
								{style: "font-size: 16px;color: #644f1b;font-weight: bold;"},
								"超级会员"
							),
							apivm.h(
								"text",
								{style: "font-size: 9px;flex: 1;"},
								"· 已经为我节省275元"
							),
							apivm.h("text", {style: "font-size: 9px;"}, "下单即可获得奖金 >")
						),

						apivm.h(
							"view",
							{class: "shop-list"},
							(Array.isArray(this.data.shopList)
								? this.data.shopList
								: Object.values(this.data.shopList)
							).map(function(shop, i) {
								return apivm.h(
									"view",
									{class: "shop"},
									apivm.h(
										"view",
										{class: "shop-main"},
										apivm.h("img", {
											src:
												"https://www.apicloud.com/icon/91/d1/91d1cae110eb88a6789da0d63b418f5c.png",
											alt: "",
											class: "shop-cover"
										}),
										apivm.h(
											"view",
											{class: "shop-info "},
											apivm.h(
												"view",
												{class: "shop-header"},
												apivm.h("text", {class: "shop-brand"}, "品牌"),
												apivm.h(
													"text",
													{class: "shop-title"},
													i ? "超级麻辣烫" : "青椒牛肉米线盖饭面皮子酸稀饭"
												),
												apivm.h("text", null, "...")
											),
											apivm.h(
												"text",
												{class: "shop-text"},
												"评分4." + i + " | 月售1" + shop
											),
											apivm.h(
												"view",
												{class: "shop-footer"},
												apivm.h(
													"text",
													{class: "shop-text", style: "flex: 1;"},
													shop + "元起送 | 免配送费"
												),
												apivm.h(
													"text",
													{class: "shop-text"},
													"1" + shop + "m | " + shop,
													"分钟"
												)
											)
										)
									),

									apivm.h(
										"view",
										{class: "shop-extra"},
										apivm.h(
											"view",
											{style: "flex-flow: row nowrap;"},
											apivm.h(
												"a-tag",
												{plain: true, style: "margin-right: 5px;"},
												"盖浇饭"
											),
											apivm.h("a-tag", {plain: true, type: "primary"}, "新店开业")
										)
									)
								);
							})
						)
					),

					apivm.h("a-empty", {description: "没有更多了"})
				),
				api.systemType === "ios"
					? this.data.showFix &&
							apivm.h(
								"view",
								{class: "my-input fixed"},
								apivm.h("view", {style: "height: " + this.data.fixedStyle.top + "px;"}),
								apivm.h("text", {class: "input-text"}, " 🔍 搜索吃了么商家 fixed ios")
							)
					: apivm.h(
							"view",
							{
								class: "my-input fixed",
								style: this.data.showFix ? "display:flex;" : "display:none;"
							},
							apivm.h("view", {style: "height: " + this.data.fixedStyle.top + "px;"}),
							apivm.h("text", {class: "input-text"}, " 🔍 搜索吃了么商家 fixed 安卓")
					  )
			);
		};

		return EleMeInputFixed;
	})(Component);
	EleMeInputFixed.css = {
		".page": {flex: "1", backgroundColor: "#FFF", position: "relative"},
		".header": {background: "#1989fa"},
		".address": {
			color: "#fff",
			height: "44px",
			lineHeight: "44px",
			margin: "0 16px"
		},
		".my-input": {background: "#1989fa", width: "100%"},
		".input-text": {
			color: "#666",
			height: "44px",
			lineHeight: "44px",
			textAlign: "center",
			background: "#ddd",
			margin: "16px",
			borderRadius: "3px"
		},
		".fixed": {position: "absolute", margin: "0 auto"},
		".menu": {flexFlow: "row wrap"},
		".menu-item": {width: "20%", alignItems: "center"},
		".menu-item__img": {width: "44px", height: "44px"},
		".menu-item__text, .banner__desc": {color: "#666", fontSize: "12px"},
		".banner": {
			flexFlow: "row nowrap",
			backgroundColor: "#f7f7f7",
			margin: "10px",
			padding: "10px",
			borderRadius: "4px"
		},
		".banner__left": {flex: "1"},
		".banner__title": {fontSize: "16px", fontWeight: "700", color: "#333"},
		".banner__link": {color: "#af8260", fontWeight: "bolder", marginTop: "10px"},
		".banner-img": {width: "120px", height: "80px"},
		".vip": {
			backgroundImage: "linear-gradient(to right, #ffefc4, #f3dda0)",
			margin: "10px",
			padding: "10px",
			flexFlow: "row nowrap",
			justifyContent: "space-between",
			alignItems: "center",
			borderRadius: "4px"
		},
		".vip-hat": {width: "15px", height: "15px"},
		".shop": {margin: "10px"},
		".shop-main": {flexFlow: "row nowrap"},
		".shop-info": {
			marginLeft: "10px",
			flex: "1",
			justifyContent: "space-between"
		},
		".shop-header": {flexFlow: "row nowrap", alignItems: "center"},
		".shop-brand": {
			backgroundColor: "#ffe339",
			color: "#6f3f15",
			fontSize: "12px",
			fontWeight: "bold",
			height: "16px",
			paddingLeft: "5px",
			paddingRight: "5px",
			borderRadius: "3px",
			marginRight: "4px"
		},
		".shop-cover": {width: "55px", height: "55px"},
		".shop-title": {
			fontSize: "14px",
			fontWeight: "bold",
			color: "#323233",
			flex: "1",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		},
		".shop-text": {
			fontSize: "9px",
			color: "#999",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		},
		".shop-footer": {flexFlow: "row nowrap"},
		".shop-extra": {paddingTop: "5px", paddingLeft: "65px"},
		".shop-act-mark": {
			display: "inline-flex",
			fontSize: "12px",
			color: "#fff",
			height: "14px",
			width: "14px",
			textAlign: "center",
			lineHeight: "14px",
			borderRadius: "3px"
		},
		".bg1": {backgroundColor: "#1989fa"},
		".bg2": {backgroundColor: "#07c160"},
		".shop-act-text": {
			color: "#666",
			fontSize: "10px",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			overflow: "hidden"
		}
	};
	apivm.define("ele-me-input-fixed", EleMeInputFixed);
	apivm.render(apivm.h("ele-me-input-fixed", null), "body");
})();
