import { WikiNode, WikiNodeList } from './wiki-node';

export class WikiInternalLinkNode extends WikiNode {
  public target = new WikiNodeList();
  public readonly type = 'internal link';

  #state: 'target' | 'display' = 'target';

  public get state() { return this.#state; }
  public set state(value: 'target' | 'display') {
    this.#state = value;
  }

  public push(node: WikiNode): void {
    if (this.#state === 'target') {
      this.target.push(node);
    } else if (this.#state === 'display') {
      this.children.push(node);
    }
  }

  public toString(): string {
    if (this.children.length > 0) {
      return `[[${this.target.toString()}|${this.children.toString()}]]`;
    } else {
      return `[[${this.target.toString()}]]`;
    }
  }

  public *[Symbol.iterator]() {
    yield this;

    for (const node of this.target) {
      yield* node;
    }

    for (const node of this.children) {
      yield* node;
    }
  }
}

