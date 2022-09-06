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

	var SimpleGoodsCard = /*@__PURE__*/ (function(Component) {
		function SimpleGoodsCard(props) {}

		if (Component) SimpleGoodsCard.__proto__ = Component;
		SimpleGoodsCard.prototype = Object.create(Component && Component.prototype);
		SimpleGoodsCard.prototype.constructor = SimpleGoodsCard;
		SimpleGoodsCard.prototype.test = function() {
			console.log("test");
		};
		SimpleGoodsCard.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h(ANavBar, {title: "simple-goods-card", "left-arrow": true}),
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
							"商品卡片，用于展示商品的图片、价格等信息。"
						),

						apivm.h("a-goods-card", {
							num: "2",
							price: "2.00",
							desc: "描述信息",
							title: "商品标题",
							thumb:
								"https://www.apicloud.com/icon/91/d1/91d1cae110eb88a6789da0d63b418f5c.png"
						})
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "营销信息"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过 origin-price 设置商品原价，通过 tag 设置商品左上角标签。"
						),

						apivm.h("a-goods-card", {
							num: "2",
							tag: "标签",
							price: "2.00",
							desc: "描述信息",
							title: "商品标题",
							thumb: "https://img.yzcdn.cn/vant/ipad.jpeg",
							"origin-price": "10.00"
						})
					),

					apivm.h(
						"view",
						{class: "simple"},
						apivm.h("text", {class: "simple-title"}, "自定义内容"),
						apivm.h(
							"text",
							{class: "simple-desc"},
							"GoodsCard 组件提供了多个插槽，可以灵活地自定义内容。"
						),

						apivm.h(
							"a-goods-card",
							{
								num: "2",
								price: "2.00",
								desc: "描述信息",
								title: "商品标题",
								thumb: "https://www.apicloud.com/img/default.png"
							},
							apivm.h(
								"template",
								{_slot: "tags"},
								apivm.h("a-tag", {plain: true, type: "danger"}, "标签"),
								apivm.h("a-tag", {plain: true, type: "danger"}, "标签")
							),
							apivm.h(
								"template",
								{_slot: "footer"},
								apivm.h(
									"a-button",
									{size: "mini", round: true, onClick: this.test},
									"按钮"
								),
								apivm.h("a-button", {size: "mini", round: true}, "按钮")
							)
						)
					)
				)
			);
		};

		return SimpleGoodsCard;
	})(Component);
	SimpleGoodsCard.css = {
		".page": {flex: "1", backgroundColor: "#fff"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px 16px"}
	};
	apivm.define("simple-goods-card", SimpleGoodsCard);
})();
