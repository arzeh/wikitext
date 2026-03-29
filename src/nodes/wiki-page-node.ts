import { WikiNode, WikiNodeList } from './wiki-node';
import { WikiTagNode } from './wiki-tag-node';
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

  public sliceReferences(): WikiNodeList {
    let insideRef: boolean = false;
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

  public *templates(): Generator<WikiTemplateNode, void, unknown> {
    for (const node of this) {
      if (node instanceof WikiTemplateNode) yield node;
    }
  }
}

