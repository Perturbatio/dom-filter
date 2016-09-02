/**
 *
 */
class DomFilter {
	/**
	 *
	 * @param config
	 */
	constructor( config ) {
		var me = this;
		me._config = config || {};
		me._config.filterTemplate = me._config.filterTemplate || '<div class="element-filter"><input type="text" placeholder="Filter"></div>';
		me._config.input = me._config.input || '.element-filter input';
		me._filterNodes = document.querySelectorAll(me._config.filterNodes);
		me._hideFunction = config.hideFunction || me._fnHideUnmatched;
		me._showFunction = config.showFunction || me._fnShowUnmatched;
		me._matchFunction = config.matchFunction || me._fnMatchNode;
		me.createInput();
		me.registerListeners();
	}

	/**
	 *
	 */
	registerListeners() {
		var me = this;
		me._input.addEventListener('keyup', ( e ) => me._filterChange(e));
	}

	/**
	 *
	 * @param nodes
	 * @private
	 */
	_fnShowUnmatched( nodes ) {
		[].forEach.call(nodes, function ( node ) {
			node.removeAttribute('aria-hidden');
		});
	}

	/**
	 *
	 * @param nodes
	 * @private
	 */
	_fnHideUnmatched( nodes ) {
		[].forEach.call(nodes, function ( node ) {
			node.setAttribute('aria-hidden', true);
		});
	}

	/**
	 *
	 * @param node
	 * @returns {boolean}
	 * @private
	 */
	_fnMatchNode( node, searchText ) {
		searchText = searchText.toLocaleLowerCase();
		return node.innerText.toLocaleLowerCase().indexOf(searchText) > -1;
	}


	/**
	 *
	 * @param {Event} e
	 * @private
	 */
	_filterChange( e ) {
		var me = this,
			searchText = me._input.value.trim(),
			matchedNodes,
			unmatchedNodes;
		me._showFunction(me._filterNodes);

		if ( searchText.length > 0 ) {
			matchedNodes = [].filter.call(me._filterNodes, ( node ) => me._matchFunction(node, searchText));
			unmatchedNodes = me._getUnmatchedNodes(me._filterNodes, matchedNodes);
			me._showFunction(matchedNodes);
			me._hideFunction(unmatchedNodes);
		}

	}

	_getUnmatchedNodes(nodes, matchedNodes){
		var result = [];
		[].forEach.call(nodes, function(node){
			if ( ![].find.call(matchedNodes, function(matchedNode){
				return matchedNode  === node;
			}) ){
				result.push(node);
			}
		});
		return result;
	}

	/**
	 *
	 */
	createInput() {
		var me = this,
			filterContainer = DomFilter._createNodes(me._config.filterTemplate),
			appendToNode,
			beforeNode,
			afterNode;


		if ( typeof me._config.insertBefore !== 'undefined' ) {
			beforeNode = document.querySelector(me._config.insertBefore);
			beforeNode.parentNode.insertBefore(filterContainer, beforeNode);
		} else if ( typeof me._config.insertAfter !== 'undefined' ) {
			afterNode = document.querySelector(me._config.insertAfter);
			DomFilter._insertAfter(filterContainer, afterNode);
		} else if ( typeof me._config.appendTo !== 'undefined' ){
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
	static _insertAfter(insertNode, afterNode){
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
	static _createNodes( html ) {
		var template = document.createElement('template');
		template.innerHTML = html;
		return template.content.firstChild;
	}
}
