import { WikiNode } from './wiki-node';

export class WikiTagNode extends WikiNode {
  public name: string | undefined = undefined;
  public type = 'tag';

  public override push(node: WikiNode): void {
    if (this.children.length === 0) {
      this.name = node.toString().split(' ').at(0)?.replace('/', '');
    }

    super.push(node);
  }

  public isClosing(): boolean {
    return this.children.at(0)?.toString().startsWith('/') || false;
  }

  public isSelfClosing(): boolean {
    return this.children.at(-1)?.toString().endsWith('/') || false;
  }

  public toString(): string {
    return `<${this.children.toString()}>`;
  }
}

