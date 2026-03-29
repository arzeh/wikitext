import { WikiNode, WikiNodeList } from './wiki-node';
import { WikiTagNode } from './wiki-tag-node';
import { WikiTemplateNode } from './wiki-template-node';

export class WikiPageNode extends WikiNode {
  /**
   * @readonly
   * @type {string}
   * @since 1.0.0
   */
  type = 'page';

  /**
   * @param {string | RegExp} name
   * @returns {WikiTemplateNode | null}
   * @since 1.0.0
   */
  findTemplate(name) {
    for (const template of this.templates()) {
      const templateName = template.name.toString().trim().replace(/_/g, ' ');

      if (templateName.match(name)) return template;
    }

    return null;
  }

  /**
   * @param {string | RegExp} name
   * @returns {WikiTemplateNode[]}
   * @since 1.0.0
   */
  findTemplates(name) {
    /** @type {WikiTemplateNode[]} */
    const templates = [];

    for (const template of this.templates()) {
      const templateName = template.name.toString().trim();

      if (templateName.match(name)) templates.push(template);
    }

    return templates;
  }

  /**
   * @returns {Generator<WikiTemplateNode, void, unknown>}
   * @since 1.0.0
   */
  *templates() {
    for (const node of this) {
      if (node instanceof WikiTemplateNode) yield node;
    }
  }

  /**
   * @returns {WikiNodeList}
   * @since 1.0.0
   */
  sliceReferences() {
    let insideRef = false;
    const nodes = new WikiNodeList();

    // when iterating a tag node, it will yield nodes for whatever was
    // within `<` and `>`, which includes the tag's name and html attributes.
    let skipCount = 0;
    for (const token of this) {
      if (skipCount > 0) {
        skipCount--;
        continue;
      }

      if (insideRef) {
        if (token instanceof WikiTagNode && token.isClosing()) {
          insideRef = false;
          nodes.push(token);
          continue;
        } else {
          nodes.push(token);
        }
      } else {
        if (token instanceof WikiTagNode && !token.isSelfClosing()) {
          insideRef = true;
          skipCount = token.children.length;
          nodes.push(token);
        }
      }
    }

    return nodes;
  }
}

