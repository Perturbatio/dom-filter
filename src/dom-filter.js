/**
 *
 */
class DomFilter {
	/**
	 *
	 * @returns {Object}
	 */
	get strings() {
		var me = this;
		if ( typeof me._strings === 'undefined' ) {
			me._strings = DomFilter._getDefaultLangStrings();
		}
		return me._strings;
	}

	/**
	 *
	 * @param {Object} value
	 */
	set strings( value ) {
		this._strings = value;
	}

	/**
	 *
	 * @returns {string}
	 */
	get defaultLanguage() {
		var me = this;
		if ( typeof me._defaultLang !== 'string' ) {
			me._defaultLang = 'en';
		}
		return me._defaultLang || '';
	}

	/**
	 *
	 * @param {string} value
	 */
	set defaultLanguage( value ) {
		if ( typeof value === 'string' ) {
			this._defaultLang = value;
		}
	}

	/**
	 *
	 * @returns {Element}
	 */
	get feedbackElement() {
		return this.filterContainer.querySelector(this._config.feedbackElement);
	}

	/**
	 *
	 * @param {string|Element} value
	 */
	set feedbackElement( value ) {
		this._config.feedbackElement = value;
	}

	/**
	 * Get the default language strings for the class
	 *
	 * @returns {Object}
	 * @private
	 */
	static _getDefaultLangStrings() {
		return {
			'en': {
				'feedback': {
					'no_results'              : 'No results',
					'default_feedback_message': ''
				},
				'input'   : {
					'placeholder': 'Filter',
					'label'      : 'Filter this list:'
				}
			}
		};
	}

	/**
	 * Return all strings for a given language
	 *
	 * @param {String} lang defaults to 'en'
	 * @returns {*}
	 */
	getLangStrings( lang ) {
		var me = this;
		lang = lang || 'en';
		if ( typeof lang !== 'string' || !me.strings.hasOwnProperty(lang) ) {
			return {};
		}
		return me.strings[lang];
	}

	/**
	 *
	 * @param {Object} config
	 */
	constructor( config ) {
		var me = this;

		me._config = config || {};
		me._initialConfig = me._config;
		if (typeof me._config.strings !== 'undefined'){
			me.strings = me._config.strings;
		}

		me._config.feedbackElement = me._config.feedbackElement || '.feedback';
		me._config.containerClass = me._config.containerClass || 'element-filter';

		me._config.filterTemplate = me._config.filterTemplate || '<div class="' + me._config.containerClass + '">' +
			'<label>{{input.label}}<input type="text" placeholder="{{input.placeholder}}"></label>' +
			'<div class="feedback"></div>' +
			'</div>';
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
	registerListeners() {
		var me = this;
		me.inputElement.addEventListener('keypress', ( e ) => me._onFilterChange(e));
		me.inputElement.addEventListener('change', ( e ) => me._onFilterChange(e));
		me.inputElement.addEventListener('input', ( e ) => me._onFilterChange(e));
	}

	/**
	 * The default method of showing a node
	 * removes aria-hidden attribute to each
	 *
	 * @param nodes
	 * @private
	 */
	static _fnShowNodes( nodes ) {
		[].forEach.call(nodes, function ( node ) {
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
	static _fnHideNodes( nodes ) {
		[].forEach.call(nodes, function ( node ) {
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
	static _fnMatchNode( node, searchText ) {
		searchText = searchText.toLocaleLowerCase();
		return node.innerText.toLocaleLowerCase().indexOf(searchText) > -1;
	}


	/**
	 *
	 * @param {Event} e
	 * @private
	 */
	_onFilterChange( e ) {
		var me = this,
			searchText = (typeof me.inputElement.value !== 'undefined') ? me.inputElement.value.trim() : me.inputElement.innerText.trim();
		me._showFunction(me._filterNodes);
		this.filter(searchText);

	}

	/**
	 * filter the nodes using the provided searchText
	 *
	 * @param {String} searchText
	 */
	filter( searchText ) {
		var me = this,
			matchedNodes,
			unmatchedNodes;

		if ( searchText.length > 0 ) {
			matchedNodes = [].filter.call(me._filterNodes, ( node ) => me._matchFunction(node, searchText));
			unmatchedNodes = me._getUnmatchedNodes(me._filterNodes, matchedNodes);
			me._showFunction(matchedNodes);
			me._hideFunction(unmatchedNodes);
			if ( matchedNodes.length < 1 ) {
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
	feedback( text ) {
		if (typeof this.feedbackElement !== 'undefined' && this.feedbackElement) {
			this.feedbackElement.innerHTML = text;
		}
	}

	_getUnmatchedNodes( nodes, matchedNodes ) {
		var result = [];
		[].forEach.call(nodes, function ( node ) {
			if ( ![].find.call(matchedNodes, function ( matchedNode ) {
					return matchedNode === node;
				}) ) {
				result.push(node);
			}
		});
		return result;
	}

	/**
	 *
	 */
	createFilterElement() {
		var me = this,
			filterContainer = DomFilter._createNodes(me.replaceStrings(me._config.filterTemplate, me.getLangStrings())),
			appendToNode,
			beforeNode,
			afterNode;


		if ( typeof me._config.insertBefore !== 'undefined' ) {
			beforeNode = document.querySelector(me._config.insertBefore);
			beforeNode.parentNode.insertBefore(filterContainer, beforeNode);
		} else if ( typeof me._config.insertAfter !== 'undefined' ) {
			afterNode = document.querySelector(me._config.insertAfter);
			DomFilter._insertAfter(filterContainer, afterNode);
		} else if ( typeof me._config.appendTo !== 'undefined' ) {
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
	static _insertAfter( insertNode, afterNode ) {
		var nextNode = afterNode.nextSibling;
		if ( typeof nextNode !== 'undefined' ) {
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
	static _createNodes( html ) {
		var template = document.createElement('template');
		template.innerHTML = html;
		return template.content.firstChild;
	}

	/**
	 *
	 * @param {string} filterTemplate
	 * @param {object} strings
	 * @returns {string}
	 */
	replaceStrings( filterTemplate, strings ) {
		filterTemplate = filterTemplate || '';

		var regex = /({{([A-Za-z]+[A-Za-z0-9]*?(\.(?=[A-Za-z])){0,1})+}})/ig;
		return filterTemplate.replace(regex, function ( match ) {

			match = match.replace('{{', '').replace('}}', '');//ugly hack because I need to work on my regexes

			return match.split('.').reduce(function ( a, b ) {
				return a[b];
			}, strings);
		});

	}
}
