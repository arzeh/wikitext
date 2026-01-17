import { WikiNode } from './wiki-node';

export class WikiSectionNode extends WikiNode {
  public level: number = 0;
  public readonly type = 'header';

  public push(node: WikiNode): void {
    this.children.push(node);
  }

  public toString(): string {
    const level = ''.padStart(this.level, '=');
    return `${ level }${ this.children.toString() }${ level }`;
  }
}
