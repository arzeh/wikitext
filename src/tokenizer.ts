export type Token = { type: 'TEXT'; value: string }
  | { type: 'INTERNAL_LINK_START' } // [[
  | { type: 'INTERNAL_LINK_DELIMITER' } // |
  | { type: 'INTERNAL_LINK_END' } // ]]
  | { type: 'TEMPLATE_START' } // {{
  | { type: 'TEMPLATE_END' } // }}
  | { type: 'TEMPLATE_PARAMETER_ASSIGNS' } // =
  | { type: 'TEMPLATE_PARAMETER_DELIMITER' } // |
  | { type: 'HEADER_START'; level: number }
  | { type: 'HEADER_END'; level: number }
  | { type: 'HEADER_NEW_LINE'; value: string }
  | { type: 'HTML_COMMENT_START' } // <!--
  | { type: 'HTML_COMMENT_END' } // -->
  | { type: 'TAG_START' } // <
  | { type: 'TAG_CLOSING' } // </
  | { type: 'TAG_END' }; // >

enum State {
  ROOT = 'ROOT',
  TEMPLATE = 'TEMPLATE',
  INTERNAL_LINK = 'INTERNAL_LINK',
  TEMPLATE_PARAMETER = 'TEMPLATE_PARAMETER',
  TEMPLATE_PARAMETER_VALUE = 'TEMPLATE_PARAMETER_VALUE',
  HEADER = 'HEADER',
  HTML_COMMENT = 'HTML_COMMENT',
  TAG_DEFINITION = 'TAG_DEFINITION',
}

export class Tokenizer {
  public readonly input: string;
  public cursor: number = 0;
  public states: State[] = [State.ROOT];
  public buffer: number = 0;
  public tokens: Token[] = [];

  public constructor(input: string) {
    this.input = input;
  }

  public tokenize() {
    while (this.cursor < this.input.length) {
      const state = this.states.at(-1);

      const NEXT = this.peek(1);
      const NEXT_TWO = this.peek(2);
      const NEXT_THREE = this.peek(3);
      const NEXT_FOUR = this.peek(4);
      const PREVIOUS = this.peek(-1);

      if (NEXT_FOUR === '<!--') {
        this.flush();
        this.createHtmlCommentStart();
      } else if (state === State.HTML_COMMENT && NEXT_THREE === '-->') {
        this.flush();
        this.createHtmlCommentEnd();
      } else if (state === State.HTML_COMMENT) {
        this.cursor++;
      } else if (NEXT_TWO === '{{') {
        this.flush();
        this.createTemplateStart();
      } else if (NEXT_TWO === '[[') {
        this.flush();
        this.createInternalLinkStart();
      } else if (state === State.INTERNAL_LINK && NEXT === '|') {
        this.flush();
        this.createInternalLinkDelimiter();
      } else if (state === State.INTERNAL_LINK && NEXT_TWO === ']]') {
        this.flush();
        this.createInternalLinkEnd();
      } else if ((state === State.TEMPLATE_PARAMETER_VALUE || state === State.TEMPLATE_PARAMETER || state === State.TEMPLATE) && NEXT === '|') {
        this.flush();
        this.createTemplateDelimiter();
      } else if (state === State.TEMPLATE_PARAMETER && NEXT === '=') {
        this.flush();
        this.createTemplateParameterAssign();
      } else if ((state === State.TEMPLATE_PARAMETER_VALUE || state === State.TEMPLATE_PARAMETER || state === State.TEMPLATE) && NEXT_TWO === '}}') {
        this.flush();
        this.createTemplateEnd();
      } else if (state !== State.HEADER && NEXT === '=' && (PREVIOUS === '\n' || PREVIOUS === '')) {
        this.flush();
        this.createHeaderStart();
      } else if (state === State.HEADER && NEXT === '=') {
        this.flush();
        this.createHeaderEnd();
      } else if (NEXT_TWO === '</') {
        this.flush();
        this.createClosingTag();
      } else if (NEXT === '<') {
        this.flush();
        this.createTagStart();
      } else if (state === State.TAG_DEFINITION && NEXT === '>') {
        this.flush();
        this.createTagEnd();
      } else {
        this.cursor++;
      }
    }

    this.flush();
    return this.tokens;
  }

