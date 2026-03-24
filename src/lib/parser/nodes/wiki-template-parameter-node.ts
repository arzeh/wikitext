import { WikiNode, WikiNodeList } from './wiki-node';

export class WikiTemplateParameterNode extends WikiNode {
  public readonly type ='template parameter';
  public name = new WikiNodeList();

  public becomeNamed() {
    [this.name, this.children] = [this.children, this.name];
  }

  public isNamed(): boolean {
    return this.name.length > 0;
  }

  public isUnnamed(): boolean {
    return this.name.length === 0;
  }

  public toString(): string {
    if (this.name.length) {
      return `${this.name.toString()}=${this.children.toString()}`;
    } else {
      return this.children.toString();
    }
  }

  public *[Symbol.iterator]() {
    yield this;
    for (const node of this.name) yield* node;
    for (const node of this.children) yield* node;
  }
}

