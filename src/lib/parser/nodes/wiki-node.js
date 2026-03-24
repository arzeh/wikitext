/**
 * @abstract
 */
export class WikiNode {
  /**
   * @abstract
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type;

  /**
   * @type {WikiNodeList}
   * @since 1.0.0
   */
  children = new WikiNodeList(); // eslint-disable-line no-use-before-define

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
    return this.children.toString();
  }

  /**
   * @returns {Generator<WikiNode, void, unknown>}
   * @since 1.0.0
   */
  *[Symbol.iterator]() {
    yield this;
    for (const node of this.children) {
      yield* node;
    }
  }
}

/**
 * @extends {Array<WikiNode>}
 */
export class WikiNodeList extends Array {
  /**
   * @returns {string}
   * @since 1.0.0
   */
  toString() {
    return this.map(i => i.toString()).join('');
  }
}

