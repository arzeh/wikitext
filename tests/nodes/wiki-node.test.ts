import { WikiPageNode, WikiTemplateNode, WikiTemplateParameterNode, WikiTextNode, parse } from '../../src/main.js';
import { describe, expect, it } from 'vitest';

describe('wiki node', () => {
  it('iterator', () => {
    const input = '{{template|value}}text';
    const page = parse(input);

    const nodes = [...page];
    expect(nodes.length).toStrictEqual(6);
    expect(nodes[0]).toBeInstanceOf(WikiPageNode);
    expect(nodes[1]).toBeInstanceOf(WikiTemplateNode);
    expect(nodes[2]).toBeInstanceOf(WikiTextNode);
    expect(nodes[3]).toBeInstanceOf(WikiTemplateParameterNode);
    expect(nodes[4]).toBeInstanceOf(WikiTextNode);
    expect(nodes[5]).toBeInstanceOf(WikiTextNode);
  });
});
