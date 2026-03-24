import { WikiNode } from './wiki-node';

export class WikiSectionNode extends WikiNode {
  /**
   * @type {number}
   * @since 1.0.0
   */
  level = 0;
  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'header';

  /**
   * @param {WikiNode} node
   * @returns {void}
   * @since 1.0.0
   */
  push(node) {
    this.children.push(node);
  }

  /**
   * @returns {string}
   * @since 1.0.0
   */
  toString() {
    const level = ''.padStart(this.level, '=');
    return `${ level }${ this.children.toString() }${ level }`;
  }
}
