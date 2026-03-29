import { describe, expect, it } from 'vitest';
import { parse } from '../../src/main.js';

describe('page node', () => {
  it('references', () => {
    const input = `{{Character Tabs}}
{{Character Infobox
<!--Voice Actors-->
|voiceEN          = {{w|Erika Harlacher}}<ref name="Venti EN/JP">Twitter: EN & JP VA Announcement</ref>
|voiceCN          = [https://zh.moegirl.org.cn/喵酱(配音演员)# Miaojiang ({{zh|喵酱}})]<ref name="Venti CN">Official Website</ref>
|voiceJP          = {{w|Ayumu Murase|Murase Ayumu ({{ja|村瀬歩}})}}<ref name="Venti EN/JP" />
|voiceKR          = {{w|ko:정유정 (성우)|Jung Yoo-jung ({{ko|정유정}})}}<ref name="Venti KR">Twitter: KR VA Announcement</ref>
}}
`
    const page = parse(input, { tokenizer: { parseTags: true } });
    const references = page.sliceReferences();
    expect(references).toMatchObject([
      {
        children: [{ children: [], type: 'text', value: 'ref name="Venti EN/JP"' }],
        name: 'ref',
        type: 'tag',
      },
      {
        children: [], type: 'text', value: 'Twitter: EN & JP VA Announcement',
      },
      {
        children: [{ children: [], type: 'text', value: '/ref' }],
        name: 'ref',
        type: 'tag',
      },
      {
        children: [{ children: [], type: 'text', value: 'ref name="Venti CN"' }],
        name: 'ref',
        type: 'tag',
      },
      {
        children: [], type: 'text', value: 'Official Website',
      },
      {
        children: [{ children: [], type: 'text', value: '/ref' }],
        name: 'ref',
        type: 'tag',
      },
      {
        children: [{ children: [], type: 'text', value: 'ref name="Venti KR"' }],
        name: 'ref',
        type: 'tag',
      },
      {
        children: [], type: 'text', value: 'Twitter: KR VA Announcement',
      },
      {
        children: [{ children: [], type: 'text', value: '/ref' }],
        name: 'ref',
        type: 'tag',
      },
    ])
  })
});
