'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 *
 */

var DomFilter = function () {
	/**
  *
  * @param config
  */

	function DomFilter(config) {
		_classCallCheck(this, DomFilter);

		var me = this;
		me._config = config || {};
		me._config.filterTemplate = me._config.filterTemplate || '<div class="element-filter"><input type="text" placeholder="Filter menu"></div>';
		me._config.input = me._config.input || '.element-filter input';
		me._filterNodes = document.querySelectorAll(me._config.filterNodes);
		me._hideFunction = config.hideFunction || me._fnHideUnmatched;
		me._showFunction = config.showFunction || me._fnShowUnmatched;
		me._matchFunction = config.matchFunction || me._fnMatchNode;
		me._unmatchFunction = config.unmatchFunction || me._fnUnmatchNode;
		me.createInput();
		me.registerListeners();
	}

	/**
  *
  */


	_createClass(DomFilter, [{
		key: 'registerListeners',
		value: function registerListeners() {
			var me = this;
			me._input.addEventListener('keyup', function (e) {
				return me._filterChange(e);
			});
		}

		/**
   *
   * @param nodes
   * @private
   */

	}, {
		key: '_fnShowUnmatched',
		value: function _fnShowUnmatched(nodes) {
			[].forEach.call(nodes, function (node) {
				node.removeAttribute('aria-hidden');
			});
		}

		/**
   *
   * @param nodes
   * @private
   */

	}, {
		key: '_fnHideUnmatched',
		value: function _fnHideUnmatched(nodes) {
			[].forEach.call(nodes, function (node) {
				node.setAttribute('aria-hidden', true);
			});
		}

		/**
   *
   * @param node
   * @returns {boolean}
   * @private
   */

	}, {
		key: '_fnMatchNode',
		value: function _fnMatchNode(node, searchText) {
			searchText = searchText.toLocaleLowerCase();
			return node.innerText.toLocaleLowerCase().indexOf(searchText) > -1;
		}

		/**
   *
   * @param node
   * @returns {boolean}
   * @private
   */

	}, {
		key: '_fnUnmatchNode',
		value: function _fnUnmatchNode(node, searchText) {
			searchText = searchText.toLocaleLowerCase();
			return node.innerText.toLocaleLowerCase().indexOf(searchText) < 0;
		}

		/**
   *
   * @param {Event} e
   * @private
   */

	}, {
		key: '_filterChange',
		value: function _filterChange(e) {
			var me = this,
			    searchText = me._input.value.trim(),
			    matchedNodes,
			    unmatchedNodes;
			me._showFunction(me._filterNodes);

			if (searchText.length > 0) {
				matchedNodes = [].filter.call(me._filterNodes, function (node) {
					return me._matchFunction(node, searchText);
				});
				unmatchedNodes = [].filter.call(me._filterNodes, function (node) {
					return me._unmatchFunction(node, searchText);
				});
				me._showFunction(matchedNodes);
				me._hideFunction(unmatchedNodes);
			}
		}

		/**
   *
   */

	}, {
		key: 'createInput',
		value: function createInput() {
			var me = this,
			    filterContainer = DomFilter._createNodes(me._config.filterTemplate);

			if (typeof me._config.insertBefore === 'string') {
				var beforeNode = document.querySelector(me._config.insertBefore);
				beforeNode.parentNode.insertBefore(filterContainer, beforeNode);
			} else if (typeof me._config.insertAfter === 'string') {
				var afterNode = document.querySelector(me._config.insertAfter);
				DomFilter._insertAfter(filterContainer, afterNode);
			}

			me._input = filterContainer.querySelector(me._config.input);
		}
	}], [{
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