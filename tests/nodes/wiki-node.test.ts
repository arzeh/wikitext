import { describe, expect, it } from 'vitest';
import { parse } from '../../src/parser';
import { WikiTemplateNode } from '../../src/nodes/wiki-template-node';
import { WikiPageNode } from '../../src/nodes/wiki-page-node';
import { WikiTextNode } from '../../src/nodes/wiki-text-node';
import { WikiTemplateParameterNode } from '../../src/nodes/wiki-template-parameter-node';

describe('wiki node', () => {
  it('iterator', () => {
    const input = '{{template|value}}text'
    const page = parse(input);

    const nodes = [...page]
    expect(nodes.length).toStrictEqual(6);
    expect(nodes[0]).toBeInstanceOf(WikiPageNode)
    expect(nodes[1]).toBeInstanceOf(WikiTemplateNode)
    expect(nodes[2]).toBeInstanceOf(WikiTextNode)
    expect(nodes[3]).toBeInstanceOf(WikiTemplateParameterNode)
    expect(nodes[4]).toBeInstanceOf(WikiTextNode)
    expect(nodes[5]).toBeInstanceOf(WikiTextNode)
  })
});
