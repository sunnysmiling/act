(function() {
	var DiffColor = /*@__PURE__*/ (function(Component) {
		function DiffColor(props) {
			this.data = {
				current: true
			};
		}

		if (Component) DiffColor.__proto__ = Component;
		DiffColor.prototype = Object.create(Component && Component.prototype);
		DiffColor.prototype.constructor = DiffColor;
		DiffColor.prototype.toggle = function() {
			this.data.current = !this.current;
		};
		DiffColor.prototype.render = function() {
			var this$1 = this;
			return apivm.h(
				"view",
				{class: "page"},
				(Array.isArray([true, false])
					? [true, false]
					: Object.values([true, false])
				).map(function(a) {
					return apivm.h(
						"view",
						{
							onClick: this$1.toggle,
							class: "item " + (this$1.data.current === a ? "selected" : "normal")
						},
						apivm.h("text", null, this$1.data.current === a ? "selected" : "normal")
					);
				})
			);
		};

		return DiffColor;
	})(Component);
	DiffColor.css = {
		".page": {height: "100%", transition: "background-color 1s"},
		".item": {height: "50px", border: "1px solid blue"},
		".normal": {backgroundColor: "#fff"},
		".selected": {backgroundColor: "#ee0a24"}
	};
	apivm.define("diff-color", DiffColor);
})();
