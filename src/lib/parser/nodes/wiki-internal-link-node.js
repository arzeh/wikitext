import { WikiNode, WikiNodeList } from './wiki-node';

export class WikiInternalLinkNode extends WikiNode {
  /**
   * @type {WikiNodeList}
   * @since 1.0.0
   */
  target = new WikiNodeList();

  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'internal link';

  /**
   * @type {'target' | 'display'}
   * @since 1.0.0
   */
  #state = 'target';

  /**
   * @returns {'target' | 'display'}
   * @since 1.0.0
   */
  get state() { return this.#state; }

  /**
   * @param {'target' | 'display'} value
   * @since 1.0.0
   */
  set state(value) {
    this.#state = value;
  }

  /**
   * @param {WikiNode} node
   * @returns {void}
   * @since 1.0.0
   */
  push(node) {
    if (this.#state === 'target') {
      this.target.push(node);
    } else if (this.#state === 'display') {
      this.children.push(node);
    }
  }

  /**
   * @returns {string}
   * @since 1.0.0
   */
  toString() {
    if (this.children.length > 0) {
      return `[[${this.target.toString()}|${this.children.toString()}]]`;
    } else {
      return `[[${this.target.toString()}]]`;
    }
  }

  /**
   * @returns {Generator<WikiNode, void, unknown>}
   * @since 1.0.0
   */
  *[Symbol.iterator]() {
    yield this;

    for (const node of this.target) {
      yield* node;
    }

    for (const node of this.children) {
      yield* node;
    }
  }
}

