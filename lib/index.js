'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactHintFactory = exports.ReactHintFactory = function ReactHintFactory(_ref) {
	var Component = _ref.Component,
	    createElement = _ref.createElement;

	var ReactHint = function (_Component) {
		_inherits(ReactHint, _Component);

		function ReactHint() {
			_classCallCheck(this, ReactHint);

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			var _this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args)));

			_this.state = { target: null };

			_this.shouldComponentUpdate = _this.shouldComponentUpdate.bind(_this);
			_this.shallowEqual = _this.shallowEqual.bind(_this);
			_this.findHint = _this.findHint.bind(_this);
			_this.getHintData = _this.getHintData.bind(_this);
			_this.mouseOver = _this.mouseOver.bind(_this);
			_this.renderContent = _this.renderContent.bind(_this);
			return _this;
		}

		ReactHint.prototype.componentDidMount = function componentDidMount() {
			document.addEventListener('mouseover', this.mouseOver);
		};

		ReactHint.prototype.componentWillUnmount = function componentWillUnmount() {
			document.removeEventListener('mouseover', this.mouseOver);
			clearTimeout(this._timeout);
		};

		ReactHint.prototype.shouldComponentUpdate = function shouldComponentUpdate(props, state) {
			return !this.shallowEqual(state, this.state) || !this.shallowEqual(props, this.props);
		};

		ReactHint.prototype.shallowEqual = function shallowEqual(a, b) {
			var keys = Object.keys(a);
			return keys.length === Object.keys(b).length && keys.reduce(function (result, key) {
				return result && (typeof a[key] === 'function' || a[key] === b[key]);
			}, true);
		};

		ReactHint.prototype.componentDidUpdate = function componentDidUpdate() {
			if (this.state.target) this.setState(this.getHintData);
		};

		ReactHint.prototype.findHint = function findHint(el) {
			var _props = this.props,
			    attribute = _props.attribute,
			    hover = _props.hover;
			var target = this.state.target;


			while (el) {
				if (el === document) break;
				if (hover && el === this._hint) return target;
				if (el.hasAttribute(attribute)) return el;
				el = el.parentNode;
			}return null;
		};

		ReactHint.prototype.getHintData = function getHintData(_ref2, _ref3) {
			var target = _ref2.target;
			var attribute = _ref3.attribute,
			    position = _ref3.position;

			var content = target.getAttribute(attribute) || '';
			var at = target.getAttribute(attribute + '-at') || position;

			var _container$getBoundin = this._container.getBoundingClientRect(),
			    containerTop = _container$getBoundin.top,
			    containerLeft = _container$getBoundin.left;

			var _hint$getBoundingClie = this._hint.getBoundingClientRect(),
			    hintWidth = _hint$getBoundingClie.width,
			    hintHeight = _hint$getBoundingClie.height;

			var _target$getBoundingCl = target.getBoundingClientRect(),
			    targetTop = _target$getBoundingCl.top,
			    targetLeft = _target$getBoundingCl.left,
			    targetWidth = _target$getBoundingCl.width,
			    targetHeight = _target$getBoundingCl.height;

			var top = void 0,
			    left = void 0;
			switch (at) {
				case 'left':
					top = targetHeight - hintHeight >> 1;
					left = -hintWidth;
					break;

				case 'right':
					top = targetHeight - hintHeight >> 1;
					left = targetWidth;
					break;

				case 'bottom':
					top = targetHeight;
					left = targetWidth - hintWidth >> 1;
					break;

				case 'top':
				default:
					top = -hintHeight;
					left = targetWidth - hintWidth >> 1;
			}

			return {
				content: content, at: at,
				top: top + targetTop - containerTop,
				left: left + targetLeft - containerLeft
			};
		};

		ReactHint.prototype.mouseOver = function mouseOver(_ref4) {
			var _this2 = this;

			var target = _ref4.target;
			var _props2 = this.props,
			    delay = _props2.delay,
			    events = _props2.events;

			if (!events) return;

			clearTimeout(this._timeout);
			this._timeout = setTimeout(function () {
				return _this2.setState(function () {
					return {
						target: _this2.findHint(target)
					};
				});
			}, delay);
		};

		ReactHint.prototype.renderContent = function renderContent(content) {
			if (String(content)[0] === '#') {
				var el = document.getElementById(content.slice(1));
				if (el) return createElement('div', {
					dangerouslySetInnerHTML: { __html: el.innerHTML }
				});
			}return content;
		};

		ReactHint.prototype.render = function render() {
			var _this3 = this;

			var className = this.props.className;
			var _state = this.state,
			    target = _state.target,
			    content = _state.content,
			    at = _state.at,
			    top = _state.top,
			    left = _state.left;


			return createElement('div', {
				ref: function ref(_ref5) {
					return _this3._container = _ref5;
				},
				style: { position: 'relative' }
			}, target && createElement('div', {
				className: className + ' ' + className + '--' + at,
				ref: function ref(_ref6) {
					return _this3._hint = _ref6;
				},
				style: { top: top, left: left }
			}, createElement('div', {
				className: className + '__content'
			}, this.renderContent(content))));
		};

		return ReactHint;
	}(Component);

	ReactHint.defaultProps = {
		attribute: 'data-rh',
		className: 'react-hint',
		delay: 0,
		events: false,
		hover: false,
		position: 'top'
	};

	return ReactHint;
};