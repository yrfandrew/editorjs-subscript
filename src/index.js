/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Subscript Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class Subscript {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {};

  /**
   * @param {{api: object}}  - Editor.js API
   */
  constructor({api}) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'SUB';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, Subscript.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let sub = document.createElement(this.tag);

    sub.classList.add(Subscript.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(sub);
     */
    sub.appendChild(range.extractContents());
    range.insertNode(sub);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(sub);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, Subscript.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="16" height="16"> <path d="M2.389 1.1l4.23 5.113 4.23-5.113h2.239l-5.349 6.466 5.349 6.471h-2.234l-4.235-5.118-4.235 5.118h-2.234v-0.005l5.349-6.466-5.349-6.466h2.239zM16.149 11.95c0.132-0.126 0.215-0.304 0.215-0.5 0-0.381-0.309-0.69-0.69-0.69s-0.69 0.309-0.69 0.69c0 0.068 0.010 0.133 0.028 0.195l-0.001-0.005-0.996 0.285c-0.042-0.142-0.066-0.305-0.066-0.474 0-0.953 0.773-1.726 1.726-1.726 0 0 0 0 0.001 0h-0c0.953 0 1.725 0.772 1.725 1.725 0 0.494-0.207 0.939-0.54 1.253l-0.001 0.001-1.405 1.333h1.946v0.863h-3.45v-0.863l2.199-2.087z"></path> </svg>'
  }

  /**
   * Sanitizer rule
   * @return {{sub: {class: string}}}
   */
  static get sanitize() {
    return {
      sub: {
        class: Subscript.CSS
      }
    };
  }
}

module.exports = Subscript;
