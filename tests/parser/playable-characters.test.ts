import { describe, expect, it } from 'vitest';
import { parse } from '../../src/parser';
import { readdirSync, readFileSync } from 'fs';
import { WikiTemplateNode } from '../../src/nodes/wiki-template-node';

describe('playable characters', () => {
  const filenames = readdirSync(`./tests/__fixtures__/es.genshin-impact/playable_characters`);

  for (const filename of filenames) {
    const name = filename.replace('.txt', '');

    it(name, async ({ task }) => {
      const content = readFileSync(`./tests/__fixtures__/es.genshin-impact/playable_characters/${filename}`).toString();
      const page = parse(content);

      expect(page.toString()).toStrictEqual(content);
      await expect(JSON.stringify(page, null, 2)).toMatchFileSnapshot(
        `./__snapshots__/playable-characters/${ task.name.replace(/ /g, '_') }.json`
      );
      expect([...page.templates()].length).toMatchSnapshot();
      expect(page.findTemplate(/infobox personaje jugable/i)).toBeInstanceOf(WikiTemplateNode)
    })
  }
});
