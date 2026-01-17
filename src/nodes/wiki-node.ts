export abstract class WikiNode {
  public abstract readonly type: string;
  public children = new WikiNodeList(); // eslint-disable-line no-use-before-define

  public push(node: WikiNode) {
    this.children.push(node);
  }

  public toString(): string {
    return this.children.toString();
  }

  public *[Symbol.iterator](): Generator<WikiNode, void, unknown> {
    yield this;
    for (const node of this.children) {
      yield* node;
    }
  }
}

export class WikiNodeList extends Array<WikiNode> {
  public toString(): string {
    return this.map(i => i.toString()).join('');
  }
}

