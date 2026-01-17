import { describe, expect, it } from 'vitest';
import { parse } from '../../src/parser';
import { WikiTemplateNode } from '../../src/nodes/wiki-template-node';

describe('template node', () => {
  it('regular header', ({ task }) => {
    const input = '== Header ==\n'
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
  })

  it('complex? header', ({ task }) => {
    const input = `==Curiosidades== 
==Navegación==
{{Navbox Personajes}}`

    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
  })
});
