import { describe, expect, it } from 'vitest';
import { parse, WikiTagNode } from '../../src/main.js';

describe('tag node', () => {
  it('regular tag', () => {
    const input = '<div class="something">text</div>'
    const page = parse(input, { tokenizer: { parseTags: true } });

    expect(page.toString()).toStrictEqual(input);
    const openingTag = page.children[0] as WikiTagNode;
    expect(openingTag).toBeInstanceOf(WikiTagNode);
    expect(openingTag.name).toStrictEqual('div');

    const closingTag = page.children[0] as WikiTagNode;
    expect(closingTag).toBeInstanceOf(WikiTagNode);
    expect(closingTag.name).toStrictEqual('div');
    expect(closingTag.isClosing()).toStrictEqual(false);
  });

  it('self-closing tag', () => {
    const input = '<br />'
    const page = parse(input, { tokenizer: { parseTags: true } });

    expect(page.toString()).toStrictEqual(input);
    const tag = page.children[0] as WikiTagNode;
    expect(tag).toBeInstanceOf(WikiTagNode);
    expect(tag.name).toStrictEqual('br');
  });

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

    let insideRef: boolean = false;
    const references: string[] = [];
    let reference: string = '';
    let skipCount = 0;
    for (const token of page) {
      if (skipCount > 0) {
        skipCount--;
        continue;
      }

      if (insideRef) {
        if (token instanceof WikiTagNode && token.isClosing()) {
          references.push(reference);
          reference = '';
          insideRef = false;
          continue;
        } else {
          reference += token.toString();
        }
      } else {
        if (token instanceof WikiTagNode && !token.isSelfClosing()) {
          insideRef = true;
          skipCount = token.children.length;
        }
      }
    }

    expect(references).toMatchObject([
      'Twitter: EN & JP VA Announcement',
      "Official Website",
      'Twitter: KR VA Announcement'
    ])
  })
});
