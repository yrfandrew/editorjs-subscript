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
    return '<svg width="20" height="20"><path d="M13.605 3.564l-5.143 5.143 5.143 5.143-1.58 1.58-5.143-5.143-5.143 5.143-1.58-1.58 5.143-5.143-5.143-5.143 1.58-1.58 5.143 5.143 5.143-5.143 1.58 1.58zM20.16 18.824h-5.468v-1.12l0.997-0.896c0.852-0.728 1.479-1.333 1.905-1.826 0.415-0.493 0.627-0.952 0.639-1.389 0.011-0.314-0.090-0.571-0.303-0.784-0.202-0.179-0.527-0.314-0.964-0.314-0.347 0-0.65 0.067-0.941 0.202l-0.739 0.426-0.504-1.311c0.303-0.235 0.661-0.437 1.098-0.594s0.919-0.269 1.445-0.269c0.874 0.045 1.546 0.28 1.994 0.739s0.695 1.042 0.695 1.759c-0.011 0.627-0.213 1.21-0.605 1.737-0.381 0.527-0.852 1.031-1.423 1.524l-0.717 0.583v0.022h2.891v1.513z"></path></svg>'
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
