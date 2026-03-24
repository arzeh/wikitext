import { Tokenizer } from './tokenizer';
import { WikiInternalLinkNode } from './nodes/wiki-internal-link-node';
import { WikiPageNode } from './nodes/wiki-page-node';
import { WikiSectionNode } from './nodes/wiki-section-node';
import { WikiTemplateNode } from './nodes/wiki-template-node';
import { WikiTemplateParameterNode } from './nodes/wiki-template-parameter-node';
import { WikiTextNode } from './nodes/wiki-text-node';

/** @enum {string} */
const State = Object.freeze({
  HEADER: 'HEADER',
  INTERNAL_LINK: 'INTERNAL_LINK',
  TEMPLATE: 'TEMPLATE',
  TEMPLATE_PARAMETER: 'TEMPLATE_PARAMETER',
});

/**
 * @typedef {Object} ParseOptions
 * @property {boolean} [paranoid]
 */

/**
 * @param {string} input
 * @param {ParseOptions} options
 */
export function parse(input, options = {}) {
  const { paranoid = true } = options;

  const tokens = new Tokenizer(input).tokenize();
  const root = new WikiPageNode();
  /** @type {import('./nodes/wiki-node.js').WikiNode[]} */
  const path = [root];
  /** @type {State[]} */
  const states = [];

  while (tokens.length) {
    const token = tokens.shift();
    const currentParent = path.at(-1);
    const state = states.at(-1);

    // this should never be the case
    if (!token || !currentParent) continue;

    if (token.type === 'INTERNAL_LINK_START') {
      const node = new WikiInternalLinkNode();
      currentParent.push(node);
      path.push(node);
      states.push(State.INTERNAL_LINK);

    } else if (state === State.INTERNAL_LINK && token.type === 'INTERNAL_LINK_DELIMITER' && currentParent instanceof WikiInternalLinkNode && currentParent.state === 'target') {
      currentParent.state = 'display';

    } else if (state === State.INTERNAL_LINK && token.type === 'INTERNAL_LINK_END') {
      path.pop();
      states.pop();

    } else if (token.type === 'TEMPLATE_START') {
      const node = new WikiTemplateNode();
      currentParent.push(node);
      path.push(node);
      states.push(State.TEMPLATE);

    } else if (state === State.TEMPLATE && token.type === 'TEMPLATE_PARAMETER_DELIMITER') {
      if (!(currentParent instanceof WikiTemplateNode)) {
        throw new Error(`Expected current parent to be a template, but found: ${currentParent.type};`);
      }

      currentParent.state = 'parameters';
      const node = new WikiTemplateParameterNode();
      currentParent.push(node);
      path.push(node);
      states.push(State.TEMPLATE_PARAMETER);

    } else if ((state === State.TEMPLATE || state === State.TEMPLATE_PARAMETER) && token.type === 'TEMPLATE_END') {
      /** @type {WikiTemplateNode | undefined} */
      let template = undefined;
      while (states.length && states.pop() !== State.TEMPLATE);
      while (path.length) {
        const lastNode = path.pop();
        if (lastNode instanceof WikiTemplateNode) {
          template = lastNode;
          break;
        }
      }

      template?.purge();

    } else if (state === State.TEMPLATE_PARAMETER && token.type === 'TEMPLATE_PARAMETER_DELIMITER') {
      path.pop();
      const template = path.at(-1);
      if (!(template instanceof WikiTemplateNode)) {
        throw new Error(`Expected current parent to be a template, but found: ${currentParent.type};`);
      }

      const node = new WikiTemplateParameterNode();
      template.push(node);
      path.push(node);

    } else if (state === State.TEMPLATE_PARAMETER && token.type === 'TEMPLATE_PARAMETER_ASSIGNS') {
      if (!(currentParent instanceof WikiTemplateParameterNode)) {
        throw new Error(`Expected current parent to be a template parameter, but found: ${currentParent.type};`);
      }

      currentParent.becomeNamed();

    } else if (token.type === 'HEADER_START') {
      const section = new WikiSectionNode();
      section.level = token.level;
      currentParent.push(section);
      path.push(section);
      states.push(State.HEADER);

    } else if (state === State.HEADER && token.type === 'HEADER_END') {
      if (!(currentParent instanceof WikiSectionNode)) {
        throw new Error(`Expected current parent to be a section, but found: ${currentParent.type};`);
      }

      if (currentParent.level !== token.level) {
        throw new Error(`Expected to close level ${currentParent.level} header, but found level ${token.level}`);
      }

      path.pop();
      states.pop();

    } else if (token.type === 'TEXT' || token.type === 'HEADER_NEW_LINE') {
      currentParent.push(new WikiTextNode(token.value));

    // Not implemented
    } else if (token.type === 'HTML_COMMENT_START') {
      currentParent.push(new WikiTextNode('<!--'));

    } else if (token.type === 'HTML_COMMENT_END') {
      currentParent.push(new WikiTextNode('-->'));

    } else if (token.type === 'TAG_START') {
      currentParent.push(new WikiTextNode('<'));

    } else if (token.type === 'TAG_END') {
      currentParent.push(new WikiTextNode('>'));

    } else if (token.type === 'TAG_CLOSING') {
      currentParent.push(new WikiTextNode('</'));

    }
  }

  if (paranoid && input !== root.toString()) {
    throw new SyntaxError('The parsed tree does not match the input text.');
  }

  return root;
}