  public peek(count: number) {
    if (count > 0) {
      return this.input.slice(this.cursor, this.cursor + count);
    } else {
      return this.input.slice(this.cursor + count, this.cursor);
    }
  }

  public consume(count: number) {
    const substring = this.peek(count);
    this.cursor += count;
    this.buffer = this.cursor;
    return substring;
  }

  public flush() {
    if (this.buffer === this.cursor) return;

    const substring = this.input.slice(this.buffer, this.cursor);
    this.buffer = this.cursor;
    this.createText(substring);
  }

  public createHtmlCommentStart() {
    this.consume(4);
    this.tokens.push({ type: 'HTML_COMMENT_START' });
    this.states.push(State.HTML_COMMENT);
  }

  public createHtmlCommentEnd() {
    this.consume(3);
    this.tokens.push({ type: 'HTML_COMMENT_END' });
    this.states.pop();
  }

  public createInternalLinkStart() {
    this.consume(2);
    this.tokens.push({ type: 'INTERNAL_LINK_START' });
    this.states.push(State.INTERNAL_LINK);
  }

  public createInternalLinkDelimiter() {
    this.consume(1);
    this.tokens.push({ type: 'INTERNAL_LINK_DELIMITER' });
  }

  public createInternalLinkEnd() {
    this.consume(2);
    this.tokens.push({ type: 'INTERNAL_LINK_END' });
    this.states.pop();
  }

  public createTemplateStart() {
    this.consume(2);
    this.tokens.push({ type: 'TEMPLATE_START' });
    this.states.push(State.TEMPLATE);
  }

  public createTemplateDelimiter() {
    this.consume(1);
    this.tokens.push({ type: 'TEMPLATE_PARAMETER_DELIMITER' });
    this.states.push(State.TEMPLATE_PARAMETER);
  }

  public createTemplateParameterAssign() {
    this.consume(1);
    this.tokens.push({ type: 'TEMPLATE_PARAMETER_ASSIGNS' });
    this.states.pop();
    this.states.push(State.TEMPLATE_PARAMETER_VALUE);
  }

  public createTemplateEnd() {
    this.consume(2);
    this.tokens.push({ type: 'TEMPLATE_END' });
    while (this.states.length && this.states.pop() !== State.TEMPLATE);
  }

  public createHeaderStart() {
    let count = 0;
    for (count; this.cursor + count < this.input.length; count++) {
      const next = this.peek(count + 1);
      if (!next.endsWith('=')) break;
    }
    this.consume(count);
    this.tokens.push({ level: count, type: 'HEADER_START' });
    this.states.push(State.HEADER);
  }

  public createHeaderEnd() {
    let count = 0;
    for (count; this.cursor + count < this.input.length; count++) {
      const next = this.peek(count + 1);
      if (!next.endsWith('=')) break;
    }
    this.consume(count);
    this.tokens.push({ level: count, type: 'HEADER_END' });
    this.states.pop();

    const next = this.peek(1);
    if (next === '\n' || next === '') {
      this.createHeaderNewLine();
    }
  }

  public createHeaderNewLine() {
    let count = 0;
    for (count; this.cursor + count < this.input.length; count++) {
      const next = this.peek(count + 1);
      if (next.trim().length !== 0) break;
    }

    const text = this.consume(count);
    this.tokens.push({ type: 'HEADER_NEW_LINE', value: text });
    this.states.pop();
  }

  public createTagStart() {
    this.consume(1);
    this.tokens.push({ type: 'TAG_START' });
    this.states.push(State.TAG_DEFINITION);
  }

  public createClosingTag() {
    this.consume(2);
    this.tokens.push({ type: 'TAG_CLOSING' });
    this.states.push(State.TAG_DEFINITION);
  }

  public createTagEnd() {
    this.consume(1);
    this.tokens.push({ type: 'TAG_END' });
    this.states.pop();
  }

  public createText(value: string) {
    this.tokens.push({ type: 'TEXT', value });
  }
}
