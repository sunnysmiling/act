(function() {
	function ownKeys(object, enumerableOnly) {
		var keys = Object.keys(object);

		if (Object.getOwnPropertySymbols) {
			var symbols = Object.getOwnPropertySymbols(object);
			enumerableOnly &&
				(symbols = symbols.filter(function(sym) {
					return Object.getOwnPropertyDescriptor(object, sym).enumerable;
				})),
				keys.push.apply(keys, symbols);
		}

		return keys;
	}

	function _objectSpread2(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = null != arguments[i] ? arguments[i] : {};
			i % 2
				? ownKeys(Object(source), !0).forEach(function(key) {
						_defineProperty(target, key, source[key]);
				  })
				: Object.getOwnPropertyDescriptors
				? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
				: ownKeys(Object(source)).forEach(function(key) {
						Object.defineProperty(
							target,
							key,
							Object.getOwnPropertyDescriptor(source, key)
						);
				  });
		}

		return target;
	}

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

	function formatValueByGapStep(
		step,
		value,
		gap,
		direction,
		range,
		isAdd,
		oldValue
	) {
		if (gap === void 0) {
			gap = " ";
		}
		if (direction === void 0) {
			direction = "right";
		}
		if (isAdd === void 0) {
			isAdd = 1;
		}
		if (oldValue === void 0) {
			oldValue = "";
		}
		if (value.length === 0) {
			return {value: value, range: range};
		}

		var arr = value && value.split("");
		var _range = range;
		var showValue = "";

		if (direction === "right") {
			for (var j = arr.length - 1, k = 0; j >= 0; j--, k++) {
				var m = arr[j];
				showValue =
					k > 0 && k % step === 0 ? m + gap + showValue : m + "" + showValue;
			}
			if (isAdd === 1) {
				// 在添加的情况下，如果添加前字符串的长度减去新的字符串的长度为2，说明多了一个间隔符，需要调整range
				if (oldValue.length - showValue.length === -2) {
					_range = range + 1;
				}
			} else {
				// 在删除情况下，如果删除前字符串的长度减去新的字符串的长度为2，说明少了一个间隔符，需要调整range
				if (oldValue.length - showValue.length === 2) {
					_range = range - 1;
				}
				// 删除到最开始，range 保持 0
				if (_range <= 0) {
					_range = 0;
				}
			}
		} else {
			arr.some(function(n, i) {
				showValue =
					i > 0 && i % step === 0 ? showValue + gap + n : showValue + "" + n;
			});
			var adapt = range % (step + 1) === 0 ? 1 * isAdd : 0;
			_range =
				typeof range !== "undefined"
					? range === 0
						? 0
						: range + adapt
					: showValue.length;
		}

		return {value: showValue, range: _range};
	}

	var cnNums = [
		"\u96F6",
		"\u58F9",
		"\u8D30",
		"\u53C1",
		"\u8086",
		"\u4F0D",
		"\u9646",
		"\u67D2",
		"\u634C",
		"\u7396"
	];

	// 拾 \u62fe 佰 \u4f70 仟 \u4edf
	var cnIntRadice = ["", "\u62FE", "\u4F70", "\u4EDF"];

	// 万 \u4e07 亿 \u4ebf 兆 \u5146
	var cnIntUnits = ["", "\u4E07", "\u4EBF", "兆"];

	// 角 \u89d2 分 \u5206 厘 \u5398 毫 \u6beb
	var cnDecUnits = ["\u89D2", "\u5206", "\u5398", "\u6BEB"];
	var cnInteger = "\u6574"; // 整 \u6574
	var cnIntLast = "\u5143"; // 元 \u5143

	var cnNegative = "\u8D1F"; // 负

	// Maximum number
	var maxNum = 999999999999999.9999;

	function numberCapital(number) {
		var negative;
		// Integral part
		var integerNum;
		// Decimal part
		var decimalNum;
		// Capital number
		var capitalStr = "";

		var parts;

		/* istanbul ignore if  */
		if (number === "") {
			return "";
		}

		number = parseFloat(number);

		if (number < 0) {
			negative = true;
			number = Math.abs(number);
		}

		/* istanbul ignore if  */
		if (number >= maxNum) {
			return "";
		}

		/* istanbul ignore if  */
		if (number === 0) {
			capitalStr = cnNums[0] + cnIntLast + cnInteger;
			return capitalStr;
		}

		// Convert to String
		number += "";

		if (number.indexOf(".") === -1) {
			integerNum = number;
			decimalNum = "";
		} else {
			parts = number.split(".");
			integerNum = parts[0];
			decimalNum = parts[1].substr(0, 4);
		}

		// Convert integer part
		if (parseInt(integerNum, 10) > 0) {
			var zeroCount = 0;
			for (var i = 0, IntLen = integerNum.length; i < IntLen; i++) {
				var n = integerNum.substr(i, 1);
				var p = IntLen - i - 1;
				var q = p / 4;
				var m = p % 4;
				if (n === "0") {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
						capitalStr += cnNums[0];
					}
					zeroCount = 0;
					capitalStr += cnNums[parseInt(n)] + cnIntRadice[m];
				}
				if (m === 0 && zeroCount < 4) {
					capitalStr += cnIntUnits[q];
				}
			}
			capitalStr += cnIntLast;
		}

		// Convert decimal part
		if (decimalNum !== "") {
			for (var _i = 0, decLen = decimalNum.length; _i < decLen; _i++) {
				var _n = decimalNum.substr(_i, 1);
				if (_n !== "0") {
					capitalStr += cnNums[Number(_n)] + cnDecUnits[_i];
				}
			}
		}

		/* istanbul ignore if  */
		if (capitalStr === "") {
			capitalStr += cnNums[0] + cnIntLast + cnInteger;
		} else if (decimalNum === "") {
			capitalStr += cnInteger;
		}

		if (negative) {
			capitalStr = "" + cnNegative + capitalStr;
		}
		return capitalStr;
	}

	var AAmount = /*#__PURE__*/ (function(_Component) {
		_inheritsLoose(AAmount, _Component);
		function AAmount() {
			var _this;
			for (
				var _len = arguments.length, args = new Array(_len), _key = 0;
				_key < _len;
				_key++
			) {
				args[_key] = arguments[_key];
			}
			_this = _Component.call.apply(_Component, [this].concat(args)) || this;
			_defineProperty(_assertThisInitialized(_this), "render", function(props) {
				var value = Number(props.value || props.children[0]);
				var _props$precision = props.precision,
					precision = _props$precision === void 0 ? 2 : _props$precision,
					isRoundUp = props["is-round-up"],
					hasSeparator = props["has-separator"],
					_props$separator = props.separator,
					separator = _props$separator === void 0 ? "," : _props$separator,
					_props$isCapital = props["is-capital"],
					isCapital = _props$isCapital === void 0 ? false : _props$isCapital;

				if (isCapital) {
					value = numberCapital(value);
				} else {
					value = _this.doPrecision(value, precision, isRoundUp);
					value = _this.doFormat(value, hasSeparator, separator);
				}

				return h(
					"text",
					_objectSpread2({class: "a-amount " + props.class}, props),
					value
				);
			});
			return _this;
		}
		var _proto = AAmount.prototype;
		_proto.doPrecision = function doPrecision(value, precision, isRoundUp) {
			var exponentialForm = Number(value + "e" + precision);
			var rounded = isRoundUp
				? Math.round(exponentialForm)
				: Math.floor(exponentialForm);
			return Number(rounded + "e-" + precision).toFixed(precision);
		};
		_proto.doFormat = function doFormat(value, hasSeparator, separator) {
			if (!hasSeparator) {
				return value;
			}
			var numberParts = value.split(".");
			var integerValue = numberParts[0];
			var decimalValue = numberParts[1] || "";
			var sign = "";
			if (integerValue.startsWith("-")) {
				integerValue = integerValue.substring(1);
				sign = "-";
			}
			var formattedValue = formatValueByGapStep(
				3,
				integerValue,
				separator,
				"right",
				0,
				1
			);
			return decimalValue
				? "" + sign + formattedValue.value + "." + decimalValue
				: "" + sign + formattedValue.value;
		};
		return AAmount;
	})(Component);

	define("a-amount", AAmount);

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

	var SimpleAmount = /*@__PURE__*/ (function(Component) {
		function SimpleAmount(props) {}

		if (Component) SimpleAmount.__proto__ = Component;
		SimpleAmount.prototype = Object.create(Component && Component.prototype);
		SimpleAmount.prototype.constructor = SimpleAmount;
		SimpleAmount.prototype.render = function() {
			return apivm.h(
				"view",
				{class: "page"},
				apivm.h("a-nav-bar", {title: "simple-amount", "left-arrow": true}),
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
							"通过 value 传递数据。默认去尾法留两位。"
						),
						apivm.h("view", {class: "row"}, apivm.h("a-amount", {value: 1234.125})),

						apivm.h(
							"text",
							{class: "simple-desc"},
							"通过子节点传递数据。precision 属性控制精度。"
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("a-amount", {precision: 3}, "1234.125")
						),

						apivm.h(
							"text",
							{class: "simple-desc"},
							"is-round-up 数字精度取舍是否四舍五入。"
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "1234.125 →"),
							apivm.h("a-amount", {"is-round-up": true}, "1234.125")
						),

						apivm.h(
							"text",
							{class: "simple-desc"},
							"has-separator 数字是否有千位分隔符。"
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "1234.125 →"),
							apivm.h("a-amount", {"has-separator": true}, "1234.125")
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "-123456.123 →"),
							apivm.h(
								"a-amount",
								{"has-separator": true, separator: "★"},
								"-123456789.123"
							)
						),

						apivm.h("text", {class: "simple-desc"}, "is-capital 数字转为中文大写。"),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "1234.125 →"),
							apivm.h("a-amount", {"is-capital": true}, "1234.125")
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "-123456.123 →"),
							apivm.h("a-amount", {"is-capital": true}, "-123456.123")
						),
						apivm.h(
							"view",
							{class: "row"},
							apivm.h("text", {class: "gray-origin"}, "1234.1010 →"),
							apivm.h("a-amount", {"is-capital": true}, "1234.1010")
						)
					)
				)
			);
		};

		return SimpleAmount;
	})(Component);
	SimpleAmount.css = {
		".page": {height: "100%", backgroundColor: "#F8F8F8"},
		".simple": {paddingBottom: "28px"},
		".simple-title": {margin: "16px", fontWeight: "600", fontSize: "18px"},
		".simple-desc": {color: "#999", fontSize: "14px", margin: "0 16px"},
		".row": {flexFlow: "row wrap", padding: "16px"},
		".gray-origin": {color: "#ccc", marginRight: "6px"}
	};
	apivm.define("simple-amount", SimpleAmount);
})();
