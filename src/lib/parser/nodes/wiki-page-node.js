import { WikiNode } from './wiki-node';
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
}

