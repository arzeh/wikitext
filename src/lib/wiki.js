import { Client } from './client';

/**
 * @template T
 * @typedef {import('../types.d.ts').Prop<T>} Prop
 */

export class Wiki {
  /**
   * @readonly
   * @type {Client}
   * @since 1.0.0
   */
  client;

  /**
   * @protected
   * @readonly
   * @type {Record<string, string>}
   * @since 1.0.0
   */
  cachedTokens = {};

  /**
   * @param {string | URL} url
   * @param {import('./client.js').ClientOptions} [options]
   * @since 1.0.0
   */
  constructor (url, options) {
    this.client = new Client(url, options);
  }

  /**
   * @template [T=unknown]
   * @param {Record<string, unknown>} params
   * @param {Record<string, unknown>} [options]
   * @returns {Promise<T>}
   * @since 1.0.0
   */
  async action(params, options = {}) {
    /** @type {Record<string, unknown>} */
    const defaults = {
      format: 'json',
      formatversion: 2,
    };
    if (!options.token) {
      defaults.token = await this.csrfToken();
    }

    params = Object.assign(options, defaults, params);
    return await this.client.post(params);
  }

  /**
   * @param {Record<string, unknown>} params
   * @since 1.0.0
   */
  async *createGenerator(params) {
    params = Object.assign({}, params);

    while (true) {
      /**
       * @typedef {Object} QueryResult
       * @property {Record<string, string>} query
       * @property {Object} [continue]
       */
      /**
       * @type {QueryResult}
       */
      const result = await this.query(params);

      // @ts-expect-error - can't infer query key
      for (const item of result.query[params.list || 'pages']) {
        yield item;
      }

      if (!result.continue) break;
      Object.assign(params, result.continue);
    }
  }

  /**
   * @typedef {Object} CreateIteratorOptions
   * @property {'array' | 'generator'} type
   */
  /**
   * @overload
   * @param {Record<string, unknown>} params
   * @param {CreateIteratorOptions & { type: 'array' }} options
   * @returns {Promise<Array<T>>}
   */
  /**
   * @overload
   * @param {Record<string, unknown>} params
   * @param {CreateIteratorOptions & { type: 'generator' }} options
   * @returns {AsyncGenerator<T, void, unknown>}
   */
  /**
   * @template [T=unknown]
   * @param {Record<string, unknown>} params
   * @param {CreateIteratorOptions} options
   * @returns {AsyncGenerator<T, void, unknown> | Promise<Array<T>>}
   * @since 1.0.0
   */
  createIterator(params, options) {
    const generator = this.createGenerator(params);

    if (options.type === 'generator') return generator;

    return Array.fromAsync(generator);
  }

