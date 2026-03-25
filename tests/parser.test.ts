import { describe, expect, it } from 'vitest';
import { parse } from '../src/main.js';

describe('parse', () => {
  it('simple link', ({ task }) => {
    const input = '[[title]]';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('multiple links', ({ task }) => {
    const input = 'A [[title]] with other [[link|display]].';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('simple template', ({ task }) => {
    const input = '{{template}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('template with unnamed parameters', ({ task }) => {
    const input = '{{template|1|2|3}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('template with named parameters', ({ task }) => {
    const input = '{{template|a=text|title=more text}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('template with named and unnamed parameters', ({ task }) => {
    const input = '{{template|a text|title=more text}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('template with link in parameter', ({ task }) => {
    const input = '{{template|some [[link]].|title=other [[likn|display]].}}';
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });

  it('infobox', ({ task }) => {
    const input = `{{Infobox
| name = Text
| price = {{Price|100}}
| affiliations = [[Link]], [[Link|Display]]
}}
Introductory paragraph.`;
    const page = parse(input);

    expect(page.toString()).toStrictEqual(input);
    expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(`./__snapshots__/parser/${ task.name.replace(/ /g, '_') }.json`);
  });
});
