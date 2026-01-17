import { WikiNode, WikiNodeList } from './wiki-node';
import { WikiTemplateParameterNode } from './wiki-template-parameter-node';
import { WikiTextNode } from './wiki-text-node';

export class WikiTemplateNode extends WikiNode {
  public name = new WikiNodeList();
  public readonly type = 'template';

  #parameters: Record<string, WikiTemplateParameterNode> = {};
  #state: 'name' | 'parameters' = 'name';

  public get state() { return this.#state; }
  public set state(value: 'name' | 'parameters') {
    this.#state = value;
  }

  public namedParameters(): WikiTemplateParameterNode[] {
    return this.children.filter(p => {
      return p instanceof WikiTemplateParameterNode && p.isNamed();
    }) as WikiTemplateParameterNode[];
  }

  public unnamedParameters(): WikiTemplateParameterNode[] {
    return this.children.filter(p => {
      return p instanceof WikiTemplateParameterNode && p.isUnnamed();
    }) as WikiTemplateParameterNode[];
  }

  public get(name: string | number): WikiTemplateParameterNode | undefined {
    return this.#parameters[name.toString()];
  }

  public set(name: string | number, value: string) {
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

  public purge() {
    for (const node of this.namedParameters()) {
      this.#parameters[node.name.toString().trim()] = node;
    }

    let unnamedIndex = 1;
    for (const node of this.unnamedParameters()) {
      for (unnamedIndex; this.#parameters[unnamedIndex.toString()]; unnamedIndex++);
      this.#parameters[unnamedIndex.toString()] = node;
    }
  }

  public push(node: WikiNode): void {
    if (this.state === 'name') {
      this.name.push(node);
    } else if (this.state === 'parameters') {
      this.children.push(node);
    }
  }

  public toString(): string {
    const parameters = this.children.map(i => `|${i.toString()}`).join('');
    return `{{${this.name.toString()}${parameters}}}`;
  }

  public *[Symbol.iterator]() {
    yield this;
    for (const node of this.name) yield* node;
    for (const node of this.children) yield* node;
  }
}
