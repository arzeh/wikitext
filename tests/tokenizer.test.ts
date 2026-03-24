import { describe, expect, it } from 'vitest';
import { Tokenizer } from '../src';

describe('tokenizer', () => {
  it('simple internal link', () => {
    const input = '[[Simple link]]';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'INTERNAL_LINK_START' },
      { type: 'TEXT', value: 'Simple link' },
      { type: 'INTERNAL_LINK_END' },
    ]);
  });

  it('internal link', () => {
    const input = '[[Simple link|Text]]';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'INTERNAL_LINK_START' },
      { type: 'TEXT', value: 'Simple link' },
      { type: 'INTERNAL_LINK_DELIMITER' },
      { type: 'TEXT', value: 'Text' },
      { type: 'INTERNAL_LINK_END' },
    ]);
  });

  it('simple template', () => {
    const input = '{{template}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('template with unnamed parameter', () => {
    const input = '{{template|value}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'value' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('template with multiple unnamed parameters', () => {
    const input = '{{template|value 1|value 2}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'value 1' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'value 2' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('template with named parameter', () => {
    const input = '{{template|a=b}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'a' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: 'b' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('template with multiple named parameters', () => {
    const input = '{{template|a=b|c=d}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'a' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: 'b' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'c' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: 'd' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('template with unnamed and named parameters', () => {
    const input = '{{template|unnamed value|key=value}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'unnamed value' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: 'key' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: 'value' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('link followed by template', () => {
    const input = '[[link]] {{template}}';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'INTERNAL_LINK_START' },
      { type: 'TEXT', value: 'link' },
      { type: 'INTERNAL_LINK_END' },
      { type: 'TEXT', value: ' ' },
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('single header without newline', () => {
    const input = '== title ==';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { level: 2, type: 'HEADER_START' },
      { type: 'TEXT', value: ' title ' },
      { level: 2, type: 'HEADER_END' },
      { type: 'HEADER_NEW_LINE', value: '' },
    ]);
  });

  it('single header with newline', () => {
    const input = '== title ==\n';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { level: 2, type: 'HEADER_START' },
      { type: 'TEXT', value: ' title ' },
      { level: 2, type: 'HEADER_END' },
      { type: 'HEADER_NEW_LINE', value: '\n' },
    ]);
  });

  it('invalid header', () => {
    const input = 'text== title ==\n';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEXT', value: 'text== title ==\n' },
    ]);
  });

  it('header with template', () => {
    const input = '== {{template}} ==';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { level: 2, type: 'HEADER_START' },
      { type: 'TEXT', value: ' ' },
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'template' },
      { type: 'TEMPLATE_END' },
      { type: 'TEXT', value: ' ' },
      { level: 2, type: 'HEADER_END' },
      { type: 'HEADER_NEW_LINE', value: '' },
    ]);
  });

  it('simple html comment', () => {
    const input = '<!-- text {{template}} -->';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'HTML_COMMENT_START' },
      { type: 'TEXT', value: ' text {{template}} ' },
      { type: 'HTML_COMMENT_END' },
    ]);
  });

  it('header with commented newline', () => {
    const input = '== title <!--\n--> ==';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { level: 2, type: 'HEADER_START' },
      { type: 'TEXT', value: ' title ' },
      { type: 'HTML_COMMENT_START' },
      { type: 'TEXT', value: '\n' },
      { type: 'HTML_COMMENT_END' },
      { type: 'TEXT', value: ' ' },
      { level: 2, type: 'HEADER_END' },
      { type: 'HEADER_NEW_LINE', value: '' },
    ]);
  });

  it('infobox', () => {
    const input = `{{Example Infobox
| name = Text
| title = Other Text
}}`;
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'Example Infobox\n' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: ' name ' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: ' Text\n' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: ' title ' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: ' Other Text\n' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('infobox with nested template', () => {
    const input = `{{Example Infobox
| name = Text
| price = {{Price|100}}
}}`;
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'Example Infobox\n' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: ' name ' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: ' Text\n' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: ' price ' },
      { type: 'TEMPLATE_PARAMETER_ASSIGNS' },
      { type: 'TEXT', value: ' ' },
      { type: 'TEMPLATE_START' },
      { type: 'TEXT', value: 'Price' },
      { type: 'TEMPLATE_PARAMETER_DELIMITER' },
      { type: 'TEXT', value: '100' },
      { type: 'TEMPLATE_END' },
      { type: 'TEXT', value: '\n' },
      { type: 'TEMPLATE_END' },
    ]);
  });

  it('html tag', () => {
    const input = '<div>text</div>';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TAG_START' },
      { type: 'TEXT', value: 'div' },
      { type: 'TAG_END' },
      { type: 'TEXT', value: 'text' },
      { type: 'TAG_CLOSING' },
      { type: 'TEXT', value: 'div' },
      { type: 'TAG_END' },
    ]);
  });

  it('html tag with attributes', () => {
    const input = '<div data="value">text</div>';
    const tokens = new Tokenizer(input).tokenize();
    expect(tokens).toStrictEqual([
      { type: 'TAG_START' },
      { type: 'TEXT', value: 'div data="value"' },
      { type: 'TAG_END' },
      { type: 'TEXT', value: 'text' },
      { type: 'TAG_CLOSING' },
      { type: 'TEXT', value: 'div' },
      { type: 'TAG_END' },
    ]);
  });
});
