import { describe, expect, it } from 'vitest';
import { parse } from '../../src/parser';
import { WikiInternalLinkNode } from '../../src/nodes/wiki-internal-link-node';

describe('template node', () => {
  it('empty template', ({ task }) => {
    const input = '[[File:Example.jpg|thumb|text]]'
    const page = parse(input);
    const template = page.children.at(0) as WikiInternalLinkNode;

    expect(page.toString()).toStrictEqual(input)
  })
});
