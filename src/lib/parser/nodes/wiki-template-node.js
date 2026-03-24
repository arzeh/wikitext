import { WikiNode, WikiNodeList } from './wiki-node';
import { WikiTemplateParameterNode } from './wiki-template-parameter-node';
import { WikiTextNode } from './wiki-text-node';

export class WikiTemplateNode extends WikiNode {
  /**
   * @type {WikiNodeList}
   * @since 1.0.0
   */
  name = new WikiNodeList();

  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'template';

  /**
   * @type {Record<string, WikiTemplateParameterNode>}
   * @since 1.0.0
   */
  #parameters = {};

  /**
   * @type {'name' | 'parameters'}
   * @since 1.0.0
   */
  #state = 'name';

  /**
   * @returns {'name' | 'parameters'}
   * @since 1.0.0
   */
  get state() { return this.#state; }

  /**
   * @param {'name' | 'parameters'} value
   * @since 1.0.0
   */
  set state(value) {
    this.#state = value;
  }

  /**
   * @returns {WikiTemplateParameterNode[]}
   * @since 1.0.0
   */
  namedParameters() {
    return this.children.filter(
      /**
       * @param {WikiNode} p
       * @returns {p is WikiTemplateParameterNode}
       */
      p => p instanceof WikiTemplateParameterNode && p.isNamed());
  }

  /**
   * @returns {WikiTemplateParameterNode[]}
   * @since 1.0.0
   */
  unnamedParameters() {
    return this.children.filter(
      /**
       * @param {WikiNode} p
       * @returns {p is WikiTemplateParameterNode}
       */
      p => p instanceof WikiTemplateParameterNode && p.isUnnamed());
  }

  /**
   * @param {string | number} name
   * @returns {WikiTemplateParameterNode | undefined}
   * @since 1.0.0
   */
  get(name) {
    return this.#parameters[name.toString()];
  }

  /**
   * @param {string | number} name
   * @param {string} value
   * @returns {void}
   * @since 1.0.0
   */
  set(name, value) {
    let parameter = this.get(name);
    if (parameter) {
      parameter.children = new WikiNodeList(new WikiTextNode(value));
      return;
    }

    parameter = new WikiTemplateParameterNode();
    this.children.push(parameter);
    parameter.children.push(new WikiTextNode(value));
    this.#parameters[name.toString().trim()] = parameter;

    if (typeof name === 'string') {
      parameter.name.push(new WikiTextNode(name));
      return;
    }

    if (name !== this.unnamedParameters().length + 1) {
      parameter.name.push(new WikiTextNode(name.toString()));
    }
  }

  /**
   * @description Store the canonical name of each parameter, both named and unnamed.
   * @returns {void}
   * @since 1.0.0
   */
  purge() {
    for (const node of this.namedParameters()) {
      this.#parameters[node.name.toString().trim()] = node;
    }

    let unnamedIndex = 1;
    for (const node of this.unnamedParameters()) {
      for (unnamedIndex; this.#parameters[unnamedIndex.toString()]; unnamedIndex++);
      this.#parameters[unnamedIndex.toString()] = node;
    }
  }

  /**
   * @param {WikiNode} node
   * @returns {void}
   * @since 1.0.0
   */
  push(node) {
    if (this.state === 'name') {
      this.name.push(node);
    } else if (this.state === 'parameters') {
      this.children.push(node);
    }
  }

  /**
   * @returns {string}
   * @since 1.0.0
   */
  toString() {
    const parameters = this.children.map(i => `|${i.toString()}`).join('');
    return `{{${this.name.toString()}${parameters}}}`;
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
