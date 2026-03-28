import { Client } from './client';

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
      const query = await this.query(params);

      for (const item of query.query[params.list]) {
        yield item;
      }

      if (!query.continue) break;
      Object.assign(params, query.continue);
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
   */
  /**
   * @typedef {Object} AllLinksItem
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
    * Returns messages from the site.
    * @see https://www.mediawiki.org/wiki/API:Allmessages
    */
  async allmessages(params) {
    const result = await this.query(params, { meta: 'allmessages' });

    return result.query.allmessages;
  }

  /**
   * @typedef {Object} AllPagesRequest
   */
  /**
   * @typedef {Object} AllPagesItem
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
   */
  /**
   * @typedef {Object} AllRedirectsItem
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
   */
  /**
   * @typedef {Object} AllRevisionsItem
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
   */
  /**
   * @typedef {Object} AllTransclusionsItem
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
   */
  /**
   * @typedef {Object} AllUsersItem
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
   */
  /**
   * @typedef {Object} BacklinksItem
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
    * Block a user.
    */
  async block(params) {
    const request = await this.action(params, { action: 'block' });
    return request.block;
  }

  /**
   * @typedef {Object} BlocksRequest
   */
  /**
   * @typedef {Object} BlocksItem
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
   */
  /**
   * @typedef {Object} CategoriesItem
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
   */
  /**
   * @typedef {Object} CategoryInfoItem
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
   */
  /**
   * @typedef {Object} CategoryMembersItem
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
   * @typedef {Object} AsyncGeneratorRequest
   */
  /**
   * @typedef {Object} AsyncGeneratorItem
   */
  /**
   * @overload
   * @param {AsyncGeneratorRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<AsyncGeneratorItem>>}
   */
  /**
   * @overload
   * @param {AsyncGeneratorRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<AsyncGeneratorItem, void, unknown>}
   */
  /**
    * @description Get the list of logged-in contributors (including temporary users) and the count of
    * @param {AllFileUsagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGeneratorRequest, void, unknown> | Promise<AllFileUsagesItem[]>}
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
   */
  /**
   * @typedef {Object} DeletedRevisionsItem
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
   */
  /**
   * @typedef {Object} DuplicateFilesItem
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
    * Create and edit pages.
    */
  async edit(params) {
    const request = await this.action(params, {
      action: 'edit',
      assert: params.bot ? 'bot' : 'user',
    });
    return request.edit;
  }

  /**
   * @typedef {Object} EmbeddedInRequest
   */
  /**
   * @typedef {Object} EmbeddedInItem
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
   */
  /**
   * @typedef {Object} ExtLinksItem
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
   */
  /**
   * @typedef {Object} ExtUrlUsageItem
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
   */
  /**
   * @typedef {Object} FileArchiveItem
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
    * Return meta information about image repositories configured on the wiki.
    * @see https://www.mediawiki.org/wiki/API:Filerepoinfo
    */
  async filerepoinfo(params) {
    const result = await this.query(params, { meta: 'filerepoinfo' });

    return result.query.repos;
  }

  /**
   * @typedef {Object} FileUsageRequest
   */
  /**
   * @typedef {Object} FileUsageItem
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
    * Get the list of pages to work on by executing the specified query module.
    * @see https://www.mediawiki.org/wiki/API:Query#Generators
    */
  generate(params) {
    return this.query(params);
  }

  /**
   * @typedef {Object} GlobalUsageRequest
   */
  /**
   * @typedef {Object} GlobalUsageItem
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
   */
  /**
   * @typedef {Object} ImageInfoItem
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
   */
  /**
   * @typedef {Object} ImagesItem
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
   */
  /**
   * @typedef {Object} ImageUsageItem
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
   */
  /**
   * @typedef {Object} InfoItem
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
   * @typedef {Object} aRequest
   */
  /**
   * @typedef {Object} aItem
   */
  /**
   * @overload
   * @param {aRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<aItem>>}
   */
  /**
   * @overload
   * @param {aRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<aItem, void, unknown>}
   */
  /**
    * @description Find all pages that link to the given interwiki link.
    * @param {AllFileUsagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllFileUsagesItem, void, unknown> | Promise<AllFileUsagesItem[]>}
    *   Can be used to find all links with aRequest, or all links to a title (with a given prefix).
    *   Using neither parameter is effectively "IwBacklinksItem interwiki links".
    * @see https://IwBacklinksItem.mediawiki.org/wiki/API:Iwbacklinks
    */
  iwbacklinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'iwbacklinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} IwLinksRequest
   */
  /**
   * @typedef {Object} IwLinksItem
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
   * @typedef {Object} aRequest
   */
  /**
   * @typedef {Object} aItem
   */
  /**
   * @overload
   * @param {aRequest} params
   * @param {{ type: 'array' }} options
   * @returns {Promise<Array<aItem>>}
   */
  /**
   * @overload
   * @param {aRequest} params
   * @param {{ type?: 'generator' }} [options]
   * @returns {AsyncGenerator<aItem, void, unknown>}
   */
  /**
    * @description Find all pages thast link to the given language link.
    * @param {AllFileUsagesRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<AllFileUsagesItem, void, unknown> | Promise<AllFileUsagesItem[]>}
    *   Can be used to find all links with aRequest code, or all links to a title (with a given language).
    *   Using neither parameter is effectively "LangBacklinksItem language links".
    * @see https://LangBacklinksItem.mediawiki.org/wiki/API:Langbacklinks
    */
  langbacklinks(params, { type = 'generator' } = {}) {
    params = Object.assign({ list: 'langbacklinks' }, params);

    // @ts-expect-error inference can't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} LangLinksRequest
   */
  /**
   * @typedef {Object} LangLinksItem
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
   */
  /**
   * @typedef {Object} LinksItem
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
   */
  /**
   * @typedef {Object} LinksHereItem
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
   */
  /**
   * @typedef {Object} LogEventsItem
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
   */
  /**
   * @typedef {Object} PagePropNamesItem
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
   */
  /**
   * @typedef {Object} PagePropsItem
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
   */
  /**
   * @typedef {Object} PagesWithPropItem
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
   */
  /**
   * @typedef {Object} PrefixSearchItem
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
   */
  /**
   * @typedef {Object} ProtectedTitlesItem
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
   */
  /**
   * @typedef {Object} QueryPageItem
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
   */
  /**
   * @typedef {Object} RandomItem
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
   */
  /**
   * @typedef {Object} RecentChangesItem
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
   */
  /**
   * @typedef {Object} RedirectsItem
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
   * @typedef {Object} RevisionsRequest
   */
  /**
   * @typedef {Object} RevisionsItem
   */
  /**
    * @description Get revision information.
    * @param {RevisionsRequest} params
    * @param {Partial<CreateIteratorOptions>} [options]
    * @returns {AsyncGenerator<RevisionsItem, void, unknown> | Promise<RevisionsItem[]>}
    * @see https://www.mediawiki.org/wiki/API:Revisions
    */
  revisions(params, { type = 'generator' } = {}) {
    params = RevisionsRequest.assign({ prop: 'revisions' }, params);

    // @ts-expect-error inference RevisionsItem't keep reference of `type`
    return this.createIterator(params, { type });
  }

  /**
   * @typedef {Object} SearchRequest
   */
  /**
   * @typedef {Object} SearchItem
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
    * Return general information about the site.
    * @see https://www.mediawiki.org/wiki/API:Siteinfo
    */
  async siteinfo(params) {
    const result = await this.query(params, { meta: 'siteinfo' });

    return result.query;
  }

  /**
   * @typedef {Object} TagsRequest
   */
  /**
   * @typedef {Object} TagsItem
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
   */
  /**
   * @typedef {Object} TemplatesItem
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
    * Gets tokens for data-modifying actions.
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
   */
  /**
   * @typedef {Object} TranscludedInItem
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
    * Unblock a user.
    */
  async unblock(params) {
    const request = await this.action(params, { action: 'unblock' });
    return request.unblock;
  }

  /**
    * Upload a file, or get the status of pending uploads.
    */
  async upload(params) {
    const defaults = {
      action: 'upload',
      format: 'json',
      formatversion: 2,
      token: await this.csrfToken(),
    };

    params = Object.assign(defaults, params);

    return await this.client.post(params, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  }

  /**
   * @typedef {Object} UserContribsRequest
   */
  /**
   * @typedef {Object} UserContribsItem
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
    * Get information about the current user.
    * @see https://www.mediawiki.org/wiki/API:Userinfo
    */
  async userinfo(params) {
    const result = await this.query(params, { meta: 'userinfo' });

    return result.query.userinfo;
  }

  /**
    * Change a user's group membership.
    */
  async userrights(params) {
    const token = await this.tokens('userrights');
    const request = await this.action(params, { action: 'userrights', token: token.userrightstoken });
    return request.userrights;
  }

  /**
   * @typedef {Object} UsersRequest
   */
  /**
   * @typedef {Object} UsersItem
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
   */
  /**
   * @typedef {Object} WatchlistItem
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
   */
  /**
   * @typedef {Object} WatchlistRawItem
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
