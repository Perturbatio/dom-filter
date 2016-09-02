'use strict';

/**
 *
 */

var DomFilter = function () {
	babelHelpers.createClass(DomFilter, [{
		key: 'getLangStrings',


		/**
   * Return all strings for a given language
   *
   * @param {String} lang defaults to 'en'
   * @returns {*}
   */
		value: function getLangStrings(lang) {
			var me = this;
			lang = lang || 'en';
			if (typeof lang !== 'string' || !me.strings.hasOwnProperty(lang)) {
				return {};
			}
			return me.strings[lang];
		}

		/**
   *
   * @param {Object} config
   */

	}, {
		key: 'strings',

		/**
   *
   * @returns {Object}
   */
		get: function get() {
			var me = this;
			if (typeof me._strings === 'undefined') {
				me._strings = DomFilter._getDefaultLangStrings();
			}
			return me._strings;
		}

		/**
   *
   * @param {Object} value
   */
		,
		set: function set(value) {
			this._strings = value;
		}

		/**
   *
   * @returns {string}
   */

	}, {
		key: 'defaultLanguage',
		get: function get() {
			var me = this;
			if (typeof me._defaultLang !== 'string') {
				me._defaultLang = 'en';
			}
			return me._defaultLang || '';
		}

		/**
   *
   * @param {string} value
   */
		,
		set: function set(value) {
			if (typeof value === 'string') {
				this._defaultLang = value;
			}
		}

		/**
   *
   * @returns {Element}
   */

	}, {
		key: 'feedbackElement',
		get: function get() {
			return this.filterContainer.querySelector(this._config.feedbackElement);
		}

		/**
   *
   * @param {string|Element} value
   */
		,
		set: function set(value) {
			this._config.feedbackElement = value;
		}

		/**
   * Get the default language strings for the class
   *
   * @returns {Object}
   * @private
   */

	}], [{
		key: '_getDefaultLangStrings',
		value: function _getDefaultLangStrings() {
			return {
				'en': {
					'feedback': {
						'no_results': 'No results',
						'default_feedback_message': ''
					},
					'input': {
						'placeholder': 'Filter',
						'label': 'Filter this list:'
					}
				}
			};
		}
	}]);

	function DomFilter(config) {
		babelHelpers.classCallCheck(this, DomFilter);

		var me = this;

		me._config = config || {};
		me._initialConfig = me._config;

		me._config.feedbackElement = me._config.feedbackElement || '.feedback';
		me._config.containerClass = me._config.containerClass || 'element-filter';

		me._config.filterTemplate = me._config.filterTemplate || '<div class="' + me._config.containerClass + '">' + '<label>{{input.label}}<input type="text" placeholder="{{input.placeholder}}"></label>' + '<div class="feedback"></div>' + '</div>';
		me._config.inputElement = me._config.inputElement || '.element-filter input';
		me._filterNodes = document.querySelectorAll(me._config.filterNodes);
		me._hideFunction = me._config.hideFunction || DomFilter._fnHideNodes;
		me._showFunction = me._config.showFunction || DomFilter._fnShowNodes;
		me._matchFunction = me._config.matchFunction || DomFilter._fnMatchNode;

		me.createFilterElement();
		me.registerListeners();
	}

	/**
  *
  */


	babelHelpers.createClass(DomFilter, [{
		key: 'registerListeners',
		value: function registerListeners() {
			var me = this;
			me.inputElement.addEventListener('keypress', function (e) {
				return me._onFilterChange(e);
			});
			me.inputElement.addEventListener('change', function (e) {
				return me._onFilterChange(e);
			});
			me.inputElement.addEventListener('input', function (e) {
				return me._onFilterChange(e);
			});
		}

		/**
   * The default method of showing a node
   * removes aria-hidden attribute to each
   *
   * @param nodes
   * @private
   */

	}, {
		key: '_onFilterChange',


		/**
   *
   * @param {Event} e
   * @private
   */
		value: function _onFilterChange(e) {
			var me = this,
			    searchText = typeof me.inputElement.value !== 'undefined' ? me.inputElement.value.trim() : me.inputElement.innerText.trim();
			me._showFunction(me._filterNodes);
			this.filter(searchText);
		}

		/**
   * filter the nodes using the provided searchText
   *
   * @param {String} searchText
   */

	}, {
		key: 'filter',
		value: function filter(searchText) {
			var me = this,
			    matchedNodes,
			    unmatchedNodes;

			if (searchText.length > 0) {
				matchedNodes = [].filter.call(me._filterNodes, function (node) {
					return me._matchFunction(node, searchText);
				});
				unmatchedNodes = me._getUnmatchedNodes(me._filterNodes, matchedNodes);
				me._showFunction(matchedNodes);
				me._hideFunction(unmatchedNodes);
				if (matchedNodes.length < 1) {
					me.feedback(me._strings[me.defaultLanguage].feedback.no_results);
				} else {
					me.feedback(me._strings[me.defaultLanguage].feedback.default_feedback_message);
				}
			} else {
				me.feedback(me._strings[me.defaultLanguage].feedback.default_feedback_message);
			}
		}

		/**
   * Add a message to the feeback element
   * @param text
   */

	}, {
		key: 'feedback',
		value: function feedback(text) {
			if (typeof this.feedbackElement !== 'undefined' && this.feedbackElement) {
				this.feedbackElement.innerHTML = text;
			}
		}
	}, {
		key: '_getUnmatchedNodes',
		value: function _getUnmatchedNodes(nodes, matchedNodes) {
			var result = [];
			[].forEach.call(nodes, function (node) {
				if (![].find.call(matchedNodes, function (matchedNode) {
					return matchedNode === node;
				})) {
					result.push(node);
				}
			});
			return result;
		}

		/**
   *
   */

	}, {
		key: 'createFilterElement',
		value: function createFilterElement() {
			var me = this,
			    filterContainer = DomFilter._createNodes(me.replaceStrings(me._config.filterTemplate, me.getLangStrings())),
			    appendToNode,
			    beforeNode,
			    afterNode;

			if (typeof me._config.insertBefore !== 'undefined') {
				beforeNode = document.querySelector(me._config.insertBefore);
				beforeNode.parentNode.insertBefore(filterContainer, beforeNode);
			} else if (typeof me._config.insertAfter !== 'undefined') {
				afterNode = document.querySelector(me._config.insertAfter);
				DomFilter._insertAfter(filterContainer, afterNode);
			} else if (typeof me._config.appendTo !== 'undefined') {
				appendToNode = document.querySelector(me._config.appendTo);
				appendToNode.appendChild(filterContainer);
			}

			me.filterContainer = filterContainer;
			me.inputElement = filterContainer.querySelector(me._config.inputElement);
		}

		/**
   *
   * @param {Element} insertNode
   * @param {Element} afterNode
   * @private
   */

	}, {
		key: 'replaceStrings',


		/**
   *
   * @param {string} filterTemplate
   * @param {object} strings
   * @returns {string}
   */
		value: function replaceStrings(filterTemplate, strings) {
			filterTemplate = filterTemplate || '';

			var regex = /({{([A-Za-z]+[A-Za-z0-9]*?(\.(?=[A-Za-z])){0,1})+}})/ig;
			return filterTemplate.replace(regex, function (match) {

				match = match.replace('{{', '').replace('}}', ''); //ugly hack because I need to work on my regexes

				return match.split('.').reduce(function (a, b) {
					return a[b];
				}, strings);
			});
		}
	}], [{
		key: '_fnShowNodes',
		value: function _fnShowNodes(nodes) {
			[].forEach.call(nodes, function (node) {
				node.removeAttribute('aria-hidden');
			});
		}

		/**
   * The default method of hiding a node
   * adds aria-hidden
   *
   * @param nodes
   * @private
   */

	}, {
		key: '_fnHideNodes',
		value: function _fnHideNodes(nodes) {
			[].forEach.call(nodes, function (node) {
				node.setAttribute('aria-hidden', true);
			});
		}

		/**
   * The default method for matching a node to the searchText
   *
   * @param node
   * @param {String} searchText
   * @returns {boolean}
   * @private
   */

	}, {
		key: '_fnMatchNode',
		value: function _fnMatchNode(node, searchText) {
			searchText = searchText.toLocaleLowerCase();
			return node.innerText.toLocaleLowerCase().indexOf(searchText) > -1;
		}
	}, {
		key: '_insertAfter',
		value: function _insertAfter(insertNode, afterNode) {
			var nextNode = afterNode.nextSibling;
			if (typeof nextNode !== 'undefined') {
				afterNode.parentNode.insertBefore(insertNode, nextNode);
			} else {
				afterNode.parentNode.appendChild(insertNode);
			}
		}

		/**
   *
   * @param html
   * @returns {*|Element}
   * @private
   */

	}, {
		key: '_createNodes',
		value: function _createNodes(html) {
			var template = document.createElement('template');
			template.innerHTML = html;
			return template.content.firstChild;
		}
	}]);
	return DomFilter;
}();

//# sourceMappingURL=dom-filter-compiled.js.map