  /**
    * @typedef {Object} AllCategoriesRequest
    * @property {string} [accontinue]
    *   When more results are available, use this to continue.
    * @property {'ascending' | 'descending'} [acdir]
    *   Direction to sort in.
    * @property {string} [acfrom]
    *   The category to start enumerating from.
    * @property {number | 'max'} [aclimit]
    *   How many categories to return.
    * @property {number} [acmax]
    *   Only return categories with at most this many members.
    * @property {number} [acmin]
    *   Only return categories with at least this many members.
    * @property {string} [acprefix]
    *   Search for all category titles that begin with this value.
    * @property {import('../types.d.ts').Prop<'size' | 'hidden'>} [acprop]
    *   Which properties to get.
    * @property {string} [acto]
    *   The category to stop enumerating at.
    */
  /**
    * @typedef {Object} AllCategoriesItem
    * @property {string} category
    * @property {boolean} hidden
    * @property {number} files
    * @property {number} pages
    * @property {number} size
    * @property {number} subcats
    */
  /**
   * @overload
   * @param {AllCategoriesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllCategoriesItem>>}
   */
  /**
   * @overload
   * @param {AllCategoriesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllCategoriesItem, void, unknown>}
   */
  /**
    * @description Enumerate all categories.
    * @param {AllCategoriesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllCategoriesItem, void, unknown> | Promise<AllCategoriesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allcategories
    */
  allcategories(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allcategories' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllDeletedRevisionsRequest
   * @property {string} [adrcontinue]
   *   When more results are available, use this to continue.
   * @property {'newer'|'older'} [adrdir]
   *   In which direction to enumerate.
   *   @default 'older'
   * @property {Date|string} [adrend]
   *   The timestamp to stop enumerating at.
   * @property {string} [adrexcludeuser]
   *   Don't list revisions by this user.
   * @property {string} [adrfrom]
   *   Start listing at this title.
   * @property {boolean} [adrgeneratetitles]
   *   When being used as a generator, generate titles rather than revision IDs.
   * @property {number|'max'} [adrlimit]
   *   Limit how many revisions will be returned.
   *   If `adrprop=content`, is used, the limit is 50.
   * @property {number|number[]|'*'} [adrnamespace]
   *   Only list pages in this namespace.
   * @property {string} [adrprefix]
   *   Search for all page titles that begin with this value.
   * @property {Prop<
   *   'ids'
   *   | 'flags'
   *   | 'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'size'
   *   | 'slotsize'
   *   | 'sha1'
   *   | 'slotsha1'
   *   | 'contentmodel'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'content'
   *   | 'tags'
   *   | 'roles'
   * >} [adrprop]
   *   Which properties to get for each revision.
   * @property {string} [adrsection]
   *   Only retrieve the content of the section with this identifier.
   * @property {'main'|string|string[]} [adrslots]
   *   Which revision slots to return data for, when slot-related properties
   *   are included in `adrprops`.
   *   If omitted, data from the `main` slot will be returned in a backwards-compatible format.
   * @property {Date|string} [adrstart]
   *   The timestamp to start enumerating from.
   * @property {string} [adrtag]
   *   Only list revisions tagged with this tag.
   * @property {string} [adrto]
   *   Stop listing at this title.
   * @property {string} [adruser]
   *   Only list revisions by this user.
   */
  /**
   * @typedef {Object} AllDeletedRevisionsItem
   * @property {number} ns
   * @property {number} pageid
   * @property {Array<Object>} revisions
   * @property {boolean} revisions[].minor
   * @property {number} revisions[].parentid
   * @property {number} revisions[].revid
   * @property {string[]} revisions[].roles
   * @property {string} revisions[].sha1
   * @property {number} revisions[].size
   * @property {Object} revisions[].slots
   * @property {string} revisions[].slots.comment
   * @property {Object} revisions[].slots.main
   * @property {string} revisions[].slots.main.content
   * @property {string} revisions[].slots.main.contentformat
   * @property {string} revisions[].slots.main.contentmodel
   * @property {string} revisions[].slots.main.sha1
   * @property {number} revisions[].slots.main.size
   * @property {string} revisions[].slots.parsedcomment
   * @property {string[]} revisions[].slots.tags
   * @property {string} revisions[].timestamp
   * @property {string} revisions[].user
   * @property {number} revisions[].userid
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllDeletedRevisionsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllDeletedRevisionsItem>>}
   */
  /**
   * @overload
   * @param {AllDeletedRevisionsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllDeletedRevisionsItem, void, unknown>}
   */
  /**
    * @description List all deleted revisions by a user or in a namespace.
    * @param {AllDeletedRevisionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllDeletedRevisionsItem, void, unknown> | Promise<AllDeletedRevisionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Alldeletedrevisions
    */
  alldeletedrevisions(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'alldeletedrevisions' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllFileUsagesRequest
   * @property {string} [afcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [afdir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string} [affrom]
   *   The title of the file to start enumerating from.
   * @property {number|'max'} [aflimit]
   *   How many total items to return.
   * @property {string} [afprefix]
   *   Search for all file titles that begin with this value.
   * @property {Prop<'ids'|'title'>} [afprop]
   *   Which pieces of information to include.
   * @property {string} [afto]
   *   The title of the file to stop enumerating at.
   * @property {boolean} [afunique]
   *   Only show distinct file titles. Cannot be used with `afprop=ids`.
   */
  /**
   * @typedef {Object} AllFileUsagesItem
   * @property {number} fromid
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllFileUsagesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllFileUsagesItem>>}
   */
  /**
   * @overload
   * @param {AllFileUsagesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllFileUsagesItem, void, unknown>}
   */
  /**
    * @description List all file usages, including non-existing.
    * @param {AllFileUsagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllFileUsagesItem, void, unknown> | Promise<AllFileUsagesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allfileusages
    */
  allfileusages(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allfileusages' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllImagesRequest
   * @property {string} [aicontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'|'newer'|'older'} [aidir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {Date|string} [aiend]
   *   The timestamp to stop enumerating at. Can only be used with `aisort=timestamp`.
   * @property {'all'|'bots'|'nobots'} [aifilterbots]
   *   How to filter files uploaded by bots. Can only be used with `aisort=timestamp`.
   *   Cannot be used together with `aiuser`.
   * @property {string} [aifrom]
   *   The image title to start enumerating from. Can only be used with `aisort=name`.
   * @property {number|'max'} [ailimit]
   *   How many images in total to return.
   * @property {string|string[]} [aimime]
   *   Disabled due to miser mode.
   * @property {number} [aiminsize]
   *   Limit to images with at least this many bytes.
   * @property {number} [aimaxsize]
   *   Limit to images with at most this many bytes.
   * @property {string} [aiprefix]
   *   Search for all image titles that begin with this value. Can only be used with `aisort=name`.
   * @property {Prop<
   *   'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'canonicaltitle'
   *   | 'url'
   *   | 'size'
   *   | 'dimensions'
   *   | 'sha1'
   *   | 'mime'
   *   | 'mediatype'
   *   | 'metadata'
   *   | 'commonmetadata'
   *   | 'extmetadata'
   *   | 'bitdepth'
   *   | 'badfile'
   * >} [aiprop]
   *   Which file information to get.
   * @property {string} [aisha1]
   *   SHA1 hash of image. Overrides `aisha1base36`.
   * @property {string} [aisha1base36]
   *   SHA1 hash of image in base 36 (used in MediaWiki).
   * @property {'name'|'timestamp'} [aisort]
   *   Property to sort by.
   *   @default 'name'
   * @property {Date|string} [aistart]
   *   The timestamp to start enumerating from. Can only be used with `aisort=timestamp`.
   * @property {string} [aito]
   *   The image title to stop enumerating at. Can only be used with `aisort=name`.
   * @property {string} [aiuser]
   *   Only return files where the last version was uploaded by this user.
   *   Can only be used with `aisort=timestamp`.
   *   Cannot be used together with `aifilterbots`.
   */
  /**
   * @typedef {Object} AllImagesItem
   * @property {number} bitdepth
   * @property {string} canonicaltitle
   * @property {string} comment
   * @property {Array<Object>} commonmetaddata
   * @property {string} commonmetaddata[].name
   * @property {string} commonmetaddata[].value
   * @property {string} descriptionshorturl
   * @property {string} descriptionurl
   * @property {Record<string, { hidden?: '', source: string, value: string }>} extmetadata
   * @property {number} height
   * @property {string} mediatype
   * @property {Array<Object>} metadata
   * @property {string} metadata[].name
   * @property {string} metadata[].value
   * @property {string} mime
   * @property {string} name
   * @property {number} ns
   * @property {string} parsedcomment
   * @property {string} sha1
   * @property {number} size
   * @property {string} timestamp
   * @property {string} title
   * @property {string} url
   * @property {string} user
   * @property {number} userid
   * @property {number} width
   */
  /**
   * @overload
   * @param {AllImagesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllImagesItem>>}
   */
  /**
   * @overload
   * @param {AllImagesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllImagesItem, void, unknown>}
   */
  /**
    * @description Enumerate all images sequentially.
    * @param {AllImagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllImagesItem, void, unknown> | Promise<AllImagesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allimages
    */
  allimages(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allimages' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllLinksRequest
   * @property {string} [alcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [aldir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string} [alfrom]
   *   The title of the link to start enumerating from.
   * @property {number|'max'} [allimit]
   *   How many total items to return.
   * @property {number} [alnamespace]
   *   The namespace to enumerate.
   * @property {string} [alprefix]
   *   Search for all linked titles that begin with this value.
   * @property {Prop<'ids'|'title'>} [alprop]
   *   Which pieces of information to include.
   * @property {string} [alto]
   *   The title of the link to stop enumerating at.
   * @property {boolean} [alunique]
   *   Only show distinct linked titles. Cannot be used with `alprop=ids`.
   */
  /**
   * @typedef {Object} AllLinksItem
   * @property {number} fromid
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllLinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllLinksItem>>}
   */
  /**
   * @overload
   * @param {AllLinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllLinksItem, void, unknown>}
   */
  /**
    * @description Enumerate all links that point to a given namespace.
    * @param {AllLinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllLinksItem, void, unknown> | Promise<AllLinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Alllinks
    */
  alllinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'alllinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllMessagesRequest
   * @property {Prop<string>} [ammessages]
   *  Which messages to output. * (default) means all messages.
   * @property {Prop<'default'>} [amprop]
   *  Which properties to get.
   * @property {boolean} [amenableparser]
   *  Set to enable parser, will preprocess the wikitext of message (substitute magic words, handle templates, etc.).
   * @property {boolean} [amnocontent]
   *  If set, do not include the content of the messages in the output.
   * @property {boolean} [amincludelocal]
   *  Also include local messages, i.e. messages that don't exist in the software but do exist as in the MediaWiki namespace.
   * @property {Prop<string>} [amargs]
   *  Arguments to be substituted into message.
   * @property {string} [amfilter]
   *  Return only messages with names that contain this string.
   * @property {'all' | 'modified' | 'unmodified'} [amcustomised]
   *  Return only messages in this customisation state.
   * @property {string} [amlang]
   *  Return messages in this language.
   * @property {string} [amfrom]
   *  Return messages starting at this message.
   * @property {string} [amto]
   *  Return messages ending at this message.
   * @property {string} [amtitle]
   *  Page name to use as context when parsing message (for amenableparser option).
   * @property {string} [amprefix]
   *  Return messages with this prefix.
   */
  /**
   * @typedef {Object} AllMessagesResponse
   * @property {Object} query
   * @property {Array<Object>} query.allmessages
   * @property {string} query.allmessages[].name
   * @property {string} query.allmessages[].normalizedname
   * @property {string} query.allmessages[].content
   */
  /**
    * @description Returns messages from the site.
    * @param {AllMessagesRequest} params
    * @returns {Promise<AllMessagesResponse['query']['allmessages']>}
    * @see https://www.mediawiki.org/wiki/API:Allmessages
    */
  async allmessages(params) {
    /** @type {AllMessagesResponse} */
    const result = await this.query(params, { meta: 'allmessages' });

    return result.query.allmessages;
  }

  /**
   * @typedef {Object} AllPagesRequest
   * @property {string} [apcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [apdir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {'all'|'withlanglinks'|'withoutlanglinks'} [apfilterlanglinks]
   *   Filter based on whether a page has langlinks. Note that this may not consider
   *   langlinks added by extensions.
   *   @default 'all'
   * @property {'all'|'nonredirects'|'redirects'} [apfilterredir]
   *   Which pages to list.
   *   @default 'all'
   * @property {string} [apfrom]
   *   The page title to start enumerating from.
   * @property {number|'max'} [aplimit]
   *   How many total pages to return.
   * @property {number} [apmaxsize]
   *   Limit to pages with at most this many bytes.
   *   Disabled due to miser mode.
   * @property {number} [apminsize]
   *   Limit to pages with at least this many bytes.
   * @property {number} [apnamespace]
   *   The namespace to enumerate.
   * @property {string} [apprefix]
   *   Search for all page titles that begin with this value.
   * @property {'all'|'definite'|'indefinite'} [apprexpiry]
   *   Which protection expiry to filter the page on.
   *   @default 'all'
   * @property {'all'|'cascading'|'noncascading'} [apprfiltercascade]
   *   Filter protections based on cascadingness (ignored when `apprtype` isn't set).
   *   @default 'all'
   * @property {Prop<''|'autoconfirmed'|'sysop'>} [apprlevel]
   *   Filter protections basedd on protection level (must be used with `apprtype=level` parameter).
   * @property {'edit'|'move'|'upload'} [apprtype]
   *   Limit to protected pages only.
   * @property {string} [apto]
   *   The page title to stop enumerating at.
   */
  /**
   * @typedef {Object} AllPagesItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllPagesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllPagesItem>>}
   */
  /**
   * @overload
   * @param {AllPagesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllPagesItem, void, unknown>}
   */
  /**
    * @description Enumerate all pages sequentially in a given namespace.
    * @param {AllPagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllPagesItem, void, unknown> | Promise<AllPagesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allpages
    */
  allpages(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allpages' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllRedirectsRequest
   * @property {string} [arcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [ardir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string} [arfrom]
   *   The title of the redirect to start enumerating from.
   * @property {number|'max'} [arlimit]
   *   How many total items to return.
   * @property {number} [arnamespace]
   *   The namespace to enumerate.
   * @property {string} [arprefix]
   *   Search for all target pages that begin with this value.
   * @property {Prop<'ids'|'title'|'fragment'|'interwiki'>} [arprop]
   *   Which pieces of information to include.
   *   @default 'title'
   * @property {string} [arto]
   *   The title of the redirect to stop enumerating at.
   * @property {boolean} [arunique]
   *   Only show distinct target pages.
   *   Cannot be used with `arprop=ids|fragment|interwiki`.
   */
  /**
   * @typedef {Object} AllRedirectsItem
   * @property {string} [fragment]
   * @property {number} fromid
   * @property {string} [interwiki]
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllRedirectsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllRedirectsItem>>}
   */
  /**
   * @overload
   * @param {AllRedirectsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllRedirectsItem, void, unknown>}
   */
  /**
    * @description List all redirects to a namespace.
    * @param {AllRedirectsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllRedirectsItem, void, unknown> | Promise<AllRedirectsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allredirects
    */
  allredirects(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allredirects' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllRevisionsRequest
   * @property {string} [arvcontinue]
   *   When more results are available, use this to continue.
   * @property {'newer'|'older'} [arvdir]
   *   In which direction to enumerate.
   *   @default 'older'
   * @property {Date|string} [arvend]
   *   The timestamp to stop enumerating at.
   * @property {string} [arvexcludeuser]
   *   Don't list revisions by this user.
   * @property {boolean} [arvgeneratetitles]
   *   When being used as a generator, generate titles rather than revision IDs.
   * @property {number|'max'} [arvlimit]
   *   Limit how many revisions will be returned. If `arvprop=content` is used,
   *   the limit is 50.
   * @property {number|number[]|'*'} [arvnamespace]
   *   Only list pages in this namespace.
   * @property {Prop<
   *   'ids'
   *   | 'flags'
   *   | 'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'size'
   *   | 'slotsize'
   *   | 'sha1'
   *   | 'slotsha1'
   *   | 'contentmodel'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'content'
   *   | 'tags'
   *   | 'roles'
   * >} [arvprop]
   *   Which properties to get for each revision.
   * @property {string} [arvsection]
   *   Only retrieve the content of the section with this identifier.
   * @property {'main'|string|string[]} [arvslots]
   *   Which revision slots to return data for, when slot-related properties are
   *   included in `arvprops`.
   * @property {Date|string} [arvstart]
   *   The timestamp to start enumerating from.
   * @property {string} [arvuser]
   *   Only list revisions by this user.
   */
  /**
   * @typedef {Object} AllRevisionsItem
   * @property {number} pageid
   * @property {Array<Object>} revisions
   * @property {boolean} revisions[].minor
   * @property {number} revisions[].parentid
   * @property {number} revisions[].revid
   * @property {string[]} revisions[].roles
   * @property {string} revisions[].sha1
   * @property {number} revisions[].size
   * @property {Object} revisions[].slots
   * @property {string} revisions[].slots.comment
   * @property {Object} revisions[].slots.main
   * @property {string} revisions[].slots.main.content
   * @property {string} revisions[].slots.main.contentformat
   * @property {string} revisions[].slots.main.contentmodel
   * @property {string} revisions[].slots.main.sha1
   * @property {number} revisions[].slots.main.size
   * @property {string} revisions[].slots.parsedcomment
   * @property {string[]} revisions[].slots.tags
   * @property {string} revisions[].timestamp
   * @property {string} revisions[].user
   * @property {number} revisions[].userid
   */
  /**
   * @overload
   * @param {AllRevisionsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllRevisionsItem>>}
   */
  /**
   * @overload
   * @param {AllRevisionsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllRevisionsItem, void, unknown>}
   */
  /**
    * @description List all revisions.
    * @param {AllRevisionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllRevisionsItem, void, unknown> | Promise<AllRevisionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allrevisions
    */
  allrevisions(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allrevisions' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} AllTransclusionsRequest
   * @property {string} [atcontinue]
   *   When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   * @property {string} [atfrom]
   *   The title of the transclusion to start enumerating from.
   * @property {string} [atto]
   *   The title of the transclusion to stop enumerating at.
   * @property {string} [atprefix]
   *   Search for all transcluded titles that begin with this value.
   * @property {boolean} [atunique]
   *   Only show distinct transcluded titles. Cannot be used with atprop=ids.
   * @property {Prop<'ids'|'title'>} [atprop]
   *   Which pieces of information to include:
   * @property {number} [atnamespace]
   *   The namespace to enumerate.
   *   @default 10
   * @property {number|'max'} [atlimit]
   *   How many total items to return.
   * @property {'ascending'|'descending'} [atdir]
   *   The direction in which to list.
   *   @default 'ascening'
   */
  /**
   * @typedef {Object} AllTransclusionsItem
   * @property {number} fromid
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {AllTransclusionsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllTransclusionsItem>>}
   */
  /**
   * @overload
   * @param {AllTransclusionsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllTransclusionsItem, void, unknown>}
   */
  /**
    * @description List all transclusions (pages embedded using `{{x}}`), including non-existing.
    * @param {AllTransclusionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllTransclusionsItem, void, unknown> | Promise<AllTransclusionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Alltransclusions
    */
  alltransclusions(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'alltransclusions' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
     * @typedef {Object} AllUsersRequest
     * @property {string} [aufrom]
     *   The username to start enumerating from.
     * @property {string} [auto]
     *   The username to stop enumerating at.
     * @property {string} [auprefix]
     *   Search for all users that begin with this value.
     * @property {'ascending'|'descending'} [audir]
     *   Direction to sort in.
     *   @default 'ascending'
     * @property {string|string[]} [augroup]
     *   Only include users in the given groups. Does not include implicit or auto-promoted
     *   groups like *, user, or autoconfirmed.
     * @property {string|string[]} [auexcludegroup]
     *   Exclude users in the given groups.
     * @property {string|string[]} [aurights]
     *   Only include users with the given rights. Does not include rights granted
     *   by implicit or auto-promoted groups like *, user, or autoconfirmed.
     * @property {Prop<
     *   'blockinfo'
     *   | 'groups'
     *   | 'implicitgroups'
     *   | 'rights'
     *   | 'editcount'
     *   | 'registration'
     *   | 'centralids'
     * >} [auprop]
     *   Which pieces of information to include:
     * @property {number|'max'} [aulimit]
     *   How many total usernames to return.
     * @property {boolean} [auwitheditsonly]
     *   Only list users who have made edits.
     * @property {boolean} [auactiveusers]
     *   Only list users active in the last 30 days.
     * @property {string} [auattachedwiki]
     *   With auprop=centralids, also indicate whether the user is attached with the wiki identified by this ID.
     * @property {boolean} [auexcludenamed]
     *   Exclude users of named accounts.
     * @property {boolean} [auexcludetemp]
     *   Exclude users of temporary accounts.
     */
  /**
   * @typedef {Object} AllUsersItem
   * @property {Object.<string, boolean>} attachedlocal
   * @property {boolean} blockanononly
   * @property {string} blockedby
   * @property {number} blockedbyid
   * @property {string} blockedtimestamp
   * @property {string} blockedtimestampformatted
   * @property {boolean} blockemail
   * @property {string} blockexpiry
   * @property {number} blockid
   * @property {boolean} blocknocreate
   * @property {boolean} blockowntalk
   * @property {boolean} blockpartial
   * @property {string} blockreason
   * @property {Object.<string, number>} centralids
   * @property {number} editcount
   * @property {string[]} groups
   * @property {string[]} implicitgroups
   * @property {string} name
   * @property {string} registration
   * @property {string[]} rights
   * @property {number} userid
   */
  /**
   * @overload
   * @param {AllUsersRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AllUsersItem>>}
   */
  /**
   * @overload
   * @param {AllUsersRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AllUsersItem, void, unknown>}
   */
  /**
    * @description Enumerate all registered users.
    * @param {AllUsersRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllUsersItem, void, unknown> | Promise<AllUsersItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Allusers
    */
  allusers(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'allusers' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
     * @typedef {Object} BacklinksRequest
     * @property {string} [bltitle]
     *   Title to search. Cannot be used together with blpageid.
     * @property {number} [blpageid]
     *   Page ID to search. Cannot be used together with bltitle.
     * @property {string} [blcontinue]
     *   When more results are available, use this to continue.
     * @property {number|number[]|'*'} [blnamespace]
     *   The namespace to enumerate.
     * @property {'ascending'|'descending'} [bldir]
     *   The direction in which to list.
     *   @default 'ascending'
     * @property {'all'|'nonredirects'|'redirects'} [blfilterredir]
     *   How to filter for redirects. If set to nonredirects when blredirect is enabled, this is only applied to the second level.
     * @property {number|'max'} [bllimit]
     *   How many total pages to return. If blredirect is enabled, the limit applies to each level separately (which means up to 2 * bllimit results may be returned).
     * @property {boolean} [blredirect]
     *   If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
     */
  /**
   * @typedef {Object} BacklinksItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {BacklinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<BacklinksItem>>}
   */
  /**
   * @overload
   * @param {BacklinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<BacklinksItem, void, unknown>}
   */
  /**
    * @description Find all pages that link to the given page.
    * @param {BacklinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<BacklinksItem, void, unknown> | Promise<BacklinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Backlinks
    */
  backlinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'backlinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} BlockRequest
   * @property {number} [id]
   *  ID of the block to modify (obtained through list=blocks). Cannot be used together with user, reblock, or newblock.
   * @property {string} [user]
   *  User to block. Cannot be used together with id.
   * @property {Date | string} [expiry]
   *  Expiry time. May be relative (e.g. 5 months or 2 weeks) or absolute (e.g. 2014-09-18T12:34:56Z). If set to infinite, indefinite, or never, the block will never expire.
   * @property {string} [reason]
   *  Reason for block.
   * @property {boolean} [anononly]
   *  Block anonymous users only (i.e. disable anonymous edits for this IP address, including temporary account edits).
   * @property {boolean} [nocreate]
   *  Prevent account creation.
   * @property {boolean} [autoblock]
   *  Automatically block the last used IP address, and any subsequent IP addresses they try to login from.
   * @property {boolean} [noemail]
   *  Prevent user from sending email through the wiki. (Requires the blockemail right).
   * @property {boolean} [hidename]
   *  Hide the username from the block log. (Requires the hideuser right).
   * @property {boolean} [allowusertalk]
   *  Allow the user to edit their own talk page (depends on $wgBlockAllowsUTEdit).
   * @property {boolean} [reblock]
   *  If the user is already blocked by a single block, overwrite the existing block. If the user is blocked more than once, this will fail—use the id parameter instead to specify which block to overwrite. Cannot be used together with id or newblock.
   * @property {boolean} [newblock]
   *  Add another block even if the user is already blocked. Cannot be used together with id or reblock.
   * @property {boolean} [watchuser]
   *  Watch the user's or IP address's user and talk pages.
   * @property {Date | 'string'} [watchlistexpiry]
   *  Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   * @property {string | string[]} [tags]
   *  Change tags to apply to the entry in the block log.
   * @property {boolean} [partial]
   *  Block user from specific pages or namespaces rather than the entire site.
   * @property {string | string[]} [pagerestrictions]
   *  List of titles to block the user from editing. Only applies when partial is set to true.
   * @property {number | number[] | '*'} [namespacerestrictions]
   *  List of namespace IDs to block the user from editing. Only applies when partial is set to true.
   * @property {string | string[]} [actionrestrictions]
   *  List of actions to block the user from performing. Only applies when partial is set to true.
   */
  /**
   * @typedef {Object} BlockItem
   * @property {string} expiry
   * @property {string} id
   * @property {string} reason
   * @property {string} user
   * @property {number} userID
   */
  /**
    * @description Block a user.
    * @param {BlockRequest} params
    * @returns {Promise<BlockItem>}
    * @see https://www.mediawiki.org/wiki/API:Block
    */
  async block(params) {
    /** @type {{ block: BlockItem }} */
    const request = await this.action(params, { action: 'block' });
    return request.block;
  }

  /**
   * @typedef {Object} BlocksRequest
   * @property {Date|string} [bkstart]
   *   The timestamp to start enumerating from.
   * @property {Date|string} [bkend]
   *   The timestamp to stop enumerating at.
   * @property {'newer'|'older'} [bkdir]
   *   In which direction to enumerate.
   *   @default 'older'
   * @property {number|number[]} [bkids]
   *   List of block IDs to list (optional).
   * @property {string|string[]} [bkusers]
   *   List of users to search for (optional).
   * @property {string} [bkip]
   *   Get all blocks applying to this IP address or CIDR range, including range blocks.
   *   Cannot be used together with bkusers. CIDR ranges broader than IPv4/16 or IPv6/19 are not accepted.
   * @property {number|'max'} [bklimit]
   *   The maximum number of blocks to list.
   * @property {Prop<
   *   'id'
   *   | 'user'
   *   | 'userid'
   *   | 'by'
   *   | 'byid'
   *   | 'timestamp'
   *   | 'expiry'
   *   | 'reason'
   *   | 'parsedreason'
   *   | 'range'
   *   | 'flags'
   *   | 'restrictions'
   * >} [bkprop]
   *   Which properties to get:
   * @property {Prop<'!account'|'!ip'|'!range'|'!temp'|'account'|'ip'|'range'|'temp'>} [bkshow]
   *   Show only items that meet these criteria.
   * @property {string} [bkcontinue]
   *   When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} BlocksItem
   * @property {boolean} allowusertalk
   * @property {boolean} anononly
   * @property {boolean} autoblock
   * @property {boolean} automatic
   * @property {string} by
   * @property {number} byid
   * @property {string} duration-l10n
   * @property {string} expiry
   * @property {boolean} hidden
   * @property {number} id
   * @property {boolean} nocreate
   * @property {boolean} noemail
   * @property {string} parsedreason
   * @property {boolean} partial
   * @property {string} reason
   * @property {unknown[]} restrictions
   * @property {string} timestamp
   */
  /**
   * @overload
   * @param {BlocksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<BlocksItem>>}
   */
  /**
   * @overload
   * @param {BlocksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<BlocksItem, void, unknown>}
   */
  /**
    * @description List all blocked users and IP addresses.
    * @param {BlocksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<BlocksItem, void, unknown> | Promise<BlocksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Blocks
    */
  blocks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'blocks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} CategoriesRequest
   * @property {Prop<'sortkey'|'timestamp'|'hidden'>} [clprop]
   *   Which additional properties to get for each category:
   * @property {Prop<'!hidden'|'hidden'>} [clshow]
   *   Which kind of categories to show.
   * @property {number|'max'} [cllimit]
   *   How many categories to return.
   * @property {string} [clcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} [clcategories]
   *   Only list these categories. Useful for checking whether a certain page is in a certain category.
   * @property {'ascending'|'descending'} [cldir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} CategoriesItem
   * @property {Array<Object>} categorymembers
   * @property {boolean} categorymembers[].hidden
   * @property {number} categorymembers[].ns
   * @property {string} categorymembers[].sortkey
   * @property {string} categorymembers[].sortkeyprefix
   * @property {string} categorymembers[].timestamp
   * @property {string} categorymembers[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {CategoriesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<CategoriesItem>>}
   */
  /**
   * @overload
   * @param {CategoriesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<CategoriesItem, void, unknown>}
   */
  /**
    * @description List all categories the pages belong to.
    * @param {CategoriesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<CategoriesItem, void, unknown> | Promise<CategoriesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Categories
    */
  categories(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'categories' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} CategoryInfoRequest
   * @property {string} [cicontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} CategoryInfoItem
   * @property {Object} categoryinfo
   * @property {number} categoryinfo.files
   * @property {boolean} categoryinfo.hidden
   * @property {number} categoryinfo.pages
   * @property {number} categoryinfo.size
   * @property {number} categoryinfo.subcats
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {CategoryInfoRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<CategoryInfoItem>>}
   */
  /**
   * @overload
   * @param {CategoryInfoRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<CategoryInfoItem, void, unknown>}
   */
  /**
    * @description Returns information about the given categories.
    * @param {CategoryInfoRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<CategoryInfoItem, void, unknown> | Promise<CategoryInfoItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Categoryinfo
    */
  categoryinfo(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'categoryinfo' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} CategoryMembersRequest
   * @property {string} [cmtitle]
   *   Which category to enumerate (required). Must include the Category: prefix.
   *   Cannot be used together with cmpageid.
   * @property {number} [cmpageid]
   *   Page ID of the category to enumerate. Cannot be used together with cmtitle.
   * @property {Prop<'ids'|'title'|'sortkey'|'sortkeyprefix'|'type'|'timestamp'>} [cmprop]
   *   Which pieces of information to include:
   * @property {number|number[]|'*'} [cmnamespace]
   *   Only include pages in these namespaces. Note that cmtype=subcat or cmtype=file may be
   *   used instead of cmnamespace=14 or 6.
   * @property {Prop<'page'|'subcat'|'file'>} [cmtype]
   *   Which type of category members to include. Ignored when cmsort=timestamp is set.
   * @property {string} [cmcontinue]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [cmlimit]
   *   The maximum number of pages to return.
   * @property {'sortkey'|'timestamp'} [cmsort]
   *   Property to sort by.
   *   @default 'sortkey'
   * @property {'asc'|'ascending'|'desc'|'descending'|'newer'|'older'} [cmdir]
   *   In which direction to sort.
   *   @default 'ascending'
   * @property {Date|string} [cmstart]
   *   Timestamp to start listing from. Can only be used with cmsort=timestamp.
   * @property {Date|string} [cmend]
   *   Timestamp to end listing at. Can only be used with cmsort=timestamp.
   * @property {string} [cmstarthexsortkey]
   *   Sortkey to start listing from, as returned by cmprop=sortkey. Can only be used with cmsort=sortkey.
   * @property {string} [cmendhexsortkey]
   *   Sortkey to end listing at, as returned by cmprop=sortkey. Can only be used with cmsort=sortkey.
   * @property {string} [cmstartsortkeyprefix]
   *   Sortkey prefix to start listing from. Can only be used with cmsort=sortkey. Overrides cmstarthexsortkey.
   * @property {string} [cmendsortkeyprefix]
   *   Sortkey prefix to end listing before (not at; if this value occurs it will not be included!).
   *   Can only be used with cmsort=sortkey. Overrides cmendhexsortkey.
   */
  /**
   * @typedef {Object} CategoryMembersItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} sortkey
   * @property {string} sortkeyprefix
   * @property {string} timestamp
   * @property {string} title
   * @property {string} type
   */
  /**
   * @overload
   * @param {CategoryMembersRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<CategoryMembersItem>>}
   */
  /**
   * @overload
   * @param {CategoryMembersRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<CategoryMembersItem, void, unknown>}
   */
  /**
    * @description List all pages in a given category.
    * @param {CategoryMembersRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<CategoryMembersItem, void, unknown> | Promise<CategoryMembersItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Categorymembers
    */
  categorymembers(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'categorymembers' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ContributorsRequest
   * @property {string|string[]} [pcgroup]
   *   Only include users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
   * @property {string|string[]} [pcexcludegroup]
   *   Exclude users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
   * @property {string|string[]} [pcrights]
   *   Only include users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
   * @property {string|string[]} [pcexcluderights]
   *   Exclude users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
   * @property {number|'max'} [pclimit]
   *   How many contributors to return.
   * @property {string} [pccontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} ContributorsItem
   * @property {Array<Object>} contributors
   * @property {string} contributors[].name
   * @property {number} contributors[].userid
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {ContributorsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ContributorsItem>>}
   */
  /**
   * @overload
   * @param {ContributorsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ContributorsItem, void, unknown>}
   */
  /**
    * @description Get the list of logged-in contributors (including temporary users) and the count of
    * @param {ContributorsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ContributorsItem, void, unknown> | Promise<ContributorsItem[]>}
    *   logged-out contributors to a ContributorsItem.
    * @see https://www.ContributorsItem.org/wiki/API:Contributors
    */
  contributors(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'contributors' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  async csrfToken(force = false) {
    const tokens = await this.tokens('csrf', force);
    return tokens.csrftoken;
  }

  /**
   * @typedef {Object} DeletedRevisionsRequest
   * @property {Array<Object>} deletedrevisions
   * @property {string} deletedrevisions[].comment
   * @property {boolean} deletedrevisions[].minor
   * @property {boolean} deletedrevisions[].missing
   * @property {number} deletedrevisions[].ns
   * @property {number} deletedrevisions[].parentid
   * @property {string} deletedrevisions[].parsedcomment
   * @property {number} deletedrevisions[].revid
   * @property {string[]} deletedrevisions[].roles
   * @property {string} deletedrevisions[].sha1
   * @property {Object} deletedrevisions[].slots
   * @property {Object} deletedrevisions[].slots.main
   * @property {string} deletedrevisions[].slots.main.content
   * @property {string} deletedrevisions[].slots.main.contentformat
   * @property {string} deletedrevisions[].slots.main.contentmodel
   * @property {string} deletedrevisions[].slots.main.sha1
   * @property {number} deletedrevisions[].slots.main.size
   * @property {boolean} deletedrevisions[].timestamp
   * @property {string} deletedrevisions[].user
   * @property {number} deletedrevisions[].userid
   * @property {string} title
   */
  /**
   * @typedef {Object} DeletedRevisionsItem
   * @property {Array<Object>} deletedrevisions
   * @property {string} deletedrevisions[].comment
   * @property {boolean} deletedrevisions[].minor
   * @property {boolean} deletedrevisions[].missing
   * @property {number} deletedrevisions[].ns
   * @property {number} deletedrevisions[].parentid
   * @property {string} deletedrevisions[].parsedcomment
   * @property {number} deletedrevisions[].revid
   * @property {string[]} deletedrevisions[].roles
   * @property {string} deletedrevisions[].sha1
   * @property {Object} deletedrevisions[].slots
   * @property {Object} deletedrevisions[].slots.main
   * @property {string} deletedrevisions[].slots.main.content
   * @property {string} deletedrevisions[].slots.main.contentformat
   * @property {string} deletedrevisions[].slots.main.contentmodel
   * @property {string} deletedrevisions[].slots.main.sha1
   * @property {number} deletedrevisions[].slots.main.size
   * @property {boolean} deletedrevisions[].timestamp
   * @property {string} deletedrevisions[].user
   * @property {number} deletedrevisions[].userid
   * @property {string} title
   */
  /**
   * @overload
   * @param {DeletedRevisionsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<DeletedRevisionsItem>>}
   */
  /**
   * @overload
   * @param {DeletedRevisionsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<DeletedRevisionsItem, void, unknown>}
   */
  /**
    * @description Get deleted revision information.
    * @param {DeletedRevisionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<DeletedRevisionsItem, void, unknown> | Promise<DeletedRevisionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Deletedrevisions
    */
  deletedrevisions(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'deletedrevisions' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} DuplicateFilesRequest
   * @property {number|'max'} [dflimit]
   *   How many duplicate files to return.
   * @property {string} [dfcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [dfdir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {boolean} [dflocalonly]
   *   Look only for files in the local repository.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} DuplicateFilesItem
   * @property {boolean} missing
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {DuplicateFilesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<DuplicateFilesItem>>}
   */
  /**
   * @overload
   * @param {DuplicateFilesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<DuplicateFilesItem, void, unknown>}
   */
  /**
    * @description List all files that are duplicates of the given files based on hash values.
    * @param {DuplicateFilesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<DuplicateFilesItem, void, unknown> | Promise<DuplicateFilesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Duplicatefiles
    */
  duplicatefiles(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'duplicatefiles' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} EditRequest
   * @property {string} [title]
   *  Title of the page to edit. Cannot be used together with pageid.
   * @property {number} [pageid]
   *  Page ID of the page to edit. Cannot be used together with title.
   * @property {string} [section]
   *  Section identifier. 0 for the top section, new for a new section. Often a positive integer, but can also be non-numeric.
   * @property {string} [sectiontitle]
   *  The title for a new section when using section=new.
   * @property {string} [text]
   *  Page content.
   * @property {string} [summary]
   *  Edit summary.
   *  When this parameter is not provided or empty, an edit summary may be generated automatically.
   *  When using section=new and sectiontitle is not provided, the value of this parameter is used for the section title instead, and an edit summary is generated automatically.
   * @property {string | string[]} [tags]
   *  Change tags to apply to the revision.
   * @property {boolean} [minor]
   *  Mark this edit as a minor edit.
   * @property {boolean} [notminor]
   *  Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
   * @property {boolean} [bot]
   *  Mark this edit as a bot edit.
   * @property {number} [baserevid]
   *  ID of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions. Self-conflicts cause the edit to fail unless basetimestamp is set.
   * @property {Date | string} [basetimestamp]
   *  Timestamp of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions&rvprop=timestamp. Self-conflicts are ignored.
   * @property {Date | string} [starttimestamp]
   *  Timestamp when the editing process began, used to detect edit conflicts. An appropriate value may be obtained using curtimestamp when beginning the edit process (e.g. when loading the page content to edit).
   * @property {boolean} [recreate]
   *  Override any errors about the page having been deleted in the meantime.
   * @property {boolean} [createonly]
   *  Don't edit the page if it exists already.
   * @property {string} [nocreate]
   *  Throw an error if the page doesn't exist.
   * @property {'nochange' | 'preferences' | 'unwatch' | 'watch'} [watchlist]
   *  Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   * @property {Date | string} [watchlistexpiry]
   *  Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   * @property {string} [md5]
   *  The MD5 hash of the text parameter, or the prependtext and appendtext parameters concatenated. If set, the edit won't be done unless the hash is correct.
   * @property {string} [prependtext]
   *  Add this text to the beginning of the page or section. Overrides text.
   * @property {string} [appendtext]
   *  Add this text to the end of the page or section. Overrides text.
   * @property {number} [undo]
   *  Undo this revision. Overrides text, prependtext and appendtext.
   * @property {number} [undoafter]
   *  Undo all revisions from undo to this one. If not set, just undo one revision.
   * @property {boolean} [redirect]
   *  Automatically resolve redirects.
   * @property {string} [contentformat]
   *  Content serialization format used for the input text.
   * @property {string} [contentmodel]
   *  Content model of the new content.
   * @property {string} [returnto]
   *  Page title. If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to the given page, instead of the page that was edited.
   * @property {string} [returntoquery]
   *  URL query parameters (with leading ?). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given query parameters.
   * @property {string} [returntoanchor]
   *  URL fragment (with leading #). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given fragment.
   * @property {string} [captchaword]
   *  Answer to the CAPTCHA
   * @property {string} [captchaid]
   *  CAPTCHA ID from previous request
   */
  /**
   * @typedef {Object} EditItem
   * @property {string} contentmodel
   * @property {number} newrevid
   * @property {string} newtimestamp
   * @property {number} oldrevid
   * @property {number} pageid
   * @property {string} result
   * @property {string} title
   */
  /**
    * @description Create and edit pages.
    * @param {EditRequest} params
    * @returns {Promise<EditItem>}
    * @see https://www.mediawiki.org/wiki/API:Edit
    */
  async edit(params) {
    /** @type {{ edit: EditItem }} */
    const request = await this.action(params, {
      action: 'edit',
      assert: params.bot ? 'bot' : 'user',
    });
    return request.edit;
  }

  /**
   * @typedef {Object} EmbeddedInRequest
   * @property {string} [eititle]
   *   Title to search. Cannot be used together with eipageid.
   * @property {number} [eipageid]
   *   Page ID to search. Cannot be used together with eititle.
   * @property {string} [eicontinue]
   *   When more results are available, use this to continue.
   * @property {number|number[]|'*'} [einamespace]
   *   The namespace to enumerate.
   * @property {'ascending'|'descending'} [eidir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {'all'|'nonredirects'|'redirects'} [eifilterredir]
   *   How to filter for redirects.
   *   @default 'all'
   * @property {number|'max'} [eilimit]
   *   How many total pages to return.
   */
  /**
   * @typedef {Object} EmbeddedInItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {EmbeddedInRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<EmbeddedInItem>>}
   */
  /**
   * @overload
   * @param {EmbeddedInRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<EmbeddedInItem, void, unknown>}
   */
  /**
    * @description Find all pages that embed (transclude) the given title.
    * @param {EmbeddedInRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<EmbeddedInItem, void, unknown> | Promise<EmbeddedInItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Embeddedin
    */
  embeddedin(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'embeddedin' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ExtLinksRequest
   * @property {number|'max'} [ellimit]
   *   How many links to return.
   * @property {string} [elcontinue]
   *   When more results are available, use this to continue.
   * @property {string} [elprotocol]
   *   Protocol of the URL. If empty and elquery is set, the protocol is http and https. Leave both this and elquery empty to list all external links.
   * @property {string} [elquery]
   *   Search string without protocol. Useful for checking whether a certain page contains a certain external url.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} ExtLinksItem
   * @property {Array<Object>} extlinks
   * @property {string} extlinks[].url
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {ExtLinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ExtLinksItem>>}
   */
  /**
   * @overload
   * @param {ExtLinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ExtLinksItem, void, unknown>}
   */
  /**
    * @description Returns all external URLs (not interwikis) from the given pages.
    * @param {ExtLinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ExtLinksItem, void, unknown> | Promise<ExtLinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Extlinks
    */
  extlinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'extlinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ExtUrlUsageRequest
   * @property {Prop<'ids'|'title'|'url'>} [euprop]
   *   Which pieces of information to include:
   * @property {string} [eucontinue]
   *   When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
   * @property {string|string[]} [euprotocol]
   *   Protocol of the URL. If empty and euquery is set, the protocol is http and https.
   *   Leave both this and euquery empty to list all external links.
   * @property {string} [euquery]
   *   Search string without protocol. See Special:LinkSearch. Leave empty to list all external links.
   * @property {number|number[]|'*'} [eunamespace]
   *   The page namespaces to enumerate.
   * @property {number|'max'} [eulimit]
   *   How many pages to return.
   */
  /**
   * @typedef {Object} ExtUrlUsageItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   * @property {string} url
   */
  /**
   * @overload
   * @param {ExtUrlUsageRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ExtUrlUsageItem>>}
   */
  /**
   * @overload
   * @param {ExtUrlUsageRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ExtUrlUsageItem, void, unknown>}
   */
  /**
    * @description Enumerate pages that contain a given URL.
    * @param {ExtUrlUsageRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ExtUrlUsageItem, void, unknown> | Promise<ExtUrlUsageItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Exturlusage
    */
  exturlusage(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'exturlusage' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} FileArchiveRequest
   * @property {string} [fafrom]
   *   The image title to start enumerating from.
   * @property {string} [fato]
   *   The image title to stop enumerating at.
   * @property {string} [faprefix]
   *   Search for all image titles that begin with this value.
   * @property {'ascending'|'descending'} [fadir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string} [fasha1]
   *   SHA1 hash of image. Overrides fasha1base36.
   * @property {string} [fasha1base36]
   *   SHA1 hash of image in base 36 (used in MediaWiki).
   * @property {Prop<
   *   'sha1'
   *   | 'timestamp'
   *   | 'user'
   *   | 'size'
   *   | 'dimensions'
   *   | 'description'
   *   | 'parseddescription'
   *   | 'mime'
   *   | 'mediatype'
   *   | 'metadata'
   *   | 'bitdepth'
   *   | 'archivename'
   * >} [faprop]
   *   Which image information to get.
   * @property {number|'max'} [falimit]
   *   How many images to return in total.
   * @property {string} [facontinue]
   *   When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} FileArchiveItem
   * @property {`${number}`} bitdepth
   * @property {string} description
   * @property {`${number}`} height
   * @property {number} id
   * @property {string} mediatype
   * @property {Array<Object>} metadata
   * @property {string} metadata[].name
   * @property {unknown} metadata[].value
   * @property {string} mime
   * @property {string} name
   * @property {number} ns
   * @property {string} parseddescription
   * @property {string} sha1
   * @property {`${number}`} size
   * @property {string} timestamp
   * @property {string} title
   * @property {string} user
   * @property {number} userid
   * @property {`${number}`} width
   */
  /**
   * @overload
   * @param {FileArchiveRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<FileArchiveItem>>}
   */
  /**
   * @overload
   * @param {FileArchiveRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<FileArchiveItem, void, unknown>}
   */
  /**
    * @description Enumerate all deleted files sequentially.
    * @param {FileArchiveRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<FileArchiveItem, void, unknown> | Promise<FileArchiveItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Filearchive
    */
  filearchive(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'filearchive' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} FileRepoInfoRequest
   * @property {Prop<
      'canUpload'
      | 'descBaseUrl'
      | 'descriptionCacheExpiry'
      | 'displayname'
      | 'favicon'
      | 'fetchDescription'
      | 'initialCapital'
      | 'local'
      | 'name'
      | 'rootUrl'
      | 'scriptDirUrl'
      | 'thumbUrl'
      | 'url'
  >} fiprop
        Which repository properties to get.
   */
  /**
   * @typedef {Object} FileRepoInfoItem
   * @property {boolean} canUpload
   * @property {string} descBaseUrl
   * @property {string} descriptionCacheExpiry
   * @property {string} displayname
   * @property {string} favicon
   * @property {boolean} fetchDescription
   * @property {boolean} initialCapital
   * @property {boolean} local
   * @property {string} name
   * @property {string} rootUrl
   * @property {string} scriptDirUrl
   * @property {string} thumbUrl
   * @property {string} url
   */
  /**
    * @description Return meta information about image repositories configured on the wiki.
    * @param {FileRepoInfoRequest} params
    * @returns {Promise<FileRepoInfoItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Filerepoinfo
    */
  async filerepoinfo(params) {
    /** @type {{ query: { repos: FileRepoInfoItem[] }}} */
    const result = await this.query(params, { meta: 'filerepoinfo' });

    return result.query.repos;
  }

  /**
   * @typedef {Object} FileUsageRequest
   * @property {Prop<'pageid'|'title'|'redirect'>} [fuprop]
   *   Which properties to get:
   * @property {number|number[]|'*'} [funamespace]
   *   Only include pages in these namespaces.
   * @property {Prop<'!redirect'|'redirect'>} [fushow]
   *   Show only items that meet these criteria:
   * @property {number|'max'} [fulimit]
   *   How many to return.
   * @property {string} [fucontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} FileUsageItem
   * @property {Array<Object>} fileusage
   * @property {number} fileusage[].ns
   * @property {number} fileusage[].pageid
   * @property {boolean} fileusage[].redirect
   * @property {string} fileusage[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {FileUsageRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<FileUsageItem>>}
   */
  /**
   * @overload
   * @param {FileUsageRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<FileUsageItem, void, unknown>}
   */
  /**
    * @description Find all pages that use the given files.
    * @param {FileUsageRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<FileUsageItem, void, unknown> | Promise<FileUsageItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Fileusage
    */
  fileusage(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'fileusage' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} GlobalUsageRequest
   * @property {Prop<'url'|'pageid'|'namespace'>} [guprop]
   *   Which properties to return:
   * @property {number|'max'} [gulimit]
   *   How many links to return.
   * @property {number|number[]|'*'} [gunamespace]
   *   Limit results to these namespaces.
   * @property {string|string[]} [gusite]
   *   Limit results to these sites.
   * @property {string} [gucontinue]
   *   When more results are available, use this to continue.
   * @property {boolean} [gufilterlocal]
   *   Filter local usage of the file.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} GlobalUsageItem
   * @property {Array<Object>} globalusage
   * @property {string} globalusage[].ns
   * @property {string} globalusage[].pageid
   * @property {string} globalusage[].title
   * @property {string} globalusage[].url
   * @property {string} globalusage[].wiki
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {GlobalUsageRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<GlobalUsageItem>>}
   */
  /**
   * @overload
   * @param {GlobalUsageRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<GlobalUsageItem, void, unknown>}
   */
  /**
    * @description Returns global image usage for a certain image.
    * @param {GlobalUsageRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<GlobalUsageItem, void, unknown> | Promise<GlobalUsageItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Globalusage
    */
  globalusage(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'globalusage' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ImageInfoRequest
   * @property {Prop<
   *   'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'canonicaltitle'
   *   | 'url'
   *   | 'size'
   *   | 'dimensions'
   *   | 'sha1'
   *   | 'mime'
   *   | 'thumbmime'
   *   | 'mediatype'
   *   | 'metadata'
   *   | 'commonmetadata'
   *   | 'extmetadata'
   *   | 'archivename'
   *   | 'bitdepth'
   *   | 'uploadwarning'
   *   | 'badfile'
   * >} [iiprop]
   *   Which file information to get:
   * @property {number|'max'} [iilimit]
   *   How many file revisions to return per file.
   * @property {Date|string} [iistart]
   *   Timestamp to start listing from.
   * @property {Date|string} [iiend]
   *   Timestamp to stop listing at.
   * @property {number} [iiurlwidth]
   *   If iiprop=url is set, a URL to an image scaled to this width will be returned.
   * @property {number} [iiurlheight]
   *   Similar to iiurlwidth.
   * @property {number} [iimetadataversion]
   *   Version of metadata to use. If latest is specified, use latest version. Defaults to 1 for backwards compatibility.
   * @property {string} [iiextmetadatalanguage]
   *   What language to fetch extmetadata in. This affects both which translation to fetch, if multiple are available, as well as how things like numbers and various values are formatted.
   * @property {boolean} [iiextmetadatamultilang]
   *   If translations for extmetadata property are available, fetch all of them.
   * @property {string|string[]} [iiextmetadatafilter]
   *   If specified and non-empty, only these keys will be returned for iiprop=extmetadata.
   * @property {string} [iiurlparam]
   *   A handler specific parameter string. For example, PDFs might use page15-100px. iiurlwidth must be used and be consistent with iiurlparam.
   * @property {string} [iibadfilecontexttitle]
   *   If badfilecontexttitleprop=badfile is set, this is the page title used when evaluating the MediaWiki:Bad image list
   * @property {string} [iicontinue]
   *   When more results are available, use this to continue.
   * @property {boolean} [iilocalonly]
   *   Look only for files in the local repository.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} ImageInfoItem
   * @property {boolean} badfile
   * @property {Array<Object>} imageinfo
   * @property {number} imageinfo[].bitdepth
   * @property {string} imageinfo[].canonicaltitle
   * @property {string} imageinfo[].comment
   * @property {Array<Object>} imageinfo[].commonmetadata
   * @property {string} imageinfo[].commonmetadata[].name
   * @property {unknown} imageinfo[].commonmetadata[].value
   * @property {string} imageinfo[].descriptionshorturl
   * @property {string} imageinfo[].descriptionurl
   * @property {Object.<string, Object>} imageinfo[].extmetadata
   * @property {boolean} imageinfo[].filemissing
   * @property {number} imageinfo[].height
   * @property {string} imageinfo[].html
   * @property {string} imageinfo[].mediatype
   * @property {Array<Object>} imageinfo[].metadata
   * @property {string} imageinfo[].metadata[].name
   * @property {unknown} imageinfo[].metadata[].value
   * @property {string} imageinfo[].mime
   * @property {string} imageinfo[].parsedcomment
   * @property {string} imageinfo[].sha1
   * @property {string} imageinfo[].timestamp
   * @property {string} imageinfo[].url
   * @property {string} imageinfo[].user
   * @property {number} imageinfo[].userid
   * @property {number} imageinfo[].width
   * @property {string} imagerepository
   * @property {boolean} missing
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {ImageInfoRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ImageInfoItem>>}
   */
  /**
   * @overload
   * @param {ImageInfoRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ImageInfoItem, void, unknown>}
   */
  /**
    * @description Returns file information and upload history.
    * @param {ImageInfoRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ImageInfoItem, void, unknown> | Promise<ImageInfoItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Imageinfo
    */
  imageinfo(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'imageinfo' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ImagesRequest
   * @property {number|'max'} [imlimit]
   *   How many files to return.
   * @property {string} [imcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} [imimages]
   *   Only list these files. Useful for checking whether a certain page has a certain file.
   * @property {'ascending'|'descending'} [imdir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} ImagesItem
   * @property {Array<Object>} images
   * @property {number} images[].ns
   * @property {string} images[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {ImagesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ImagesItem>>}
   */
  /**
   * @overload
   * @param {ImagesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ImagesItem, void, unknown>}
   */
  /**
    * @description Return all files contained on the given pages.
    * @param {ImagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ImagesItem, void, unknown> | Promise<ImagesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Images
    */
  images(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'images' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ImageUsageRequest
   * @property {string} [iutitle]
   *   Title to search. Cannot be used together with iupageid.
   * @property {number} [iupageid]
   *   Page ID to search. Cannot be used together with iutitle.
   * @property {string} [iucontinue]
   *   When more results are available, use this to continue.
   * @property {number|number[]|'*'} [iunamespace]
   *   The namespace to enumerate.
   * @property {'ascending'|'descending'} [iudir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {'all'|'nonredirects'|'redirects'} [iufilterredir]
   *   How to filter for redirects. If set to nonredirects when iuredirect is enabled, this is only applied to the second level.
   *   @default 'all'
   * @property {number|'max'} [iulimit]
   *   How many total pages to return. If iuredirect is enabled, the limit applies to each level separately (which means up to 2 * iulimit results may be returned).
   * @property {boolean} [iuredirect]
   *   If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
   */
  /**
   * @typedef {Object} ImageUsageItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {ImageUsageRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ImageUsageItem>>}
   */
  /**
   * @overload
   * @param {ImageUsageRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ImageUsageItem, void, unknown>}
   */
  /**
    * @description Find all pages that use the given image title.
    * @param {ImageUsageRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ImageUsageItem, void, unknown> | Promise<ImageUsageItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Imageusage
    */
  imageusage(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'imageusage' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} InfoRequest
   * @property {Prop<
   *   'protection'
   *   | 'talkid'
   *   | 'watched'
   *   | 'watchers'
   *   | 'visitingwatchers'
   *   | 'notificationtimestamp'
   *   | 'subjectid'
   *   | 'associatedpage'
   *   | 'url'
   *   | 'preloadcontent'
   *   | 'editintro'
   *   | 'displaytitle'
   *   | 'varianttitles'
   *   | 'linkclasses'
   * >} [inprop]
   *   Which additional properties to get:
   * @property {string} [inlinkcontext]
   *   The context title to use when determining extra CSS classes (e.g. link colors) when inprop contains linkclasses.
   * @property {string|string[]} [intestactions]
   *   Test whether the current user can perform certain actions on the page.
   * @property {'boolean'|'full'|'quick'} [intestactionsdetail]
   *   Detail level for intestactions. Use the main module's errorformat and errorlang parameters to control the format of the messages returned.
   * @property {boolean} [intestactionsautocreate]
   *   Test whether performing intestactions would automatically create a temporary account.
   * @property {string} [inpreloadcustom]
   *   Title of a custom page to use as preloaded content.
   *   Only used when inprop contains preloadcontent.
   * @property {string|string[]} [inpreloadparams]
   *   Parameters for the custom page being used as preloaded content.
   *   Only used when inprop contains preloadcontent.
   * @property {boolean} [inpreloadnewsection]
   *   Return preloaded content for a new section on the page, rather than a new page.
   *   Only used when inprop contains preloadcontent.
   * @property {'lessframes'|'moreframes'} [ineditintrostyle]
   *   Some intro messages come with optional wrapper frames. Use moreframes to include them or lessframes to omit them.
   *   Only used when inprop contains editintro.
   *   @default 'moreframes'
   * @property {string|string[]} [ineditintroskip]
   *   List of intro messages to remove from the response. Use this if a specific message is not relevant to your tool, or if the information is conveyed in a different way.
   *   Only used when inprop contains editintro.
   * @property {string} [ineditintrocustom]
   *   Title of a custom page to use as an additional intro message.
   *   Only used when inprop contains editintro.
   * @property {string} [incontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} InfoItem
   * @property {string} associatedpage
   * @property {string} canonicalurl
   * @property {string} contentmodel
   * @property {string} displaytitle
   * @property {Object.<string, string>} editintro
   * @property {string} editurl
   * @property {string} fullurl
   * @property {number} lastrevid
   * @property {number} length
   * @property {string[]} linkclasses
   * @property {string} notificationtimestamp
   * @property {number} ns
   * @property {number} pageid
   * @property {string} pagelanguage
   * @property {string} pagelanguagedir
   * @property {string} pagelanguagehtmlcode
   * @property {Array<Object>} protection
   * @property {string} protection[].expiry
   * @property {string} protection[].level
   * @property {string} protection[].type
   * @property {string[]} restrictiontypes
   * @property {number} talkid
   * @property {string} title
   * @property {string} touched
   * @property {Object.<string, string>} varianttitles
   * @property {number} visitingwatchers
   * @property {boolean} watched
   * @property {number} watchers
   */
  /**
   * @overload
   * @param {InfoRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<InfoItem>>}
   */
  /**
   * @overload
   * @param {InfoRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<InfoItem, void, unknown>}
   */
  /**
    * @description Get basic page information.
    * @param {InfoRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<InfoItem, void, unknown> | Promise<InfoItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Info
    */
  info(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'info' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} IwBacklinksRequest
   * @property {string} [iwblprefix]
   *   Prefix for the interwiki.
   * @property {string} [iwbltitle]
   *   Interwiki link to search for. Must be used with iwblblprefix.
   * @property {string} [iwblcontinue]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [iwbllimit]
   *   How many total pages to return.
   * @property {Prop<'iwprefix'|'iwtitle'>} [iwblprop]
   *   Which properties to get:
   * @property {'ascending'|'descending'} [iwbldir]
   *   The direction in which to list.
   *   @default 'ascending'
   */
  /**
   * @typedef {Object} IwBacklinksItem
   * @property {string} iwprefix
   * @property {string} iwtitle
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {IwBacklinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<IwBacklinksItem>>}
   */
  /**
   * @overload
   * @param {IwBacklinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<IwBacklinksItem, void, unknown>}
   */
  /**
    * @description Find all pages that link to the given interwiki link.
    * @param {IwBacklinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<IwBacklinksItem, void, unknown> | Promise<IwBacklinksItem[]>}
    *   Can be used to find all links with a prefix, or all links to a title
    *   (with a given prefix). Using neither parameter is effectively
    *   "all interwiki links".
    * @see https://IwBacklinksItem.mediawiki.org/wiki/API:Iwbacklinks
    */
  iwbacklinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'iwbacklinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} IwLinksRequest
   * @property {Prop<'url'>} [iwprop]
   *   Which additional properties to get for each interwiki link:
   * @property {string} [iwprefix]
   *   Only return interwiki links with this prefix.
   * @property {string} [iwtitle]
   *   Interwiki link to search for. Must be used with iwprefix.
   * @property {'ascending'|'descending'} [iwdir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {number|'max'} [iwlimit]
   *   How many interwiki links to return.
   * @property {string} [iwcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} IwLinksItem
   * @property {Array<Object>} iwlinks
   * @property {string} iwlinks[].prefix
   * @property {string} iwlinks[].title
   * @property {string} iwlinks[].url
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {IwLinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<IwLinksItem>>}
   */
  /**
   * @overload
   * @param {IwLinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<IwLinksItem, void, unknown>}
   */
  /**
    * @description Returns all interwiki links from the given pages.
    * @param {IwLinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<IwLinksItem, void, unknown> | Promise<IwLinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Iwlinks
    */
  iwlinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'iwlinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LangBacklinksRequest
   * @property {string} [lbllang]
   *   Language for the language link.
   * @property {string} [lbltitle]
   *   Language link to search for. Must be used with lbllang.
   * @property {string} [lblcontinue]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [lbllimit]
   *   How many total pages to return.
   * @property {Prop<'lllang'|'lltitle'>} [lblprop]
   *   Which properties to get:
   * @property {'ascending'|'descending'} [lbldir]
   *   The direction in which to list.
   *   @default 'ascending'
   */
  /**
   * @typedef {Object} LangBacklinksItem
   * @property {string} lllang
   * @property {string} lltitle
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {LangBacklinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<LangBacklinksItem>>}
   */
  /**
   * @overload
   * @param {LangBacklinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<LangBacklinksItem, void, unknown>}
   */
  /**
    * @description Find all pages thast link to the given language link.
    *   Can be used to find all links with a language code, or all links to
    *   a title (with a given language). Using neither parameter is effectively
    *   "all language links".
    * @param {LangBacklinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<LangBacklinksItem, void, unknown> | Promise<LangBacklinksItem[]>}
    * @see https://LangBacklinksItem.mediawiki.org/wiki/API:Langbacklinks
    */
  langbacklinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'langbacklinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LangLinksRequest
   * @property {Prop<'url'|'langname'|'autonym'>} [llprop]
   *   Which additional properties to get for each interlanguage link:
   * @property {string} [lllang]
   *   Only return language links with this language code.
   * @property {string} [lltitle]
   *   Link to search for. Must be used with lllang.
   * @property {'ascending'|'descending'} [lldir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string} [llinlanguagecode]
   *   Language code for localised language names.
   * @property {number|'max'} [lllimit]
   *   How many langlinks to return.
   * @property {string} [llcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} LangLinksItem
   * @property {Array<Object>} langlinks
   * @property {string} langlinks[].autonym
   * @property {string} langlinks[].lang
   * @property {string} langlinks[].langname
   * @property {string} langlinks[].title
   * @property {string} langlinks[].url
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {LangLinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<LangLinksItem>>}
   */
  /**
   * @overload
   * @param {LangLinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<LangLinksItem, void, unknown>}
   */
  /**
    * @description Returns all interlanguage links from the given pages.
    * @param {LangLinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<LangLinksItem, void, unknown> | Promise<LangLinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Langlinks
    */
  langlinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'langlinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LinksRequest
   * @property {number|number[]|'*'} [plnamespace]
   *   Show links in these namespaces only.
   * @property {number|'max'} [pllimit]
   *   How many links to return.
   * @property {string} [plcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} [pltitles]
   *   Only list links to these titles. Useful for checking whether a certain page links to a certain title.
   * @property {'ascending'|'descending'} [pldir]
   *   The direction in which to list.
   *   @default 'ascending'
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} LinksItem
   * @property {Array<Object>} links
   * @property {number} links[].ns
   * @property {string} links[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {LinksRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<LinksItem>>}
   */
  /**
   * @overload
   * @param {LinksRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<LinksItem, void, unknown>}
   */
  /**
    * @description Returns all links from the given pages.
    * @param {LinksRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<LinksItem, void, unknown> | Promise<LinksItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Links
    */
  links(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'links' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LinksHereRequest
   * @property {Prop<'pageid'|'title'|'redirect'>} [lhprop]
   *   Which properties to get:
   * @property {number|number[]|'*'} [lhnamespace]
   *   Only include pages in these namespaces.
   * @property {Prop<'!redirect'|'redirect'>} [lhshow]
   *   Show only items that meet these criteria:
   * @property {number|'max'} [lhlimit]
   *   How many to return.
   * @property {string} [lhcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} LinksHereItem
   * @property {Array<Object>} linkshere
   * @property {number} linkshere[].ns
   * @property {number} linkshere[].pageid
   * @property {boolean} linkshere[].redirect
   * @property {string} linkshere[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {LinksHereRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<LinksHereItem>>}
   */
  /**
   * @overload
   * @param {LinksHereRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<LinksHereItem, void, unknown>}
   */
  /**
    * @description Find all pages that link to the given pages.
    * @param {LinksHereRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<LinksHereItem, void, unknown> | Promise<LinksHereItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Linkshere
    */
  linkshere(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'linkshere' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LogEventsRequest
   * @property {Prop<
   *   'ids'
   *   | 'title'
   *   | 'type'
   *   | 'user'
   *   | 'userid'
   *   | 'timestamp'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'details'
   *   | 'tags'
   * >} [leprop]
   *   Which properties to get:
   * @property {string} [letype]
   *   Filter log entries to only this type.
   * @property {string} [leaction]
   *   Filter log actions to only this action. Overrides letype.
   * @property {Date|string} [lestart]
   *   The timestamp to start enumerating from.
   * @property {Date|string} [leend]
   *   The timestamp to end enumerating.
   * @property {'newer'|'older'} [ledir]
   *   In which direction to enumerate:
   *   @default 'older'
   * @property {number|number[]} [leids]
   *   Filter entries to those matching the given log ID(s).
   * @property {string} [leuser]
   *   Filter entries to those made by the given user.
   * @property {string} [letitle]
   *   Filter entries to those related to a page.
   * @property {number} [lenamespace]
   *   Filter entries to those in the given namespace.
   * @property {string} [leprefix]
   *   Disabled due to miser mode.
   * @property {string} [letag]
   *   Only list event entries tagged with this tag.
   * @property {number|'max'} [lelimit]
   *   How many total event entries to return.
   * @property {string} [lecontinue]
   *   When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} LogEventsItem
   * @property {string} action
   * @property {string} comment
   * @property {number} logid
   * @property {number} logpage
   * @property {number} ns
   * @property {number} pageid
   * @property {Record<string, unknown>} params
   * @property {string} parsedcomment
   * @property {number} revid
   * @property {Array<string>} tags
   * @property {string} timestamp
   * @property {string} title
   * @property {string} type
   * @property {string} user
   * @property {number} userid
   */
  /**
   * @overload
   * @param {LogEventsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<LogEventsItem>>}
   */
  /**
   * @overload
   * @param {LogEventsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<LogEventsItem, void, unknown>}
   */
  /**
    * @description Get events from logs.
    * @param {LogEventsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<LogEventsItem, void, unknown> | Promise<LogEventsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Logevents
    */
  logevents(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'logevents' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
    * Log in and get authentication tokens.
    *
    * This action should only be used in combination with Special:BotPasswords.
    *
    * This will modify your "Wiki" instance, and all next requests will be authenticated.
    * @param {string} username
    * @param {string} password
    * @see https://www.mediawiki.org/wiki/API:Login
    */
  async login(username, password) {
    const tokens = await this.tokens('login');
    const params = {
      action: 'login',
      format: 'json',
      formatversion: '2',
      lgname: username,
      lgpassword: password,
      lgtoken: tokens.logintoken,
    };

    /** @type {{ login: { lguserid: number; lgusername: string; } }} */
    const result = await this.client.post(params, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    return result.login;
  }

  /**
    * Log out and clear session data.
    */
  async logout() {
    const token = await this.csrfToken();
    const params = {
      action: 'logout',
      token: token,
    };

    await this.client.post(params, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
  }

  /**
   * @typedef {Object} PagePropNamesRequest
   * @property {string} [ppncontinue]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [ppnlimit]
   *   The maximum number of names to return.
   */
  /**
   * @typedef {Object} PagePropNamesItem
   * @property {string} propname
   */
  /**
   * @overload
   * @param {PagePropNamesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<PagePropNamesItem>>}
   */
  /**
   * @overload
   * @param {PagePropNamesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<PagePropNamesItem, void, unknown>}
   */
  /**
    * @description List all page property names in use on the wiki.
    * @param {PagePropNamesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<PagePropNamesItem, void, unknown> | Promise<PagePropNamesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Pagepropnames
    */
  pagepropnames(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'pagepropnames' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} PagePropsRequest
   * @property {string} [ppcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} [ppprop]
   *   Only list these page properties (action=query&list=pagepropnames returns page property names in use). Useful for checking whether pages use a certain page property.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} PagePropsItem
   * @property {number} ns
   * @property {number} pageid
   * @property {Record<string, string>} pageprops
   * @property {string} title
   */
  /**
   * @overload
   * @param {PagePropsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<PagePropsItem>>}
   */
  /**
   * @overload
   * @param {PagePropsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<PagePropsItem, void, unknown>}
   */
  /**
    * @description Get various page properties defined in the page content.
    * @param {PagePropsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<PagePropsItem, void, unknown> | Promise<PagePropsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Pageprops
    */
  pageprops(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'pageprops' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} PagesWithPropRequest
   * @property {string} [pwpcontinue]
   *   When more results are available, use this to continue.
   * @property {'ascending'|'descending'} [pwpdir]
   *   In which direction to sort.
   *   @default 'ascending'
   * @property {number|'max'} [pwplimit]
   *   The maximum number of pages to return.
   * @property {Prop<'ids'|'title'|'value'>} [pwpprop]
   *   What pieces of information to include.
   * @property {string} [pwppropname]
   *   Page prop for which to enumerate pages.
   */
  /**
   * @typedef {Object} PagesWithPropItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   * @property {string} value
   */
  /**
   * @overload
   * @param {PagesWithPropRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<PagesWithPropItem>>}
   */
  /**
   * @overload
   * @param {PagesWithPropRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<PagesWithPropItem, void, unknown>}
   */
  /**
    * @description List all pages using a given page property.
    * @param {PagesWithPropRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<PagesWithPropItem, void, unknown> | Promise<PagesWithPropItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Pageswithprop
    */
  pageswithprop(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'pageswithprop' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} PrefixSearchRequest
   * @property {string} pssearch
   *   Search string.
   * @property {number|number[]|'*'} [psnamespace]
   *   Namespaces to search. Ignored if pssearch begins with a valid namespace prefix.
   * @property {number|'max'} [pslimit]
   *   Maximum number of results to return.
   * @property {string} [psoffset]
   *   When more results are available, use this to continue.
   * @property {'strict'|'normal'|'normal-subphrases'|'fuzzy'|'fast-fuzzy'|'fuzzy-subphrases'|'classic'|'engine_autoselect'} [psprofile]
   *   Search profile to use.
   */
  /**
   * @typedef {Object} PrefixSearchItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {PrefixSearchRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<PrefixSearchItem>>}
   */
  /**
   * @overload
   * @param {PrefixSearchRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<PrefixSearchItem, void, unknown>}
   */
  /**
    * @description Perform a prefix search for page titles.
    * @param {PrefixSearchRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<PrefixSearchItem, void, unknown> | Promise<PrefixSearchItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Prefixsearch
    */
  prefixsearch(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'prefixsearch' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} ProtectedTitlesRequest
   * @property {number|number[]|'*'} [ptnamespace]
   *   Only list titles in these namespaces.
   * @property {Prop<'autoconfirmed'|'sysop'>} [ptlevel]
   *   Only list titles with these protection levels.
   * @property {number|'max'} [ptlimit]
   *   How many total pages to return.
   * @property {'older'|'newer'} [ptdir]
   *   In which direction to enumerate:
   *   @default 'older'
   * @property {Date|string} [ptstart]
   *   Start listing at this protection timestamp.
   * @property {Date|string} [ptend]
   *   Stop listing at this protection timestamp.
   * @property {Prop<
   *   'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'expiry'
   *   | 'level'
   * >} [ptprop]
   *   Which properties to get:
   * @property {string} [ptcontinue]
   *   When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} ProtectedTitlesItem
   * @property {string} comment
   * @property {string} expiry
   * @property {string} level
   * @property {number} ns
   * @property {string} parsedcomment
   * @property {string} timestamp
   * @property {string} title
   * @property {string} user
   * @property {number} userid
   */
  /**
   * @overload
   * @param {ProtectedTitlesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<ProtectedTitlesItem>>}
   */
  /**
   * @overload
   * @param {ProtectedTitlesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<ProtectedTitlesItem, void, unknown>}
   */
  /**
    * @description List all titles protected from creation.
    * @param {ProtectedTitlesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<ProtectedTitlesItem, void, unknown> | Promise<ProtectedTitlesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Protectedtitles
    */
  protectedtitles(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'protectedtitles' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @template [T=unknown]
   * @param {Record<string, unknown>} params
   * @param {Record<string, unknown>} [options]
   * @returns {Promise<T>}
   * @since 1.0.0
   */
  async query(params, options = {}) {
    options = Object.assign(options, {
      action: 'query',
      format: 'json',
      formatversion: 2,
    });

    params = Object.assign(options, params);
    return await this.client.get(params);
  }

  /**
   * @typedef {Object} QueryPageRequest
   * @property {'Ancientpages'
      | 'BrokenRedirects'
      | 'Deadendpages'
      | 'DisambiguationPageLinks'
      | 'DisambiguationPages'
      | 'DoubleRedirects'
      | 'Fewestrevisions'
      | 'GadgetUsage'
      | 'GloballyWantedFiles'
      | 'ListDuplicatedFiles'
      | 'Listredirects'
      | 'Lonelypages'
      | 'Longpages'
      | 'MediaStatistics'
      | 'MostGloballyLinkedFiles'
      | 'Mostcategories'
      | 'Mostimages'
      | 'Mostinterwikis'
      | 'Mostlinked'
      | 'Mostlinkedcategories'
      | 'Mostlinkedtemplates'
      | 'Mostrevisions'
      | 'OrphanedTimedText'
      | 'Shortpages'
      | 'Uncategorizedcategories'
      | 'Uncategorizedimages'
      | 'Uncategorizedpages'
      | 'Uncategorizedtemplates'
      | 'UnconnectedPages'
      | 'Unusedcategories'
      | 'Unusedimages'
      | 'Unusedtemplates'
      | 'Unwatchedpages'
      | 'Wantedcategories'
      | 'Wantedfiles'
      | 'Wantedpages'
      | 'Wantedtemplates'
      | 'Withoutinterwiki'} qppage
   *   The name of the special page. Note, this is case-sensitive.
   * @property {number} [qpoffset]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [qplimit]
   *   Number of results to return.
   */
  /**
   * @typedef {Object} QueryPageItem
   * @property {boolean} cached
   * @property {string} cachedtimestamp
   * @property {number} maxresults
   * @property {string} name
   * @property {Array<Object>} results
   * @property {number} results[].ns
   * @property {string} results[].title
   * @property {string} results[].value
   */
  /**
   * @overload
   * @param {QueryPageRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<QueryPageItem>>}
   */
  /**
   * @overload
   * @param {QueryPageRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<QueryPageItem, void, unknown>}
   */
  /**
    * @description Get a list provided by a QueryPage-based special page.
    * @param {QueryPageRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<QueryPageItem, void, unknown> | Promise<QueryPageItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Querypage
    */
  querypage(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'querypage' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} RandomRequest
   * @property {number|number[]|'*'} [rnnamespace]
   *   Return pages in these namespaces only.
   * @property {'all'|'nonredirects'|'redirects'} [rnfilterredir]
   *   How to filter for redirects.
   *   @default 'nonredirects'
   * @property {number} [rnminsize]
   *   Limit to pages with at least this many bytes.
   * @property {number} [rnmaxsize]
   *   Limit to pages with at most this many bytes.
   * @property {'GadgetDefinition'
   *   | 'Graph.JsonConfig'
   *   | 'Json.JsonConfig'
   *   | 'JsonSchema'
   *   | 'MassMessageListContent'
   *   | 'NewsletterContent'
   *   | 'Scribunto'
   *   | 'SecurePoll'
   *   | 'css'
   *   | 'flow-board'
   *   | 'javascript'
   *   | 'json'
   *   | 'sanitizedd-css'
   *   | 'text'
   *   | 'translate-messagebundle'
   *   | 'unknown'
   *   | 'vue'
   *   | 'wikitext'} [rncontentmodel]
   *   Filter pages that have the specified content model.
   * @property {number|'max'} [rnlimit]
   *   Limit how many random pages will be returned.
   * @property {string} [rncontinue]
   *   When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} RandomItem
   * @property {number} id
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {RandomRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<RandomItem>>}
   */
  /**
   * @overload
   * @param {RandomRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<RandomItem, void, unknown>}
   */
  /**
    * @description Get a set of random pages.
    * @param {RandomRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<RandomItem, void, unknown> | Promise<RandomItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Random
    */
  random(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'random' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} RecentChangesRequest
   * @property {Date|string} [rcstart]
   *   The timestamp to start enumerating from.
   * @property {Date|string} [rcend]
   *   The timestamp to end enumerating.
   * @property {'older'|'newer'} [rcdir]
   *   In which direction to enumerate:
   *   @default 'older'
   * @property {number|number[]|'*'} [rcnamespace]
   *   Filter changes to only these namespaces.
   * @property {string} [rcuser]
   *   Only list changes by this user.
   * @property {string} [rcexcludeuser]
   *   Don't list changes by this user.
   * @property {string} [rctag]
   *   Only list changes tagged with this tag.
   * @property {Prop<
   *   'user'
   *   | 'userid'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'flags'
   *   | 'timestamp'
   *   | 'title'
   *   | 'ids'
   *   | 'sizes'
   *   | 'redirect'
   *   | 'patrolled'
   *   | 'loginfo'
   *   | 'tags'
   *   | 'sha1'
   * >} [rcprop]
   *   Include additional pieces of information:
   * @property {Prop<
   *   '!anon'
   *   | '!autopatrolled'
   *   | '!bot'
   *   | '!minor'
   *   | '!patrolled'
   *   | '!redirect'
   *   | 'anon'
   *   | 'autopatrolled'
   *   | 'bot'
   *   | 'minor'
   *   | 'patrolled'
   *   | 'redirect'
   * >} [rcshow]
   *   Show only items that meet these criteria.
   * @property {number|'max'} [rclimit]
   *   How many total changes to return.
   * @property {'categorize'|'edit'|'external'|'log'|'new'} [rctype]
   *   Which types of changes to show.
   * @property {boolean} [rctoponly]
   *   Only list changes which are the latest revision.
   * @property {string} [rctitle]
   *   Filter entries to those related to a page.
   * @property {string} [rccontinue]
   *   When more results are available, use this to continue.
   * @property {boolean} [rcgeneraterevisions]
   *   When being used as a generator, generate revision IDs rather than titles.
   * @property {string} [rcslot]
   *   Only list changes that touch the named slot.
   */
  /**
   * @typedef {Object} RecentChangesItem
   * @property {boolean} autopatrolled
   * @property {boolean} bot
   * @property {string} comment
   * @property {boolean} minor
   * @property {boolean} new
   * @property {number} newlen
   * @property {number} ns
   * @property {number} old_revid
   * @property {number} oldlen
   * @property {number} pageid
   * @property {string} parsedcomment
   * @property {boolean} patrolled
   * @property {number} rcid
   * @property {boolean} redirect
   * @property {number} revid
   * @property {string} sha1
   * @property {Array<string>} tags
   * @property {string} timestamp
   * @property {string} title
   * @property {string} type
   * @property {boolean} unpatrolled
   * @property {string} user
   * @property {number} userid
   */
  /**
   * @overload
   * @param {RecentChangesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<RecentChangesItem>>}
   */
  /**
   * @overload
   * @param {RecentChangesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<RecentChangesItem, void, unknown>}
   */
  /**
    * @description Enumerate recent changes.
    * @param {RecentChangesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<RecentChangesItem, void, unknown> | Promise<RecentChangesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Recentchanges
    */
  recentchanges(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'recentchanges' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} RedirectsRequest
   * @property {Prop<'pageid'|'title'|'fragment'>} [rdprop]
   *   Which properties to get:
   * @property {number|number[]|'*'} [rdnamespace]
   *   Only include pages in these namespaces.
   * @property {Prop<'!fragment'|'fragment'>} [rdshow]
   *   Show only items that meet these criteria:
   * @property {number|'max'} [rdlimit]
   *   How many redirects to return.
   * @property {string} [rdcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} RedirectsItem
   * @property {Array<Object>} redirects
   * @property {string} redirects[].fragment
   * @property {number} redirects[].ns
   * @property {number} redirects[].pageid
   * @property {string} redirects[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {RedirectsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<RedirectsItem>>}
   */
  /**
   * @overload
   * @param {RedirectsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<RedirectsItem, void, unknown>}
   */
  /**
    * @description Returns all redirects to the given pages.
    * @param {RedirectsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<RedirectsItem, void, unknown> | Promise<RedirectsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Redirects
    */
  redirects(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'redirects' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} RevisionsRequest
   * @property {Prop<
   *   'ids'
   *   | 'flags'
   *   | 'timestamp'
   *   | 'user'
   *   | 'userid'
   *   | 'size'
   *   | 'slotsize'
   *   | 'sha1'
   *   | 'slotsha1'
   *   | 'contentmodel'
   *   | 'comment'
   *   | 'parsedcomment'
   *   | 'content'
   *   | 'tags'
   *   | 'roles'
   * >} [rvprop]
   *   Which properties to get for each revision:
   * @property {'main'} [rvslots]
   *   Which revision slots to return data for, when slot-related properties are included in rvprops.
   *   If omitted, data from the main slot will be returned in a backwards-compatible format.
   * @property {number|'max'} [rvlimit]
   *   Limit how many revisions will be returned.
   *   If rvprop=content, rvprop=parsetree, rvdiffto or rvdifftotext is used, the limit is 50.
   *   If rvparse is used, the limit is 1.
   * @property {string} [rvsection]
   *   Only retrieve the content of the section with this identifier.
   * @property {number} [rvstartid]
   *   Start enumeration from the timestamp of the revision with this ID.
   * @property {number} [rvendid]
   *   Stop enumeration at the timestamp of the revision with this ID.
   * @property {Date|string} [rvstart]
   *   From which revision timestamp to start enumeration.
   * @property {Date|string} [rvend]
   *   Enumerate up to this timestamp.
   * @property {'newer'|'older'} [rvdir]
   *   In which direction to enumerate:
   *   @default 'older'
   * @property {string} [rvuser]
   *   Only include revisions made by user.
   * @property {string} [rvexcludeuser]
   *   Exclude revisions made by user.
   * @property {string} [rvtag]
   *   Only list revisions tagged with this tag.
   * @property {string} [rvcontinue]
   *   When more results are available, use this to continue.
   * @property {string|string[]} titles
   */
  /**
   * @typedef {Object} RevisionsItem
   * @property {Array<Object>} revisions
   * @property {boolean} revisions[].minor
   * @property {number} revisions[].parentid
   * @property {number} revisions[].revid
   * @property {Array<string>} revisions[].roles
   * @property {string} revisions[].sha1
   * @property {number} revisions[].size
   * @property {Object} revisions[].slots
   * @property {string} revisions[].slots.comment
   * @property {Object} revisions[].slots.main
   * @property {string} revisions[].slots.main.content
   * @property {string} revisions[].slots.main.contentformat
   * @property {string} revisions[].slots.main.contentmodel
   * @property {string} revisions[].slots.main.sha1
   * @property {number} revisions[].slots.main.size
   * @property {string} revisions[].slots.parsedcomment
   * @property {Array<string>} revisions[].slots.tags
   * @property {string} revisions[].timestamp
   * @property {string} revisions[].user
   * @property {number} revisions[].userid
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {RevisionsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<RevisionsItem>>}
   */
  /**
   * @overload
   * @param {RevisionsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<RevisionsItem, void, unknown>}
   */
  /**
    * @description Get revision information.
    * @param {RevisionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<RevisionsItem, void, unknown> | Promise<RevisionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Revisions
    */
  revisions(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'revisions' }, params);

    // @ts-expect-error inference RevisionsItem't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} SearchRequest
   * @property {string} srsearch
   *   Search for page titles or content matching this value.
   *   You can use the search string to invoke special search features, depending on what the wiki's search backend implements.
   * @property {number|number[]|'*'} [srnamespace]
   *   Search only within these namespaces.
   * @property {number|'max'} [srlimit]
   *   How many total pages to return.
   * @property {number} [sroffset]
   *   When more results are available, use this to continue.
   *   More detailed information on how to continue queries can be found on mediawiki.org.
   * @property {'classic'
   *   | 'classic_noboostlinks'
   *   | 'empty'
   *   | 'wsum_inclinks'
   *   | 'wsum_inclinks_pv'
   *   | 'popular_inclinks_pv'
   *   | 'popular_inclinks'
   *   | 'engine_autoselect'} [srqiprofile]
   *   Query independent profile to use (affects ranking algorithm).
   * @property {'nearmatch'|'text'|'title'} [srwhat]
   *   Which type of search to perform.
   * @property {Prop<'rewrittenquery'|'suggestion'|'totalhits'>} [srinfo]
   *   Which metadata to return.
   * @property {Prop<
   *   'size'
   *   | 'wordcount'
   *   | 'timestamp'
   *   | 'snippet'
   *   | 'titlesnippet'
   *   | 'redirecttitle'
   *   | 'redirectsnippet'
   *   | 'sectiontitle'
   *   | 'sectionsnippet'
   *   | 'isfilematch'
   *   | 'categorysnippet'
   *   | 'extensiondata'
   * >} [srprop]
   *   Which properties to return:
   * @property {boolean} [srinterwiki]
   *   Include interwiki results in the search, if available.
   * @property {boolean} [srenablerewrites]
   *   Enable internal query rewriting.
   * @property {'create_timestamp_asc'
   *   | 'create_timestamp_desc'
   *   | 'incoming_links_asc'
   *   | 'incoming_links_desc'
   *   | 'just_match'
   *   | 'last_edit_asc'
   *   | 'last_edit_desc'
   *   | 'none'
   *   | 'random'
   *   | 'relevance'
   *   | 'user_random'} [srsort]
   *   Set the sort order of returned results.
   *   @default 'relevance'
   */
  /**
   * @typedef {Object} SearchItem
   * @property {string} categorysnippet
   * @property {boolean} isfilematch
   * @property {number} ns
   * @property {number} pageid
   * @property {number} size
   * @property {string} snippet
   * @property {string} timestamp
   * @property {string} title
   * @property {string} titlesnippet
   * @property {number} wordcount
   */
  /**
   * @overload
   * @param {SearchRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<SearchItem>>}
   */
  /**
   * @overload
   * @param {SearchRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<SearchItem, void, unknown>}
   */
  /**
    * @description Perform a full text search.
    * @param {SearchRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<SearchItem, void, unknown> | Promise<SearchItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Search
    */
  search(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'search' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} SiteInfoRequest
   * @property {'local' | '!local'} sifilteriw
   *  Return only local or only nonlocal entries of the interwiki map.
   * @property {string} siinlanguagecode
   *  Language code for localised language names (best effort) and skin names.
   * @property {boolean} sinumberingroup
   *  Lists the number of users in user groups.
   * @property {Prop<
   *  'general'
   *  | 'namespaces'
   *  | 'namespacealiases'
   *  | 'specialpagealiases'
   *  | 'magicwords'
   *  | 'interwikimap'
   *  | 'dbrepllag'
   *  | 'statistics'
   *  | 'usergroups'
   *  | 'autocreatetempuser'
   *  | 'clientlibraries'
   *  | 'libraries'
   *  | 'extensions'
   *  | 'fileextensions'
   *  | 'rightsinfo'
   *  | 'restrictions'
   *  | 'languages'
   *  | 'languagevariants'
   *  | 'skins'
   *  | 'extensiontags'
   *  | 'functionhooks'
   *  | 'showhooks'
   *  | 'variables'
   *  | 'protocols'
   *  | 'defaultoptions'
   *  | 'uploaddialog'
   *  | 'autopromote'
   *  | 'autopromoteonce'
   *  | 'copyuploaddomains'
   * >} siprop
   *  Which information to get.
   * @property {boolean} sishowalldb
   *  List all database servers, not just the one lagging the most.
   */
  /**
   * @typedef {Object} SiteInfoResponse
   * @property {{ enabled: boolean }} autocreatetempuser
   * @property {{ name: string, version: string }[]} clientlibraries
   * @property {{ host: string, lag: number }[]} dbrepllag
   * @property {Record<string, string>} defaultoptions
   * @property {{
   *  author: string,
   *  descriptionmsg: string,
   *  license: string,
   *  'license-name': string,
   *  name: string,
   *  url: string,
   *  type: string,
   *  'vcs-date': string,
   *  'vcs-url': string,
   *  'vcs-system': string
   * }[]} extensions
   * @property {string[]} extensiontags
   * @property {{ ext: string }[]} fileextensions
   * @property {string[]} functionhooks
   * @property {{
   *  articlepath: string,
   *  allcentralidlookupproviders: string[],
   *  allunicodefixes: boolean,
   *  base: string,
   *  case: string,
   *  categorycollation: string,
   *  centralidlookupprovider: string,
   *  citeresponsivereferences: boolean,
   *  dbtype: string,
   *  dbversion: string,
   *  extensiondistributor: {
   *    list: string,
   *    snapshots: string[]
   *  },
   *  externallinktarget: boolean,
   *  fallback: unknown[],
   *  fallback8bitEncoding: string,
   *  favicon: string,
   *  fixarabicunicode: boolean,
   *  fixmalayalamunicode: boolean,
   *  galleryoptions: {
   *    captionLength: boolean,
   *    imageHeight: number,
   *    imagesPerRow: number,
   *    imageWidth: number,
   *    mode: string,
   *    showBytes: boolean,
   *    showDimensions: boolean
   *  },
   *  generator: string,
   *  'git-hash': string,
   *  'git-branch': string,
   *  imagelimits: { height: number, width: number }[],
   *  imagewhitelistenabled: boolean,
   *  interwikimagic: boolean,
   *  invalidusernamechars: string,
   *  lang: string,
   *  langconversion: boolean,
   *  legaltitlechars: string,
   *  linkconversion: boolean,
   *  linkprefix: string,
   *  linkprefixcharset: string,
   *  linktrail: string,
   *  linter: {
   *    high: string[],
   *    medium: string[],
   *    low: string[]
   *  },
   *  logo: string,
   *  magiclinks: Record<string, boolean>,
   *  mainpage: string,
   *  mainpageisdomainroot: boolean,
   *  maxarticlesize: number,
   *  maxuploadsize: number,
   *  'max-page-id': number,
   *  minuploadchunksize: number,
   *  misermode: boolean,
   *  mobileserver: string,
   *  nofollowexceptions: unknown[],
   *  nofollowlinks: boolean,
   *  nofollowdomainexceptions: string[],
   *  phpsapi: string,
   *  phpversion: string,
   *  readonly: boolean,
   *  rtl: boolean,
   *  script: string,
   *  scriptpath: string,
   *  server: string,
   *  servername: string,
   *  sitename: string,
   *  thumblimits: number[],
   *  time: string,
   *  timeoffset: number,
   *  timezone: string,
   *  titleconversion: boolean,
   *  uploadsenabled: boolean,
   *  variantarticlepath: boolean,
   *  wikiid: string,
   *  writeapi: boolean
   * }} general
   * @property {{
   *  local?: boolean,
   *  prefix: string,
   *  protorel: boolean,
   *  url: string
   * }[]} interwikimap
   * @property {{
   *  bcp47: string,
   *  code: string,
   *  name: string
   * }[]} languages
   * @property {{ name: string, version: string }[]} libraries
   * @property {{
   *  aliases: string[],
   *  'case-sensitive': boolean,
   *  name: string
   * }[]} magicwords
   * @property {{
   *  alias: string,
   *  id: number
   * }[]} namespacealiases
   * @property {{
   *  case: string,
   *  canonical?: boolean,
   *  content: boolean,
   *  id: number,
   *  name: string,
   *  nonincludable: boolean,
   *  subpages: boolean
   * }[]} namespaces
   * @property {string[]} protocols
   * @property {{
   *  cascadinglevels: string[],
   *  levels: string[],
   *  semiprotectedlevels: string[],
   *  types: string[]
   * }} restrictions
   * @property {{
   *  text: string,
   *  url: string
   * }} rightsinfo
   * @property {{
   *  name: string,
   *  subscribers: string[]
   * }[]} showhooks
   * @property {{
   *  code: string,
   *  default?: boolean,
   *  name: string,
   *  unusable?: boolean
   * }[]} skins
   * @property {{
   *  aliases: string[],
   *  realname: string
   * }[]} specialpagealiases
   * @property {{
   *  activeusers: number,
   *  admins: number,
   *  articles: number,
   *  edits: number,
   *  images: number,
   *  jobs: number,
   *  pages: number,
   *  users: number
   * }} statistics
   * @property {{
   *  name: string,
   *  rights: string[]
   * }[]} usergroups
   * @property {string[]} variables
   */
  /**
    * @description Return general information about the site.
    * @param {SiteInfoRequest} params
    * @returns {Promise<SiteInfoResponse>}
    * @see https://www.mediawiki.org/wiki/API:Siteinfo
    */
  async siteinfo(params) {
    /** @type {{ query: SiteInfoResponse }} */
    const result = await this.query(params, { meta: 'siteinfo' });

    return result.query;
  }

  /**
   * @typedef {Object} TagsRequest
   * @property {string} [tgcontinue]
   *   When more results are available, use this to continue.
   * @property {number|'max'} [tglimit]
   *   The maximum number of tags to list.
   * @property {Prop<
   *   'displayname'
   *   | 'description'
   *   | 'hitcount'
   *   | 'defined'
   *   | 'source'
   *   | 'active'
   * >} [tgprop]
   *   Which properties to get:
   */
  /**
   * @typedef {Object} TagsItem
   * @property {boolean} active
   * @property {boolean} defined
   * @property {string} description
   * @property {string} displayname
   * @property {number} hitcount
   * @property {string} name
   * @property {string[]} source
   */
  /**
   * @overload
   * @param {TagsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<TagsItem>>}
   */
  /**
   * @overload
   * @param {TagsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<TagsItem, void, unknown>}
   */
  /**
    * @description List change tags.
    * @param {TagsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<TagsItem, void, unknown> | Promise<TagsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Tags
    */
  tags(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'tags' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} TemplatesRequest
   * @property {number | number[] | '*'} [tlnamespace]
   *  Show templates in these namespaces only.
   * @property {number | 'max'} [tllimit]
   *  How many templates to return.
   * @property {string} [tlcontinue]
   *  When more results are available, use this to continue.
   * @property {string | string[]} [tltemplates]
   *  Only list these templates. Useful for checking whether a certain page uses a certain template.
   * @property {'ascending' | 'descending'} [tldir]
   *  The direction in which to list.
   *  @default 'ascending'
   * @property {string | string[]} titles
   */
  /**
   * @typedef {Object} TemplatesItem
   * @property {Array<Object>} templates
   * @property {number} templates[].ns
   * @property {string} templates[].title
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   */
  /**
   * @overload
   * @param {TemplatesRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<TemplatesItem>>}
   */
  /**
   * @overload
   * @param {TemplatesRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<TemplatesItem, void, unknown>}
   */
  /**
    * @description Returns all pages transcluded on the given pages.
    * @param {TemplatesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<TemplatesItem, void, unknown> | Promise<TemplatesItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Templates
    */
  templates(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'templates' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
    * @description Gets tokens for data-modifying actions.
    * @param {string} tokenType
    * @param {boolean} [force]
    * @see https://www.mediawiki.org/wiki/API:Tokens
    */
  async tokens(tokenType, force = false) {
    if (!force && typeof tokenType === 'string' && this.cachedTokens[tokenType]) {
      return {
        [`${tokenType}token`]: this.cachedTokens[tokenType],
      };
    }

    /** @type {string} */
    let type;

    if (Array.isArray(tokenType)) type = tokenType.join('|');
    else type = tokenType;

    /** @type {{ query: { tokens: Record<string, string> } }} */
    const tokens = await this.client.get({
      action: 'query',
      format: 'json',
      formatversion: '2',
      meta: 'tokens',
      type,
    });

    return tokens.query.tokens;
  }

  /**
   * @typedef {Object} TranscludedInRequest
   * @property {Prop<'pageid' | 'title' | 'redirect'>} [tiprop]
   *  Which properties to get:
   * @property {number | number[] | '*'} [tinamespace]
   *  Only include pages in these namespaces.
   * @property {Prop<'!redirect' | 'redirect'>} [tishow]
   *  Show only items that meet these criteria:
   * @property {number | 'max'} [tilimit]
   *  How many to return.
   * @property {string} [ticontinue]
   *  When more results are available, use this to continue.
   * @property {string | string[]} titles
   */
  /**
   * @typedef {Object} TranscludedInItem
   * @property {number} ns
   * @property {number} pageid
   * @property {string} title
   * @property {Array<Object>} transcludedin
   * @property {number} transcludedin[].ns
   * @property {number} transcludedin[].pageid
   * @property {boolean} transcludedin[].redirect
   * @property {string} transcludedin[].title
   */
  /**
   * @overload
   * @param {TranscludedInRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<TranscludedInItem>>}
   */
  /**
   * @overload
   * @param {TranscludedInRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<TranscludedInItem, void, unknown>}
   */
  /**
    * @description Find all pages that transclude the given pages.
    * @param {TranscludedInRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<TranscludedInItem, void, unknown> | Promise<TranscludedInItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Transcludedin
    */
  transcludedin(params, { type = 'generator' } = {}) {
    params = Object.assign({ prop: 'transcludedin' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} UnblockRequest
   * @property {number} [id]
   *  ID of the block to unblock (obtained through list=blocks). Cannot be used together with user.
   * @property {string} [user]
   *  User to unblock. Cannot be used together with id.
   * @property {string} [reason]
   *  Reason for unblock.
   * @property {string | string[]} [tags]
   *  Change tags to apply to the entry in the block log.
   * @property {boolean} [watchuser]
   *  Watch the user's or IP address's user and talk pages.
   * @property {Date | string} [watchlistexpiry]
   *  Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   */
  /**
   * @typedef {Object} UnblockItem
   * @property {number} id
   * @property {string} reason
   * @property {string} user
   * @property {number} userid
   */
  /**
    * @description Unblock a user.
    * @param {UnblockRequest} params
    * @returns {Promise<UnblockItem>}
    */
  async unblock(params) {
    /** @type {{ unblock: UnblockItem }} */
    const request = await this.action(params, { action: 'unblock' });
    return request.unblock;
  }

  /**
   * @typedef {Object} UploadRequest
   * @property {string} [filename]
   *  Target filename.
   * @property {string} [comment]
   *  Upload comment. Also used as the initial page text for new files if text is not specified.
   * @property {string | string[]} [tags]
   *  Change tags to apply to the upload log entry and file page revision.
   * @property {string} [text]
   *  Initial page text for new files.
   * @property {'nochange' | 'preferences' | 'watch'} [watchlist]
   *  Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
   *  @default 'preferences'
   * @property {Date | string} [watchlistexpiry]
   *  Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   * @property {boolean} [ignorewarnings]
   *  Ignore any warnings.
   * @property {import('fs').ReadStream} [file]
   *  File contents.
   * @property {string} [url]
   *  URL to fetch the file from.
   * @property {string} [filekey]
   *  Key that identifies a previous upload that was stashed temporarily.
   * @property {boolean} [stash]
   *  If set, the server will stash the file temporarily instead of adding it to the repository.
   * @property {number} [filesize]
   *  Filesize of entire upload.
   * @property {number} [offset]
   *  Offset of chunk in bytes.
   * @property {import('fs').ReadStream} [chunk]
   *  Chunk contents.
   * @property {boolean} [async]
   *  Make potentially large file operations asynchronous when possible.
   * @property {boolean} [checkstatus]
   *  Only fetch the upload status for the given file key.
   */
  /**
   * @typedef {Object} UploadItem
   * @property {string} filename
   * @property {string} result
   */
  /**
    * @description Upload a file, or get the status of pending uploads.
    * @param {UploadRequest} params
    * @returns {Promise<UploadItem>}
    */
  async upload(params) {
    const defaults = {
      action: 'upload',
      format: 'json',
      formatversion: 2,
      token: await this.csrfToken(),
    };

    params = Object.assign(defaults, params);

    /** @type {{ upload: UploadItem }} */
    const request = await this.client.post(params, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    return request.upload;
  }

  /**
   * @typedef {Object} UserContribsRequest
   * @property {number | 'max'} [uclimit]
   *  The maximum number of contributions to return.
   * @property {Date | string} [ucstart]
   *  The start timestamp to return from, i.e. revisions before this timestamp.
   * @property {Date | string} [ucend]
   *  The end timestamp to return to, i.e. revisions after this timestamp.
   * @property {string} [uccontinue]
   *  When more results are available, use this to continue.
   * @property {string | string[]} [ucuser]
   *  The users to retrieve contributions for. Cannot be used with ucuserids, ucuserprefix, or uciprange.
   * @property {number | number[]} [ucuserids]
   *  The user IDs to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or uciprange.
   * @property {string} [ucuserprefix]
   *  Retrieve contributions for all users whose names begin with this value. Cannot be used with ucuser, ucuserids, or uciprange.
   * @property {string} [uciprange]
   *  The CIDR range to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or ucuserids.
   * @property {'newer' | 'older'} [ucdir]
   *  In which direction to enumerate:
   *  @default 'older'
   * @property {number | number[] | '*'} [ucnamespace]
   *  Only list contributions in these namespaces.
   * @property {Prop<
   *  'ids'
   *  | 'title'
   *  | 'timestamp'
   *  | 'comment'
   *  | 'parsedcomment'
   *  | 'size'
   *  | 'sizediff'
   *  | 'flags'
   *  | 'patrolled'
   *  | 'tags'
   * >} [ucprop]
   *  Include additional pieces of information:
   * @property {Prop<
   *  '!autopatrolled'
   *  | '!minor'
   *  | '!new'
   *  | '!patrolled'
   *  | '!top'
   *  | 'autopatrolled'
   *  | 'minor'
   *  | 'new'
   *  | 'patrolled'
   *  | 'top'
   * >} [ucshow]
   *  Show only items that meet these criteria, e.g. non minor edits only: ucshow=!minor.
   *  If ucshow=patrolled or ucshow=!patrolled is set, revisions older than $wgRCMaxAge (2592000 seconds) won't be shown.
   * @property {string} [uctag]
   *  Only list revisions tagged with this tag.
   */
  /**
   * @typedef {Object} UserContribsItem
   * @property {boolean} autopatrolled
   * @property {string} comment
   * @property {boolean} minor
   * @property {boolean} new
   * @property {number} ns
   * @property {number} pageid
   * @property {number} parentid
   * @property {string} parsedcomment
   * @property {boolean} patrolled
   * @property {number} revid
   * @property {number} size
   * @property {number} sizediff
   * @property {string[]} tags
   * @property {string} timestamp
   * @property {string} title
   * @property {boolean} top
   * @property {string} user
   * @property {number} userid
   */
  /**
   * @overload
   * @param {UserContribsRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<UserContribsItem>>}
   */
  /**
   * @overload
   * @param {UserContribsRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<UserContribsItem, void, unknown>}
   */
  /**
    * @description Get all edits by a user.
    * @param {UserContribsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<UserContribsItem, void, unknown> | Promise<UserContribsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Usercontribs
    */
  usercontribs(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'usercontribs' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} UserInfoRequest
   * @property {Prop<'blockinfo'
   *   | 'hasmsg'
   *   | 'groups'
   *   | 'groupmemberships'
   *   | 'implicitgroups'
   *   | 'rights'
   *   | 'changeablegroups'
   *   | 'options'
   *   | 'editcount'
   *   | 'ratelimits'
   *   | 'theoreticalratelimits'
   *   | 'email'
   *   | 'realname'
   *   | 'acceptlang'
   *   | 'registrationdate'
   *   | 'unreadcount'
   *   | 'centralids'
   *   | 'latestcontrib'
   *   | 'cancreateaccount'
   * >} uiprop
   */
  /**
   * @typedef {Object} UserInfoResponse
   * @property {{ code: string; q: number }[]} acceptlang
   * @property {boolean} cancreateaccount
   * @property {Record<string, number>} centralids
   * @property {number} editcount
   * @property {string} email
   * @property {string} emailauthenticated
   * @property {{ expiry: string; group: string }[]} groupmemberships
   * @property {string[]} groups
   * @property {number} id
   * @property {string[]} implicitgroups
   * @property {string} latestcontrib
   * @property {boolean} messages
   * @property {string} name
   * @property {Record<string, unknown>} options
   * @property {Record<string, Record<string, { hits: number; seconds: number }>>} ratelimits
   * @property {string} registrationate
   * @property {Record<string, Record<string, { hits: number; seconds: number }>>} theoreticalratelimits
   * @property {number} unreadcount
   */
  /**
    * @description Get information about the current user.
    * @param {UserInfoRequest} params
    * @returns {Promise<UserInfoResponse>}
    * @see https://www.mediawiki.org/wiki/API:Userinfo
    */
  async userinfo(params) {
    /** @type {{ query: { userinfo: UserInfoResponse } }} */
    const result = await this.query(params, { meta: 'userinfo' });

    return result.query.userinfo;
  }

  /**
   * @typedef {Object} UserRightsRequest
   * @property {string} [user]
   *  User.
   * @property {string | string[]} [add]
   *  Add the user to these groups, or if they are already a member, update the expiry of their membership in that group.
   * @property {Date | string | (Date | string)[]} [expiry]
   *  Expiry timestamps. May be relative (e.g. 5 months or 2 weeks) or absolute (e.g. 2014-09-18T12:34:56Z).
   *  If only one timestamp is set, it will be used for all groups passed to the add parameter.
   *  Use infinite, indefinite, infinity, or never for a never-expiring user group.
   * @property {string | string[]} [remove]
   *  Remove the user from these groups.
   * @property {string} [reason]
   *  Reason for the change.
   * @property {string | string[]} [tags]
   *  Change tags to apply to the entry in the user rights log.
   * @property {boolean} [watchuser]
   *  Watch the user's user and talk pages.
   * @property {Date | string} [watchlistexpiry]
   *  Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
   */
  /**
   * @typedef {Object} UserRightsItem
   * @property {string[]} added
   * @property {string[]} removed
   * @property {string} user
   * @property {number} userid
   */
  /**
    * @description Change a user's group membership.
    * @param {UserRightsRequest} params
    * @returns {Promise<UserRightsItem>}
    */
  async userrights(params) {
    const token = await this.tokens('userrights');
    /** @type {{ userrights: UserRightsItem }} */
    const request = await this.action(params, { action: 'userrights', token: token.userrightstoken });
    return request.userrights;
  }

  /**
   * @typedef {Object} UsersRequest
   * @property {Prop<
   *  'blockinfo'
   *  | 'groups'
   *  | 'groupmemberships'
   *  | 'implicitgroups'
   *  | 'rights'
   *  | 'editcount'
   *  | 'registration'
   *  | 'emailable'
   *  | 'gender'
   *  | 'centralids'
   *  | 'cancreate'
   * >} [usprop]
   *  Which pieces of information to include:
   * @property {string} [usattachedwiki]
   *  With usprop=centralids, indicate whether the user is attached with the wiki identified by this ID.
   * @property {string | string[]} [ususers]
   *  A list of users to obtain information for.
   * @property {number | number[]} [ususerids]
   *  A list of user IDs to obtain information for.
   */
  /**
   * @typedef {Object} UsersItem
   * @property {Record<string, boolean>} attachedlocal
   * @property {boolean} blockanononly
   * @property {string} blockedby
   * @property {number} blockedbyid
   * @property {string} blockedtimestamp
   * @property {string} blockedtimestampformatted
   * @property {boolean} blockemail
   * @property {string} blockexpiry
   * @property {boolean} blockexpiryformatted
   * @property {string} blockexpiryrelative
   * @property {number} blockid
   * @property {boolean} blocknocreate
   * @property {boolean} blockowntalk
   * @property {boolean} blockpartial
   * @property {string} blockreason
   * @property {boolean} cancreate
   * @property {{
   *   coded: string,
   *   message: string,
   *   params: unknown[],
   *   type: string
   * }[]} cancreateerror
   * @property {Record<string, number>} centralids
   * @property {number} editcount
   * @property {boolean} emailable
   * @property {string} gender
   * @property {string[]} groupmemberships
   * @property {string[]} groups
   * @property {string[]} implicitgroups
   * @property {boolean} invalid
   * @property {boolean} missing
   * @property {string} name
   * @property {string} registration
   * @property {string[]} rights
   * @property {number} userid
   */
  /**
   * @overload
   * @param {UsersRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<UsersItem>>}
   */
  /**
   * @overload
   * @param {UsersRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<UsersItem, void, unknown>}
   */
  /**
    * @description Get information about a list of users.
    * @param {UsersRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<UsersItem, void, unknown> | Promise<UsersItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Users
    */
  users(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'users' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} WatchlistRequest
   * @property {boolean} [wlallrev]
   *  Include multiple revisions of the same page within given timeframe.
   * @property {Date | string} [wlstart]
   *  The timestamp to start enumerating from.
   * @property {Date | string} [wlend]
   *  The timestamp to end enumerating.
   * @property {number | number[] | '*'} [wlnamespace]
   *  Filter changes to only the given namespaces.
   * @property {string} [wluser]
   *  Only list changes by this user.
   * @property {string} [wlexcludeuser]
   *  Don't list changes by this user.
   * @property {'newer' | 'older'} [wldir]
   *  In which direction to enumerate:
   *  @default 'older'
   * @property {number | 'max'} [wllimit]
   *  How many total results to return per request.
   * @property {Prop<
   *  'title'
   *  | 'ids'
   *  | 'flags'
   *  | 'user'
   *  | 'userid'
   *  | 'comment'
   *  | 'parsedcomment'
   *  | 'timestamp'
   *  | 'patrol'
   *  | 'sizes'
   *  | 'notificationtimestamp'
   *  | 'loginfo'
   *  | 'tags'
   *  | 'expiry'
   * >} [wlprop]
   *  Which additional properties to get:
   * @property {Prop<
   *  '!anon'
   *  | '!autopatrolled'
   *  | '!bot'
   *  | '!minor'
   *  | '!patrolled'
   *  | '!unread'
   *  | 'anon'
   *  | 'autopatrolled'
   *  | 'bot'
   *  | 'minor'
   *  | 'patrolledd'
   *  | 'unread'
   * >} [wlshow]
   *  Show only items that meet these criteria. For example, to see only minor edits done by logged-in users, set wlshow=minor|!anon.
   * @property {Prop<
   *  'edit'
   *  | 'new'
   *  | 'log'
   *  | 'external'
   *  | 'categorize'
   * >} [wltype]
   *  Which types of changes to show:
   * @property {string} [wlowner]
   *  Used along with wltoken to access a different user's watchlist.
   * @property {string} [wltoken]
   *  A security token (available in the user's preferences) to allow access to another user's watchlist.
   * @property {string} [wlcontinue]
   *  When more results are available, use this to continue.
   */
  /**
   * @typedef {Object} WatchlistItem
   * @property {boolean} anon
   * @property {boolean} autopatrolled
   * @property {boolean} bot
   * @property {string} comment
   * @property {boolean} expiry
   * @property {boolean} minor
   * @property {boolean} new
   * @property {number} newlen
   * @property {string} notificationtimestamp
   * @property {number} ns
   * @property {number} old_revid
   * @property {number} oldlen
   * @property {number} pageid
   * @property {string} parsedcomment
   * @property {boolean} patrolled
   * @property {number} revid
   * @property {string[]} tags
   * @property {boolean} temp
   * @property {string} timestamp
   * @property {string} title
   * @property {string} type
   * @property {boolean} unpatrolled
   * @property {string} user
   * @property {number} userid
   */
  /**
   * @overload
   * @param {WatchlistRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<WatchlistItem>>}
   */
  /**
   * @overload
   * @param {WatchlistRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<WatchlistItem, void, unknown>}
   */
  /**
    * @description Get recent changes to pages in the current user's watchlist.
    * @param {WatchlistRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<WatchlistItem, void, unknown> | Promise<WatchlistItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Watchlist
    */
  watchlist(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'watchlist' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} WatchlistRawRequest
   * @property {string} [wrcontinue]
   *  When more results are available, use this to continue.
   * @property {number | number[] | '*'} [wrnamespace]
   *  Only list pages in the given namespaces.
   * @property {number | 'max'} [wrlimit]
   *  How many total results to return per request.
   * @property {Prop<'changed'>} [wrprop]
   *  Which additional properties to get:
   * @property {Prop<'!changed' | 'changed'>} [wrshow]
   *  Only list items that meet these criteria.
   * @property {string} [wrowner]
   *  Used along with wrtoken to access a different user's watchlist.
   * @property {string} [wrtoken]
   *  A security token (available in the user's preferences) to allow access to another user's watchlist.
   * @property {'ascending' | 'descending'} [wrdir]
   *  The direction in which to list.
   *  @default 'ascending'
   * @property {string} [wrfromtitle]
   *  Title (with namespace prefix) to begin enumerating from.
   * @property {string} [wrtotitle]
   *  Title (with namespace prefix) to stop enumerating at.
   */
  /**
   * @typedef {Object} WatchlistRawItem
   * @property {string} changed
   * @property {number} ns
   * @property {string} title
   */
  /**
   * @overload
   * @param {WatchlistRawRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<WatchlistRawItem>>}
   */
  /**
   * @overload
   * @param {WatchlistRawRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<WatchlistRawItem, void, unknown>}
   */
  /**
    * @description Get all pages on the current user's watchlist.
    * @param {WatchlistRawRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<WatchlistRawItem, void, unknown> | Promise<WatchlistRawItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Watchlistraw
    */
  watchlistraw(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'watchlistraw' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }
}
