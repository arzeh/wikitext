import { WikiNode } from './wiki-node';

export class WikiTextNode extends WikiNode {
  public readonly type = 'text';
  public value: string;

  public constructor(value: string) {
    super();
    this.value = value;
  }

  public push(): void { // eslint-disable-line class-methods-use-this
    throw new Error('Text nodes can not have children');
  }

  public toString(): string {
    return this.value;
  }

  public *[Symbol.iterator]() {
    yield this;
  }
}

