import { WikiTemplateNode, parse } from '../../src/main.js';
import { describe, expect, it } from 'vitest';

describe('template node', () => {
  it('empty template', () => {
    const input = '{{empty template}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;

    expect(template.name.toString().trim()).toStrictEqual('empty template');
    expect(template.get(1)).toBeUndefined();
  });

  it('get unnamed parameter', () => {
    const input = '{{template|1|2=value}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;

    expect(template.get(1)?.toString()).toStrictEqual('1');
    expect(template.get(2)?.children.toString()).toStrictEqual('value');
  });

  it('get mixed unnamed parameter', () => {
    const input = '{{template|1|2=value|test}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;

    expect(template.get(3)?.toString()).toStrictEqual('test');
  });

  it('set mixed unnamed parameter', () => {
    const input = '{{template|1|2=value|test}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;
    template.set(3, 'value');

    expect(template.get(3)?.toString()).toStrictEqual('value');
  });

  it('set new mixed unnamed parameter', () => {
    const input = '{{template|1|2=value|test}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;
    template.set(4, 'value');

    expect(template.get(4)?.toString()).toStrictEqual('value');
    expect(template.toString()).toStrictEqual('{{template|1|2=value|test|value}}');
  });

  it('set explicit unnamed parameter', () => {
    const input = '{{template|1|2=value}}';
    const page = parse(input);
    const template = page.children.at(0) as WikiTemplateNode;
    template.set(2, 'test');

    expect(template.get(2)?.toString()).toStrictEqual('2=test');
    expect(template.get(2)?.name.toString()).toStrictEqual('2');
    expect(template.get(2)?.children.toString()).toStrictEqual('test');
    expect(template.toString()).toStrictEqual('{{template|1|2=test}}');
  });

  it('template using magic word in name', () => {
    const input = '{{:{{PAGENAME}}}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
  });
});
