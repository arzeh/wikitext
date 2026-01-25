<div align="center">
# Wikitext

**A zero-dependency wikitext parser for JavaScript.**

[![GitHub](https://img.shields.io/github/license/arzeh/wikitext)](https://github.com/arzeh/wikitext/blob/main/LICENSE.md)
[![npm](https://img.shields.io/npm/v/arzeh/wikitext?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/arzeh/wikitext)
</div>

## Description

This library allows you to parse wikitext to extract values or manipulate the contents.
It turns raw MediaWiki-style wikitext into a structured, machine-friendly representation
you can explore, transform, lint, or post-process however you want.

**This project is actuvely evolving.** Although the API is expected to remain
stable and focus mostly in finding edge-cases or supporting other wikitext elements,
breaking changes may occur until 1.0.

## Features

- Parses common wikitext constructs:
- - Headings
- - Links
- - Templates
- Produces a clean, navigable AST.
- **Zero dependencies.**
- Written in TypeScript.

## Design

The resulting AST is inspired in the HTMLElement structure. All elements
(except TextNodes) can have children for their values; some structures,
such as TemplateNodes, can have multiple groups of children: one for its name
and other for its parameters.

All nodes implement their own `toString` method to turn the AST back into
wikitext. You can modify any of the nodes' children and get the resulting
wikitext back.

At the current version, this library does not support some complex wikitext
elements such as wikitables and HTML tags that are usually supported in wikitext.

This project does not try to be a resilient parser and will throw an error when it
finds wikitext it can't understand.

## Installation

```sh
npm install wikitext
yarn add wikitext
```

## Usage

```ts
import { parse } from 'wikitext';

function main() {
  const source = `{{Item Infobox
| name = Item Name
| price = {{Price|200}}
}}
'''Item Name''' is an item in [[game]]. `;
  const page = parse(source);

  const price = page.findTemplate(/price/i)
  if (!price) return;

  price.set(1, '300');
  console.log(`${page}`)
}
```

Calling the previous function will print in the console:

```
{{Item Infobox
| name = Item Name
| price = {{Price|300}}
}}
'''Item Name''' is an item in [[game]].
```

## Use cases

- Format pages.
- Extract information from pages, e.g. collecting values in specific templates' parameters.
- Updating information in pages, e.g. templates' parameters.

## License

MIT
