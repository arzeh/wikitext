import { WikiNode } from './wiki-node';

export class WikiTextNode extends WikiNode {
  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'text';

  /**
   * @type {string}
   */
  value;

  /**
   * @param {string} value
   * @since 1.0.0
   */
  constructor(value) {
    super();
    this.value = value;
  }

  /**
   * @returns void
   * @since 1.0.0
   */
  push() { // eslint-disable-line class-methods-use-this
    throw new Error('Text nodes can not have children');
  }

  /**
   * @returns string
   * @since 1.0.0
   */
  toString() {
    return this.value;
  }

  /**
   * @returns {Generator<WikiTextNode, void, unknown>}
   * @since 1.0.0
   */
  *[Symbol.iterator]() {
    yield this;
  }
}

