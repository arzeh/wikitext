import { WikiNode, WikiNodeList } from './wiki-node';

export class WikiTemplateParameterNode extends WikiNode {
  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'template parameter';

  /**
   * @type {WikiNodeList}
   * @since 1.0.0
   */
  name = new WikiNodeList();

  /**
   * @returns {void}
   * @since 1.0.0
   */
  becomeNamed() {
    [this.name, this.children] = [this.children, this.name];
  }

  /**
   * @returns {boolean}
   * @since 1.0.0
   */
  isNamed() {
    return this.name.length > 0;
  }

  /**
   * @returns {boolean}
   * @since 1.0.0
   */
  isUnnamed() {
    return this.name.length === 0;
  }

  /**
   * @returns {string}
   * @since 1.0.0
   */
  toString() {
    if (this.name.length) {
      return `${this.name.toString()}=${this.children.toString()}`;
    } else {
      return this.children.toString();
    }
  }

  /**
   * @returns {Generator<WikiNode, void, unknown>}
   * @since 1.0.0
   */
  *[Symbol.iterator]() {
    yield this;
    for (const node of this.name) yield* node;
    for (const node of this.children) yield* node;
  }
}

