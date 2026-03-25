import { WikiTemplateNode, parse } from '../../src/main.js';
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'fs';

describe('playable characters', () => {
  const filenames = readdirSync('./tests/__fixtures__/es.genshin-impact/playable_characters');

  for (const filename of filenames) {
    const name = filename.replace('.txt', '');

    it(name, ({ task }) => {
      const content = readFileSync(`./tests/__fixtures__/es.genshin-impact/playable_characters/${filename}`).toString();
      const page = parse(content);

      expect(page.toString()).toStrictEqual(content);
      expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(
        `./__snapshots__/playable-characters/${ task.name.replace(/ /g, '_') }.json`,
      );
      expect([...page.templates()].length).toMatchSnapshot();
      expect(page.findTemplate(/infobox personaje jugable/i)).toBeInstanceOf(WikiTemplateNode);
    });
  }
});
