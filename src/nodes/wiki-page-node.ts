import { WikiNode } from './wiki-node';
import { WikiTemplateNode } from './wiki-template-node';

export class WikiPageNode extends WikiNode {
  public readonly type = 'page';

  public findTemplate(name: string | RegExp): WikiTemplateNode | null {
    for (const template of this.templates()) {
      const templateName = template.name.toString().trim().replace(/_/g, ' ');

      if (templateName.match(name)) return template;
    }

    return null;
  }

  public findTemplates(name: string | RegExp): WikiTemplateNode[] {
    const templates: WikiTemplateNode[] = [];

    for (const template of this.templates()) {
      const templateName = template.name.toString().trim();

      if (templateName.match(name)) templates.push(template);
    }

    return templates;
  }

  public *templates(): Generator<WikiTemplateNode, void, unknown> {
    for (const node of this) {
      if (node instanceof WikiTemplateNode) yield node;
    }
  }
}

