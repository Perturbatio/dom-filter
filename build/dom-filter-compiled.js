'use strict';

/**
 *
 */

var DomFilter = function () {
	/**
  *
  * @param config
  */

	function DomFilter(config) {
		babelHelpers.classCallCheck(this, DomFilter);

		var me = this;
		me._config = config || {};
		me._config.filterTemplate = me._config.filterTemplate || '<div class="element-filter"><input type="text" placeholder="Filter"></div>';
		me._config.input = me._config.input || '.element-filter input';
		me._filterNodes = document.querySelectorAll(me._config.filterNodes);
		me._hideFunction = config.hideFunction || DomFilter._fnHideNodes;
		me._showFunction = config.showFunction || DomFilter._fnShowNodes;
		me._matchFunction = config.matchFunction || DomFilter._fnMatchNode;
		me.createInput();
		me.registerListeners();
	}

	/**
  *
  */


	babelHelpers.createClass(DomFilter, [{
		key: 'registerListeners',
		value: function registerListeners() {
			var me = this;
			me._input.addEventListener('keypress', function (e) {
				return me._onFilterChange(e);
			});
			me._input.addEventListener('change', function (e) {
				return me._onFilterChange(e);
			});
			me._input.addEventListener('input', function (e) {
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
			    searchText = typeof me._input.value !== 'undefined' ? me._input.value.trim() : me._input.innerText.trim();
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
		key: 'createInput',
		value: function createInput() {
			var me = this,
			    filterContainer = DomFilter._createNodes(me._config.filterTemplate),
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

			me._input = filterContainer.querySelector(me._config.input);
		}

		/**
   *
   * @param insertNode
   * @param afterNode
   * @private
   */

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
				afterNode.parentNode.insertBefore(insertNode, afterNode.nextSibling);
			} else {
				afterNode.parentNode.appendChild(insertNode);
			}
		}

		/**
   *
   * @param html
   * @returns {*|Node}
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