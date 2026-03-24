import { describe, expect, it } from 'vitest';
import { parse } from '../../src';

describe('template node', () => {
  it('empty template', () => {
    const input = '[[File:Example.jpg|thumb|text]]';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
  });
});
