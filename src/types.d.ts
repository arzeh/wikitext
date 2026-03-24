type AllCategories = {
  batchcomplete: boolean;
  continue?: {
    accontinue: string;
    continue: string;
  };
  query: {
    allcategories: {
      category: string;
      hiden: boolean;
      files: number;
      pages: number;
      size: number;
      subcats: number;
    }[];
  };
};

type AllCategoriesRequest = {
  /**
    * When more results are available, use this to continue.
    */
  accontinue?: string;

  /**
    * Direction to sort in.
    * @default 'ascending'
    */
  acdir?: 'ascending' | 'descending';

  /**
    * The category to start enumerating from.
    */
  acfrom?: string;

  /**
    * How many categories to return.
    */
  aclimit?: number | 'max';

  /**
    * Only return categories with at most this many members.
    */
  acmax?: number;

  /**
    * Only return categories with at least this many members.
    */
  acmin?: number;

  /**
    * Search for all category titles that begin with this value.
    */
  acprefix?: string;

  /**
    * Which properties to get.
    */
  acprop?: Prop<'size' | 'hidden'>;

  /**
    * The category to stop enumerating at.
    */
  acto?: string;
};

type AllDeletedRevisions = {
  batchcomplete: boolean;
  continue?: {
    adrcontinue: string;
    continue: string;
  };
  query: {
    alldeletedrevisions: {
      ns: number;
      pageid: number;
      revisions: {
        minor: boolean;
        parentid: number;
        revid: number;
        roles: string[];
        sha1: string;
        size: number;
        slots: {
          comment: string;
          main: {
            content: string;
            contentformat: string;
            contentmodel: string;
            sha1: string;
            size: number;
          };
          parsedcomment: string;
          tags: string[];
        };
        timestamp: string;
        user: string;
        userid: number;
      }[];
      title: string;
    }[];
  };
};

type AllDeletedRevisionsRequest = {
  /**
      * When more results are available, use this to continue.
      */
  adrcontinue?: string;

  /**
      * In which direction to enumerate.
      * @default 'older'
      */
  adrdir?: 'newer' | 'older';

  /**
      * The timestamp to stop enumerating at.
      */
  adrend?: Date | string;

  /**
      * Don't list revisions by this user.
      */
  adrexcludeuser?: string;

  /**
      * Start listing at this title.
      */
  adrfrom?: string;

  /**
      * When being used as a generator, generate titles rather than revision IDs.
      */
  adrgeneratetitles?: boolean;

  /**
      * Limit how many revisions will be returned. If `adrprop=content`,
      * is used, the limit is 50.
      */
  adrlimit?: number | 'max';

  /**
      * Only list pages in this namespace.
      */
  adrnamespace?: number | number[] | '*';

  /**
      * Search for all page titles that begin with this value.
      */
  adrprefix?: string;

  /**
      * Which properties to get for each revision.
      */
  adrprop?: Prop<
      'ids'
      | 'flags'
      | 'timestamp'
      | 'user'
      | 'userid'
      | 'size'
      | 'slotsize'
      | 'sha1'
      | 'slotsha1'
      | 'contentmodel'
      | 'comment'
      | 'parsedcomment'
      | 'content'
      | 'tags'
      | 'roles'
  >;

  /**
      * Only retrieve the content of the section with this identifier.
      */
  adrsection?: string;

  /**
      * Which revision slots to return data for, when slot-related properties
      * are included in `adrprops`. If omitted, data from the `main` slot will be
      * returned in a backwards-compatible format.
      */
  adrslots?: 'main' | string | string[];

  /**
      * The timestamp to start enumerating from.
      */
  adrstart?: Date | string;

  /**
      * Only list revisions tagged with this tag.
      */
  adrtag?: string;

  /**
      * Stop listing at this title.
      */
  adrto?: string;

  /**
      * Only list revisions by this user.
      */
  adruser?: string;
};

type AllFileUsages = {
  batchcomplete: boolean;
  continue?: {
    afcontinue: string;
    continue: string;
  };
  query: {
    allfileusages: {
      fromid: number;
      ns: number;
      title: string;
    }[];
  };
};

type AllFileUsagesRequest = {
  /**
      * When more results are available, use this to continue.
      */
  afcontinue?: string;

  /**
      * The direction in which to list.
      * @default 'ascending'
      */
  afdir?: 'ascending' | 'descending';

  /**
      * The title of the file to start enumerating from.
      */
  affrom?: string;

  /**
      * How many total items to return.
      */
  aflimit?: number | 'max';

  /**
      * Search for all file titles that begin with this value.
      */
  afprefix?: string;

  /**
      * Which pieces of information to include.
      */
  afprop?: Prop<'ids' | 'title'>;

  /**
      * The title of the file to stop enumerating at.
      */
  afto?: string;

  /**
      * Only show distinct file titles. Cannot be used with `afprop=ids`.
      */
  afunique?: boolean;
};

type AllImages = {
  batchcomplete: boolean;
  continue?: {
    aicontinue: string;
    continue: string;
  };
  query: {
    allimages: {
      bitdepth: number;
      canonicaltitle: string;
      comment: string;
      commonmetaddata: {
        name: string;
        value: string;
      }[];
      descriptionshorturl: string;
      descriptionurl: string;
      extmetadata: Record<string, {
        hidden?: '';
        source: string;
        value: string;
      }>;
      height: number;
      mediatype: string;
      metadata: {
        name: string;
        value: string;
      }[];
      mime: string;
      name: string;
      ns: number;
      parsedcomment: string;
      sha1: string;
      size: number;
      timestamp: string;
      title: string;
      url: string;
      user: string;
      userid: number;
      width: number;
    }[];
  };
};

type AllImagesRequest = {
  /**
    * When more results are available, use this to continue.
    */
  aicontinue?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  aidir?: 'ascending' | 'descending' | 'newer' | 'older';

  /**
    * The timestamp to stop enumerating at. Can only be used with `aisort=timestamp`.
    */
  aiend?: Date | string;

  /**
    * How to filter files uploaded by bots. Can only be used with `aisort=timestamp`.
    * Cannot be used together with `aiuser`.
    */
  aifilterbots?: 'all' | 'bots' | 'nobots';

  /**
    * The image title to start enumerating from. Can only be used with `aisort=name`.
    */
  aifrom?: string;

  /**
    * How many images in total to return.
    */
  ailimit?: number | 'max';

  /**
    * Disabled due to miser mode.
    */
  aimime?: string | string[];

  /**
    * Limit to images with at least this many bytes.
    */
  aiminsize?: number;

  /**
    * Limit to images with at most this many bytes.
    */
  aimaxsize?: number;

  /**
    * Search for all image titles that begin with this value. Can only be used with `aisort=name`.
    */
  aiprefix?: string;

  /**
    * Which file information to get.
    */
  aiprop?: Prop<
    'timestamp'
    | 'user'
    | 'userid'
    | 'comment'
    | 'parsedcomment'
    | 'canonicaltitle'
    | 'url'
    | 'size'
    | 'dimensions'
    | 'sha1'
    | 'mime'
    | 'mediatype'
    | 'metadata'
    | 'commonmetadata'
    | 'extmetadata'
    | 'bitdepth'
    | 'badfile'
  >;

  /**
    * SHA1 hash of image. Overrides `aisha1base36`.
    */
  aisha1?: string;

  /**
    * SHA1 hash of image in base 36 (used in MediaWiki).
    */
  aisha1base36?: string;

  /**
    * Property to sort by.
    * @default 'name'
    */
  aisort?: 'name' | 'timestamp';

  /**
    * The timestamp to start enumerating from. Can only be used with `aisort=timestamp`.
    */
  aistart?: Date | string;

  /**
    * The image title to stop enumerating at. Can only be used with `aisort=name`.
    */
  aito?: string;

  /**
    * Only return files where the last version was uploaded by this user.
    * Can only be used with `aisort=timestamp`.
    * Cannot be used together with `aifilterbots`.
    */
  aiuser?: string;
};

type AllLinks = {
  batchcomplete: boolean;
  continue?: {
    alcontinue: string;
    continue: string;
  };
  query: {
    alllinks: {
      fromid: number;
      ns: number;
      title: string;
    }[];
  };
};

type AllLinksRequest = {
  /**
    * When more results are available, use this to continue.
    */
  alcontinue?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  aldir?: 'ascending' | 'descending';

  /**
    * The title of the link to start enumerating from.
    */
  alfrom?: string;

  /**
    * How many total items to return.
    */
  allimit?: number | 'max';

  /**
    * The namespace to enumerate.
    */
  alnamespace?: number;

  /**
    * Search for all linked titles that begin with this value.
    */
  alprefix?: string;

  /**
    * Which pieces of information to include.
    */
  alprop?: Prop<'ids' | 'title'>;

  /**
    * The title of the link to stop enumerating at.
    */
  alto?: string;

  /**
    * Only show distinct linked titles. Cannot be used with `alprop=ids`.
    */
  alunique?: boolean;
};

type AllMessages = {
  query: {
    allmessages: Array<
        {
          name: string;
          normalizedname: string;
        } & (
          {
            content: string;
            missing: undefined;
          } | { missing: true }
        )
    >;
  };
};

type AllMessagesRequest = {
  /**
      * Arguments to be substituted into message.
      */
  amargs?: string | string[];

  /**
      * Return only messages in this customisation state.
      * @default 'all'
      */
  amcustomised?: 'all' | 'modified' | 'unmodified';

  /**
      * Set to enable parser, will preprocess the wikitext of the message
      * (substitute magic words, handle templates, etc.).
      */
  amenableparser?: boolean;

  /**
      * Return only messages with names that contain this string.
      */
  amfilter?: string;

  /**
      * Return messages starting at this message.
      */
  amfrom?: string;

  /**
      * Also include local messages, i.e. messages that don't exist in the software
      * but to exist as in the MediaWiki namespace.
      *
      * This lists all MediaWiki-namespace pages, so it will also list those that
      * aren't really messages such as Common.js.
      */
  amincludelocal?: boolean;

  /**
      * Return messages in this language.
      */
  amlang?: string;

  /**
      * Which messages to output. * (default) means all messages.
      */
  ammessages?: string | string[];
  /**
      * If set, do not inclued the content of the messages in the output.
      */
  amnocontent?: boolean;

  /**
      * Return messages with this prefix.
      */
  amprefix?: string;

  /**
      * Which properties to get.
      */
  amprop?: 'default';

  /**
      * Page name to use as context when parsing message (for `amenableparser` option).
      */
  amtitle?: string;

  /**
      * Return messages ending at this message.
      */
  amto?: string;
};

type AllPages = {
  batchcomplete: boolean;
  continue?: {
    apcontinue: string;
    continue: string;
  };
  query: {
    allpages: {
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type AllPagesRequest = {
  /**
    * When more results are available, use this to continue.
    */
  apcontinue?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  apdir?: 'ascending' | 'descending';

  /**
    * Filter based on whether a page has langlinks. Note that this may not consider
    * langlinks added by extensions.
    * @default 'all'
    */
  apfilterlanglinks?: 'all' | 'withlanglinks' | 'withoutlanglinks';

  /**
    * Which pages to list.
    * @default 'all'
    */
  apfilterredir?: 'all' | 'nonredirects' | 'redirects';

  /**
    * The page title to start enumerating from.
    */
  apfrom?: string;

  /**
    * How many total pages to return.
    */
  aplimit?: number | 'max';

  /**
    * Limit to pages with at most this many bytes.
    * Disabled due to miser mode.
    */
  apmaxsize?: number;

  /**
    * Limit to pages with at least this many bytes.
    */
  apminsize?: number;

  /**
    * The namespace to enumerate.
    */
  apnamespace?: number;

  /**
    * Search for all page titles that begin with this value.
    */
  apprefix?: string;

  /**
    * Which protection expiry to filter the page on.
    * @default 'all'
    */
  apprexpiry?: 'all' | 'definite' | 'indefinite';

  /**
    * Filter protections based on cascadingness (ignored when `apprtype` isn't set).
    * @default 'all'
  */
  apprfiltercascade?: 'all' | 'cascading' | 'noncascading';

  /**
    * Filter protections basedd on protection level (must be used with `apprtype=level` parameter).
    */
  apprlevel?: Prop<'' | 'autoconfirmed' | 'sysop'>;

  /**
    * Limit to protected pages only.
    */
  apprtype?: 'edit' | 'move' | 'upload';

  /**
    * The page title to stop enumerating at.
    */
  apto?: string;
};

type AllRedirects = {
  batchcomplete: boolean;
  continue?: {
    arcontinue: string;
    continue: string;
  };
  query: {
    allredirects: {
      fragment?: string;
      fromid: number;
      interwiki?: string;
      ns: number;
      title: string;
    }[];
  };
};

type AllRedirectsRequest = {
  /**
    * When more results are available, use this to continue.
    */
  arcontinue?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  ardir?: 'ascending' | 'descending';

  /**
    * The title of the redirect to start enumerating from.
    */
  arfrom?: string;

  /**
    * How many total items to return.
    */
  arlimit?: number | 'max';

  /**
    * The namespace to enumerate.
    */
  arnamespace?: number;

  /**
    * Search for all target pages that begin with this value.
    */
  arprefix?: string;

  /**
    * Which pieces of information to include.
    * @default 'title'
    */
  arprop?: Prop<'ids' | 'title' | 'fragment' | 'interwiki'>;

  /**
    * The title of the redirect to stop enumerating at.
    */
  arto?: string;

  /**
    * Only show distinct target pages.
    * Cannot be used with `arprop=ids|fragment|interwiki`.
    */
  arunique?: boolean;
};

type AllRevisions = {
  batchcomplete: boolean;
  query: {
    allrevisions: {
      pageid: number;
      revisions: {
        minor: boolean;
        parentid: number;
        revid: number;
        roles: string[];
        sha1: string;
        size: number;
        slots: {
          comment: string;
          main: {
            content: string;
            contentformat: string;
            contentmodel: string;
            sha1: string;
            size: number;
          };
          parsedcomment: string;
          tags: string[];
        };
        timestamp: string;
        user: string;
        userid: number;
      }[];
    }[];
  };
};

type AllRevisionsRequest = {
  /**
    * When more results are available, use this to continue.
    */
  arvcontinue?: string;

  /**
    * In which direction to enumerate.
    * @default 'older'
    */
  arvdir?: 'newer' | 'older';

  /**
    * The timestamp to stop enumerating at.
    */
  arvend?: Date | string;

  /**
    * Don't list revisions by this user.
    */
  arvexcludeuser?: string;

  /**
    * When being used as a generator, generate titles rather than revision IDs.
    */
  arvgeneratetitles?: boolean;

  /**
    * Limit how many revisions will be returned. If `arvprop=content` is used,
    * the limit is 50.
    */
  arvlimit?: number | 'max';

  /**
    * Only list pages in this namespace.
    */
  arvnamespace?: number | number[] | '*';

  /**
    * Which properties to get for each revision.
    */
  arvprop?: Prop<
    'ids'
    | 'flags'
    | 'timestamp'
    | 'user'
    | 'userid'
    | 'size'
    | 'slotsize'
    | 'sha1'
    | 'slotsha1'
    | 'contentmodel'
    | 'comment'
    | 'parsedcomment'
    | 'content'
    | 'tags'
    | 'roles'
  >;

  /**
    * Only retrieve the content of the section with this identifier.
    */
  arvsection?: string;

  /**
    * Which revision slots to return data for, when slot-related properties are
    * included in `arvprops`.
    */
  arvslots?: 'main' | string | string[];

  /**
    * The timestamp to start enumerating from.
    */
  arvstart?: Date | string;

  /**
    * Only list revisions by this user.
    */
  arvuser?: string;
};

type AllTransclusions = {
  batchcomplete: string;
  continue?: {
    atcontinue?: string;
    continue: string;
  };
  query: {
    alltransclusions: {
      fromid: number;
      ns: number;
      title: string;
    }[];
  };
};

type AllTransclusionsRequest = {
  /**
    * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
    */
  atcontinue?: string;

  /**
    * The title of the transclusion to start enumerating from.
    */
  atfrom?: string;

  /**
  * The title of the transclusion to stop enumerating at.
  */
  atto?: string;

  /**
  * Search for all transcluded titles that begin with this value.
  */
  atprefix?: string;

  /**
    * Only show distinct transcluded titles. Cannot be used with atprop=ids.
    */
  atunique?: boolean;

  /**
    * Which pieces of information to include:
    */
  atprop?: Prop<'ids' | 'title'>;

  /**
    * The namespace to enumerate.
    * @default 10
    */
  atnamespace?: number;

  /**
    * How many total items to return.
    */
  atlimit?: number | 'max';

  /**
    * The direction in which to list.
    * @default 'ascening'
    */
  atdir?: 'ascending' | 'descending';
};

type AllUsers = {
  batchcomplete: boolean;
  continue?: {
    aufrom: string;
    continue: string;
  };
  query: {
    allusers: {
      attachedlocal: Record<string, boolean>;
      blockanononly: boolean;
      blockedby: string;
      blockedbyid: number;
      blockedtimestamp: string;
      blockedtimestampformatted: string;
      blockemail: boolean;
      blockexpiry: string;
      blockid: number;
      blocknocreate: boolean;
      blockowntalk: boolean;
      blockpartial: boolean;
      blockreason: string;
      centralids: Record<string, number>;
      editcount: number;
      groups: string[];
      implicitgroups: string[];
      name: string;
      registration: string;
      rights: string[];
      userid: number;
    }[];
  };
};

type AllUsersRequest = {
  /**
    * The username to start enumerating from.
    */
  aufrom?: string;

  /**
    * The username to stop enumerating at.
    */
  auto?: string;

  /**
    * Search for all users that begin with this value.
    */
  auprefix?: string;

  /**
    * Direction to sort in.
    * @default 'ascending'
    */
  audir?: 'ascending' | 'descending';

  /**
    * Only include users in the given groups. Does not include implicit or auto-promoted
    * groups like *, user, or autoconfirmed.
    */
  augroup?: string | string[];

  /**
    * Exclude users in the given groups.
    */
  auexcludegroup?: string | string[];

  /**
    * Only include users with the given rights. Does not include rights granted
    * by implicit or auto-promoted groups like *, user, or autoconfirmed.
    */
  aurights?: string | string[];

  /**
    * Which pieces of information to include:
    */
  auprop?: Prop<
    'blockinfo'
    | 'groups'
    | 'implicitgroups'
    | 'rights'
    | 'editcount'
    | 'registration'
    | 'centralids'
  >;

  /**
    * How many total usernames to return.
    */
  aulimit?: number | 'max';

  /**
    * Only list users who have made edits.
    */
  auwitheditsonly?: boolean;

  /**
    * Only list users active in the last 30 days.
    */
  auactiveusers?: boolean;

  /**
    * With auprop=centralids, also indicate whether the user is attached with the wiki identified by this ID.
    */
  auattachedwiki?: string;

  /**
    * Exclude users of named accounts.
    */
  auexcludenamed?: boolean;

  /**
    * Exclude users of temporary accounts.
    */
  auexcludetemp?: boolean;
};

type Backlinks = {
  batchcomplete: boolean;
  continue?: {
    blcontinue: string;
    continue: string;
  };
  query: {
    backlinks: {
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type BacklinksRequest = {
  /**
    * Title to search. Cannot be used together with blpageid.
    */
  bltitle?: string;

  /**
    * Page ID to search. Cannot be used together with bltitle.
    */
  blpageid?: number;

  /**
    * When more results are available, use this to continue.
    */
  blcontinue?: string;

  /**
    * The namespace to enumerate.
    */
  blnamespace?: number | number[] | '*';

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  bldir?: 'ascending' | 'descending';

  /**
    * How to filter for redirects. If set to nonredirects when blredirect is enabled, this is only applied to the second level.
    */
  blfilterredir?: 'all' | 'nonredirects' | 'redirects';

  /**
    * How many total pages to return. If blredirect is enabled, the limit applies to each level separately (which means up to 2 * bllimit results may be returned).
    */
  bllimit?: number | 'max';

  /**
    * If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
    */
  blredirect?: boolean;
};

type Block = {
  block: {
    expiry: string;
    id: string;
    reason: string;
    user: string;
    userID: number;
  };
};

type BlockRequest = {
  /**
    * ID of the block to modify (obtained through list=blocks). Cannot be used together with user, reblock, or newblock.
    */
  id?: number;

  /**
    * User to block. Cannot be used together with id.
    */
  user?: string;

  /**
    * Expiry time. May be relative (e.g. 5 months or 2 weeks) or absolute (e.g. 2014-09-18T12:34:56Z). If set to infinite, indefinite, or never, the block will never expire.
    */
  expiry?: Date | string;

  /**
    * Reason for block.
    */
  reason?: string;

  /**
    * Block anonymous users only (i.e. disable anonymous edits for this IP address, including temporary account edits).
    */
  anononly?: boolean;

  /**
    * Prevent account creation.
    */
  nocreate?: boolean;

  /**
    * Automatically block the last used IP address, and any subsequent IP addresses they try to login from.
    */
  autoblock?: boolean;

  /**
    * Prevent user from sending email through the wiki. (Requires the blockemail right).
    */
  noemail?: boolean;

  /**
    * Hide the username from the block log. (Requires the hideuser right).
    */
  hidename?: boolean;

  /**
    * Allow the user to edit their own talk page (depends on $wgBlockAllowsUTEdit).
    */
  allowusertalk?: boolean;

  /**
    * If the user is already blocked by a single block, overwrite the existing block. If the user is blocked more than once, this will fail—use the id parameter instead to specify which block to overwrite. Cannot be used together with id or newblock.
    */
  reblock?: boolean;

  /**
    * Add another block even if the user is already blocked. Cannot be used together with id or reblock.
    */
  newblock?: boolean;

  /**
    * Watch the user's or IP address's user and talk pages.
    */
  watchuser?: boolean;

  /**
    * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
    */
  watchlistexpiry?: Date | 'string';

  /**
    * Change tags to apply to the entry in the block log.
    */
  tags?: string | string[];

  /**
    * Block user from specific pages or namespaces rather than the entire site.
    */
  partial?: boolean;

  /**
    * List of titles to block the user from editing. Only applies when partial is set to true.
    */
  pagerestrictions?: string | string[];

  /**
    * List of namespace IDs to block the user from editing. Only applies when partial is set to true.
    */
  namespacerestrictions?: number | number[] | '*';

  /**
    * List of actions to block the user from performing. Only applies when partial is set to true.
    */
  actionrestrictions?: string | string[];
};

type Blocks = {
  batchcomplete: boolean;
  continue?: {
    bkcontinue: string;
    continue: string;
  };
  query: {
    blocks: {
      allowusertalk: boolean;
      anononly: boolean;
      autoblock: boolean;
      automatic: boolean;
      by: string;
      byid: number;
      'duration-l10n': string;
      expiry: string;
      hidden: boolean;
      id: number;
      nocreate: boolean;
      noemail: boolean;
      parsedreason: string;
      partial: boolean;
      reason: string;
      restrictions: unknown[];
      timestamp: string;
    }[];
  };
};

type BlocksRequest = {
  /**
    * The timestamp to start enumerating from.
    */
  bkstart?: Date | string;

  /**
    * The timestamp to stop enumerating at.
    */
  bkend?: Date | string;

  /**
    * In which direction to enumerate.
    * @default 'older'
    */
  bkdir?: 'newer' | 'older';

  /**
    * List of block IDs to list (optional).
    */
  bkids?: number | number[];

  /**
    * List of users to search for (optional).
    */
  bkusers?: string | string[];

  /**
    * Get all blocks applying to this IP address or CIDR range, including range blocks.
    * Cannot be used together with bkusers. CIDR ranges broader than IPv4/16 or IPv6/19 are not accepted.
    */
  bkip?: string;


  /**
    * The maximum number of blocks to list.
    */
  bklimit?: number | 'max';

  /**
    * Which properties to get:
    */
  bkprop?: Prop<
    'id'
    | 'user'
    | 'userid'
    | 'by'
    | 'byid'
    | 'timestamp'
    | 'expiry'
    | 'reason'
    | 'parsedreason'
    | 'range'
    | 'flags'
    | 'restrictions'
  >;

  /**
    * Show only items that meet these criteria.
    */
  bkshow?: Prop<'!account' | '!ip' | '!range' | '!temp' | 'account' | 'ip' | 'range' | 'temp'>;

  /**
    * When more results are available, use this to continue.
    */
  bkcontinue?: string;
};

type Categories = {
  batchcomplete: boolean;
  continue?: {
    clcontinue: string;
    continue: string;
  };
  query: {
    pages: {
      categories: {
        hidden: boolean;
        ns: number;
        sortkey: string;
        sortkeyprefix: string;
        timestamp: string;
        title: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type CategoriesRequest = {
  /**
    * Which additional properties to get for each category:
    */
  clprop?: Prop<'sortkey' | 'timestamp' | 'hidden'>;

  /**
    * Which kind of categories to show.
    */
  clshow?: Prop<'!hidden' | 'hidden'>;

  /**
    * How many categories to return.
    */
  cllimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  clcontinue?: string;

  /**
    * Only list these categories. Useful for checking whether a certain page is in a certain category.
    */
  clcategories?: string | string[];

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  cldir?: 'ascending' | 'descending';

  titles: string | string[];
};

type CategoryInfo = {
  batchcomplete: boolean;
  continue?: {
    cicontinue: string;
    continue: string;
  };
  query: {
    pages: {
      categoryinfo: {
        files: number;
        hidden: boolean;
        pages: number;
        size: number;
        subcats: number;
      };
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type CategoryInfoRequest = {
  /**
    * When more results are available, use this to continue.
    */
  cicontinue?: string;

  titles: string | string[];
};

type CategoryMembers = {
  batchcomplete: boolean;
  continue?: {
    cmcontinue: string;
    continue: string;
  };
  query: {
    categorymembers: {
      ns: number;
      pageid: number;
      sortkey: string;
      sortkeyprefix: string;
      timestamp: string;
      title: string;
      type: string;
    }[];
  };
};

type CategoryMembersRequest = {
  /**
    * Which category to enumerate (required). Must include the Category: prefix.
    * Cannot be used together with cmpageid.
    */
  cmtitle?: string;

  /**
    * Page ID of the category to enumerate. Cannot be used together with cmtitle.
    */
  cmpageid?: number;

  /**
    * Which pieces of information to include:
    */
  cmprop?: Prop<'ids' | 'title' | 'sortkey' | 'sortkeyprefix' | 'type' | 'timestamp'>;

  /**
    * Only include pages in these namespaces. Note that cmtype=subcat or cmtype=file may be
    * used instead of cmnamespace=14 or 6.
    */
  cmnamespace?: number | number[] | '*';

  /**
    * Which type of category members to include. Ignored when cmsort=timestamp is set.
    */
  cmtype?: Prop<'page' | 'subcat' | 'file'>;

  /**
    * When more results are available, use this to continue.
    */
  cmcontinue?: string;

  /**
    * The maximum number of pages to return.
    */
  cmlimit?: number | 'max';

  /**
    * Property to sort by.
    * @default 'sortkey'
  */
  cmsort?: 'sortkey' | 'timestamp';

  /**
    * In which direction to sort.
    * @default 'ascending'
    */
  cmdir?: 'asc' | 'ascending' | 'desc' | 'descending' | 'newer' | 'older';

  /**
    * Timestamp to start listing from. Can only be used with cmsort=timestamp.
    */
  cmstart?: Date | string;

  /**
    * Timestamp to end listing at. Can only be used with cmsort=timestamp.
    */
  cmend?: Date | string;

  /**
    * Sortkey to start listing from, as returned by cmprop=sortkey. Can only be used with cmsort=sortkey.
    */
  cmstarthexsortkey?: string;

  /**
    * Sortkey to end listing at, as returned by cmprop=sortkey. Can only be used with cmsort=sortkey.
    */
  cmendhexsortkey?: string;

  /**
    * Sortkey prefix to start listing from. Can only be used with cmsort=sortkey. Overrides cmstarthexsortkey.
    */
  cmstartsortkeyprefix?: string;

  /**
    * Sortkey prefix to end listing before (not at; if this value occurs it will not be included!).
    * Can only be used with cmsort=sortkey. Overrides cmendhexsortkey.
    */
  cmendsortkeyprefix?: string;
};

type Contributors = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    pccontinue: string;
  };
  query: {
    pages: {
      anoncontributors: number;
      contributors: {
        name: string;
        userid: number;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type ContributorsRequest = {
  /**
    * Only include users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
    */
  pcgroup?: string | string[];

  /**
    * Exclude users in the given groups. Does not include implicit or auto-promoted groups like *, user, or autoconfirmed.
    */
  pcexcludegroup?: string | string[];

  /**
    * Only include users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
    */
  pcrights?: string | string[];

  /**
    * Exclude users having the given rights. Does not include rights granted by implicit or auto-promoted groups like *, user, or autoconfirmed.
    */
  pcexcluderights?: string | string[];

  /**
    * How many contributors to return.
    */
  pclimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  pccontinue?: string;

  titles: string | string[];
};

type DeletedRevisions = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    drvcontinue: string;
  };
  query: {
    pages: {
      deletedrevisions: {
        comment: string;
        minor: boolean;
        missing: boolean;
        ns: number;
        parentid: number;
        parsedcomment: string;
        revid: number;
        roles: string[];
        sha1: string;
        slots: {
          main: {
            content: string;
            contentformat: string;
            contentmodel: string;
            sha1: string;
            size: number;
          };
        };
        timestamp: boolean;
        user: string;
        userid: number;
      }[];
      title: string;
    }[];
  };
};

type DeletedRevisionsRequest = {
  /**
    * Which properties to get for each revision:
    */
  drvprop?: Prop<
    'ids'
    | 'flags'
    | 'timestamp'
    | 'user'
    | 'userid'
    | 'size'
    | 'slotsize'
    | 'sha1'
    | 'slotsha1'
    | 'contentmodel'
    | 'comment'
    | 'parsedcomment'
    | 'content'
    | 'tags'
    | 'roles'
  >;

  /**
    * Which revision slots to return data for, when slot-related properties are included in drvprops. If omitted, data from the main slot will be returned in a backwards-compatible format.
    */
  drvslots: 'main';

  /**
    * Limit how many revisions will be returned. If drvprop=content, drvprop=parsetree, drvdiffto or drvdifftotext is used, the limit is 50. If drvparse is used, the limit is 1.
    */
  drvlimit?: number | 'max';

  /**
    * Only retrieve the content of the section with this identifier.
    */
  drvsection?: string;

  /**
    * The timestamp to start enumerating from. Ignored when processing a list of revision IDs.
    */
  drvstart?: Date | string;

  /**
    * The timestamp to stop enumerating at. Ignored when processing a list of revision IDs.
    */
  drvend?: Date | string;

  /**
    * In which direction to enumerate.
    * @default 'older'
    */
  drvdir?: 'newer' | 'older';

  /**
    * Only list revisions tagged with this tag.
    */
  drvtag?: string;

  /**
    * Only list revisions by this user.
    */
  drvuser?: string;

  /**
    * Don't list revisions by this user.
    */
  drvexcludeuser?: string;

  /**
    * When more results are available, use this to continue.
    */
  drvcontinue?: string;

  titles: string | string[];
};

type DuplicateFiles = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    dfcontinue: string;
  };
  normalized?: {
    from: string;
    fromencoded: boolean;
    to: string;
  };
  query: {
    pages: {
      missing: boolean;
      ns: number;
      title: string;
    }[];
  };
};

type DuplicateFilesRequest = {
  /**
    * How many duplicate files to return.
    */
  dflimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  dfcontinue?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  dfdir?: 'ascending' | 'descending';

  /**
    * Look only for files in the local repository.
    */
  dflocalonly?: boolean;

  titles: string | string[];
};

type Edit = {
  edit: {
    contentmodel: string;
    newrevid: number;
    newtimestamp: string;
    oldrevid: number;
    pageid: number;
    result: string;
    title: string;
  };
};

type EditRequest = {
  /**
    * Title of the page to edit. Cannot be used together with pageid.
    */
  title?: string;

  /**
    * Page ID of the page to edit. Cannot be used together with title.
    */
  pageid?: number;

  /**
    * Section identifier. 0 for the top section, new for a new section. Often a positive integer, but can also be non-numeric.
    */
  section?: string;

  /**
    * The title for a new section when using section=new.
    */
  sectiontitle?: string;

  /**
    * Page content.
    */
  text?: string;

  /**
    * Edit summary.
    * When this parameter is not provided or empty, an edit summary may be generated automatically.
    * When using section=new and sectiontitle is not provided, the value of this parameter is used for the section title instead, and an edit summary is generated automatically.
    */
  summary?: string;

  /**
    * Change tags to apply to the revision.
    */
  tags?: string | string[];

  /**
    * Mark this edit as a minor edit.
    */
  minor?: boolean;

  /**
    * Do not mark this edit as a minor edit even if the "Mark all edits minor by default" user preference is set.
    */
  notminor?: boolean;

  /**
    * Mark this edit as a bot edit.
    */
  bot?: boolean;

  /**
    * ID of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions. Self-conflicts cause the edit to fail unless basetimestamp is set.
    */
  baserevid?: number;

  /**
    * Timestamp of the base revision, used to detect edit conflicts. May be obtained through action=query&prop=revisions&rvprop=timestamp. Self-conflicts are ignored.
    */
  basetimestamp?: Date | string;

  /**
    * Timestamp when the editing process began, used to detect edit conflicts. An appropriate value may be obtained using curtimestamp when beginning the edit process (e.g. when loading the page content to edit).
    */
  starttimestamp?: Date | string;

  /**
    * Override any errors about the page having been deleted in the meantime.
    */
  recreate?: boolean;

  /**
    * Don't edit the page if it exists already.
    */
  createonly?: boolean;

  /**
    * Throw an error if the page doesn't exist.
    */
  nocreate?: string;

  /**
    * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
    */
  watchlist?: 'nochange' | 'preferences' | 'unwatch' | 'watch';

  /**
    * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
    */
  watchlistexpiry?: Date | string;

  /**
    * The MD5 hash of the text parameter, or the prependtext and appendtext parameters concatenated. If set, the edit won't be done unless the hash is correct.
    */
  md5?: string;

  /**
    * Add this text to the beginning of the page or section. Overrides text.
    */
  prependtext?: string;

  /**
    * Add this text to the end of the page or section. Overrides text.
    */
  appendtext?: string;

  /**
    * Undo this revision. Overrides text, prependtext and appendtext.
    */
  undo?: number;

  /**
    * Undo all revisions from undo to this one. If not set, just undo one revision.
    */
  undoafter?: number;

  /**
    * Automatically resolve redirects.
    */
  redirect?: boolean;

  /**
    * Content serialization format used for the input text.
    */
  contentformat?: string;

  /**
    * Content model of the new content.
    */
  contentmodel?: string;

  /**
    * Page title. If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to the given page, instead of the page that was edited.
    */
  returnto?: string;

  /**
    * URL query parameters (with leading ?). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given query parameters.
    */
  returntoquery?: string;

  /**
    * URL fragment (with leading #). If saving the edit created a temporary account, the API may respond with an URL that the client should visit to complete logging in. If this parameter is provided, the URL will redirect to a page with the given fragment.
    */
  returntoanchor?: string;

  /**
    * Answer to the CAPTCHA
    */
  captchaword?: string;

  /**
    * CAPTCHA ID from previous request
    */
  captchaid?: string;
};

type EmbeddedIn = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    eicontinue: string;
  };
  query: {
    embeddedin: {
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type EmbeddedInRequest = {
  /**
    * Title to search. Cannot be used together with eipageid.
    */
  eititle?: string;

  /**
    * Page ID to search. Cannot be used together with eititle.
    */
  eipageid?: number;

  /**
    * When more results are available, use this to continue.
    */
  eicontinue?: string;

  /**
    * The namespace to enumerate.
    */
  einamespace?: number | number[] | '*';

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  eidir?: 'ascending' | 'descending';

  /**
    * How to filter for redirects.
    * @default 'all'
    */
  eifilterredir?: 'all' | 'nonredirects' | 'redirects';

  /**
    * How many total pages to return.
    */
  eilimit?: number | 'max';
};

type ExtLinks = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    elcontinue: string;
  };
  query: {
    pages: {
      extlinks: {
        url: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type ExtLinksRequest = {
  /**
    * How many links to return.
    */
  ellimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  elcontinue?: string;

  /**
    * Protocol of the URL. If empty and elquery is set, the protocol is http and https. Leave both this and elquery empty to list all external links.
    */
  elprotocol?: string;

  /**
    * Search string without protocol. Useful for checking whether a certain page contains a certain external url.
    */
  elquery?: string;

  titles: string | string[];
};

type ExtUrlUsage = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    eucontinue: string;
  };
  query: {
    exturlusage: {
      ns: number;
      pageid: number;
      title: string;
      url: string;
    }[];
  };
};

type ExtUrlUsageRequest = {
  /**
    * Which pieces of information to include:
    */
  euprop?: Prop<'ids' | 'title' | 'url'>;

  /**
    * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
    */
  eucontinue?: string;

  /**
    * Protocol of the URL. If empty and euquery is set, the protocol is http and https.
    * Leave both this and euquery empty to list all external links.
    */
  euprotocol?: string | string[];

  /**
    * Search string without protocol. See Special:LinkSearch. Leave empty to list all external links.
    */
  euquery?: string;

  /**
    * The page namespaces to enumerate.
    */
  eunamespace?: number | number[] | '*';

  /**
    * How many pages to return.
    */
  eulimit?: number | 'max';
};

type FileArchive = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    facontinue: string;
  };
  query: {
    filearchive: {
      bitdepth: `${number}`;
      description: string;
      height: `${number}`;
      id: number;
      mediatype: string;
      metadata: {
        name: string;
        value: unknown;
      }[];
      mime: string;
      name: string;
      ns: number;
      parseddescription: string;
      sha1: string;
      size: `${number}`;
      timestamp: string;
      title: string;
      user: string;
      userid: number;
      width: `${number}`;
    }[];
  };
};

type FileArchiveRequest = {
  /**
    * The image title to start enumerating from.
    */
  fafrom?: string;

  /**
    * The image title to stop enumerating at.
    */
  fato?: string;

  /**
    * Search for all image titles that begin with this value.
    */
  faprefix?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  fadir?: 'ascending' | 'descending';

  /**
    * SHA1 hash of image. Overrides fasha1base36.
    */
  fasha1?: string;

  /**
    * SHA1 hash of image in base 36 (used in MediaWiki).
    */
  fasha1base36?: string;

  /**
    * Which image information to get.
    */
  faprop?: Prop<
    'sha1'
    | 'timestamp'
    | 'user'
    | 'size'
    | 'dimensions'
    | 'description'
    | 'parseddescription'
    | 'mime'
    | 'mediatype'
    | 'metadata'
    | 'bitdepth'
    | 'archivename'
  >;

  /**
    * How many images to return in total.
    */
  falimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  facontinue?: string;
};

type FileRepoInfo = {
  query: {
    repos: {
      canUpload: boolean;
      descBaseUrl: string;
      descriptionCacheExpiry: string;
      displayname: string;
      favicon: string;
      fetchDescription: boolean;
      initialCapital: boolean;
      local: boolean;
      name: string;
      rootUrl: string;
      scriptDirUrl: string;
      thumbUrl: string;
      url: string;
    }[];
  };
};

type FileRepoInfoRequest = {
  /**
      * Which repository properties to get.
      */
  friprop: Prop<
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
  >;
};

type FileUsage = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    fucontinue: string;
  };
  query: {
    pages: {
      fileusage: {
        ns: number;
        pageid: number;
        redirect: boolean;
        title: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type FileUsageRequest = {
  /**
    * Which properties to get:
    */
  fuprop?: Prop<'pageid' | 'title' | 'redirect'>;

  /**
    * Only include pages in these namespaces.
    */
  funamespace?: number | number[] | '*';

  /**
    * Show only items that meet these criteria:
    */
  fushow?: Prop<'!redirect' | 'redirect'>;

  /**
    * How many to return.
    */
  fulimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  fucontinue?: string;

  titles: string | string[];
};

type GlobalUsage = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    gucontinue: string;
  };
  query: {
    pages: {
      globalusage: {
        ns: string;
        pageid: string;
        title: string;
        url: string;
        wiki: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type GlobalUsageRequest = {
  /**
    * Which properties to return:
    */
  guprop?: Prop<'url' | 'pageid' | 'namespace'>;

  /**
    * How many links to return.
    */
  gulimit?: number | 'max';

  /**
    * Limit results to these namespaces.
    */
  gunamespace?: number | number[] | '*';

  /**
    * Limit results to these sites.
    */
  gusite?: string | string[];

  /**
    * When more results are available, use this to continue.
    */
  gucontinue?: string;

  /**
    * Filter local usage of the file.
    */
  gufilterlocal?: boolean;

  titles: string | string[];
};

type ImageInfo = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    iicontinue: string;
  };
  query: {
    normalized?: {
      from: string;
      fromencoded: boolean;
      to: string;
    }[];
    pages: {
      badfile: boolean;
      imageinfo: {
        bitdepth: number;
        canonicaltitle: string;
        comment: string;
        commonmetadata: {
          name: string;
          value: unknown;
        }[];
        descriptionshorturl: string;
        descriptionurl: string;
        extmetadata: Record<string, {
          hidden: boolean;
          source: string;
          value: unknown;
        }>;
        filemissing: boolean;
        height: number;
        html: string;
        mediatype: string;
        metadata: {
          name: string;
          value: unknown;
        }[];
        mime: string;
        parsedcomment: string;
        sha1: string;
        timestamp: string;
        url: string;
        user: string;
        userid: number;
        width: number;
      }[];
      imagerepository: string;
      missing: boolean;
      ns: number;
      title: string;
    }[];
  };
};

type ImageInfoRequest = {
  /**
    * Which file information to get:
    */
  iiprop?: Prop<
    'timestamp'
    | 'user'
    | 'userid'
    | 'comment'
    | 'parsedcomment'
    | 'canonicaltitle'
    | 'url'
    | 'size'
    | 'dimensions'
    | 'sha1'
    | 'mime'
    | 'thumbmime'
    | 'mediatype'
    | 'metadata'
    | 'commonmetadata'
    | 'extmetadata'
    | 'archivename'
    | 'bitdepth'
    | 'uploadwarning'
    | 'badfile'
  >;

  /**
    * How many file revisions to return per file.
    */
  iilimit?: number | 'max';

  /**
    * Timestamp to start listing from.
    */
  iistart?: Date | string;

  /**
    * Timestamp to stop listing at.
    */
  iiend?: Date | string;

  /**
    * If iiprop=url is set, a URL to an image scaled to this width will be returned.
    */
  iiurlwidth?: number;

  /**
    * Similar to iiurlwidth.
    */
  iiurlheight?: number;

  /**
    * Version of metadata to use. If latest is specified, use latest version. Defaults to 1 for backwards compatibility.
    */
  iimetadataversion?: number;

  /**
    * What language to fetch extmetadata in. This affects both which translation to fetch, if multiple are available, as well as how things like numbers and various values are formatted.
    */
  iiextmetadatalanguage?: string;

  /**
    * If translations for extmetadata property are available, fetch all of them.
    */
  iiextmetadatamultilang?: boolean;

  /**
    * If specified and non-empty, only these keys will be returned for iiprop=extmetadata.
    */
  iiextmetadatafilter?: string | string[];

  /**
    * A handler specific parameter string. For example, PDFs might use page15-100px. iiurlwidth must be used and be consistent with iiurlparam.
    */
  iiurlparam?: string;

  /**
    * If badfilecontexttitleprop=badfile is set, this is the page title used when evaluating the MediaWiki:Bad image list
    */
  iibadfilecontexttitle?: string;

  /**
    * When more results are available, use this to continue.
    */
  iicontinue?: string;

  /**
    * Look only for files in the local repository.
    */
  iilocalonly?: boolean;

  titles: string | string[];
};

type Images = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    imcontinue: string;
  };
  query: {
    pages: {
      images: {
        ns: number;
        title: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type ImagesRequest = {
  /**
    * How many files to return.
    */
  imlimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  imcontinue?: string;

  /**
    * Only list these files. Useful for checking whether a certain page has a certain file.
    */
  imimages?: string | string[];

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  imdir?: 'ascending' | 'descending';

  titles: string | string[];
};

type ImageUsage = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    iucontinue: string;
  };
  query: {
    imageusage: {
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type ImageUsageRequest = {
  /**
    * Title to search. Cannot be used together with iupageid.
    */
  iutitle?: string;

  /**
    * Page ID to search. Cannot be used together with iutitle.
    */
  iupageid?: number;

  /**
    * When more results are available, use this to continue.
    */
  iucontinue?: string;

  /**
    * The namespace to enumerate.
    */
  iunamespace?: number | number[] | '*';

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  iudir?: 'ascending' | 'descending';

  /**
    * How to filter for redirects. If set to nonredirects when iuredirect is enabled, this is only applied to the second level.
    * @default 'all'
    */
  iufilterredir?: 'all' | 'nonredirects' | 'redirects';

  /**
    * How many total pages to return. If iuredirect is enabled, the limit applies to each level separately (which means up to 2 * iulimit results may be returned).
    */
  iulimit?: number | 'max';

  /**
    * If linking page is a redirect, find all pages that link to that redirect as well. Maximum limit is halved.
    */
  iuredirect?: boolean;
};

type Info = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    incontinue: string;
  };
  query: {
    pages: {
      associatedpage: string;
      canonicalurl: string;
      contentmodel: string;
      displaytitle: string;
      editintro: Record<string, string>;
      editurl: string;
      fullurl: string;
      lastrevid: number;
      length: number;
      linkclasses: string[];
      notificationtimestamp: string;
      ns: number;
      pageid: number;
      pagelanguage: string;
      pagelanguagedir: string;
      pagelanguagehtmlcode: string;
      protection: {
        expiry: string;
        level: string;
        type: string;
      }[];
      restrictiontypes: string[];
      talkid: number;
      title: string;
      touched: string;
      varianttitles: Record<string, string>;
      visitingwatchers: number;
      watched: boolean;
      watchers: number;
    }[];
  };
};

type InfoRequest = {
  /**
    * Which additional properties to get:
    */
  inprop?: Prop<
    'protection'
    | 'talkid'
    | 'watched'
    | 'watchers'
    | 'visitingwatchers'
    | 'notificationtimestamp'
    | 'subjectid'
    | 'associatedpage'
    | 'url'
    | 'preloadcontent'
    | 'editintro'
    | 'displaytitle'
    | 'varianttitles'
    | 'linkclasses'
  >;

  /**
    * The context title to use when determining extra CSS classes (e.g. link colors) when inprop contains linkclasses.
    */
  inlinkcontext?: string;

  /**
    * Test whether the current user can perform certain actions on the page.
    */
  intestactions?: string | string[];

  /**
    * Detail level for intestactions. Use the main module's errorformat and errorlang parameters to control the format of the messages returned.
    */
  intestactionsdetail?: 'boolean' | 'full' | 'quick';

  /**
    * Test whether performing intestactions would automatically create a temporary account.
    */
  intestactionsautocreate?: boolean;

  /**
    * Title of a custom page to use as preloaded content.
    * Only used when inprop contains preloadcontent.
    */
  inpreloadcustom?: string;

  /**
    * Parameters for the custom page being used as preloaded content.
    * Only used when inprop contains preloadcontent.
    */
  inpreloadparams?: string | string[];

  /**
    * Return preloaded content for a new section on the page, rather than a new page.
    * Only used when inprop contains preloadcontent.
    */
  inpreloadnewsection?: boolean;

  /**
    * Some intro messages come with optional wrapper frames. Use moreframes to include them or lessframes to omit them.
    * Only used when inprop contains editintro.
    * @default 'moreframes'
    */
  ineditintrostyle?: 'lessframes' | 'moreframes';

  /**
    * List of intro messages to remove from the response. Use this if a specific message is not relevant to your tool, or if the information is conveyed in a different way.
    * Only used when inprop contains editintro.
    */
  ineditintroskip?: string | string[];

  /**
    * Title of a custom page to use as an additional intro message.
    * Only used when inprop contains editintro.
    */
  ineditintrocustom?: string;

  /**
    * When more results are available, use this to continue.
    */
  incontinue?: string;

  titles: string | string[];
};

type IwBacklinks = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    iwblcontinue: string;
  };
  query: {
    iwbacklinks: {
      iwprefix: string;
      iwtitle: string;
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type IwBacklinksRequest = {
  /**
    * Prefix for the interwiki.
    */
  iwblprefix?: string;

  /**
    * Interwiki link to search for. Must be used with iwblblprefix.
    */
  iwbltitle?: string;

  /**
    * When more results are available, use this to continue.
    */
  iwblcontinue?: string;

  /**
    * How many total pages to return.
    */
  iwbllimit?: number | 'max';

  /**
    * Which properties to get:
    */
  iwblprop?: Prop<'iwprefix' | 'iwtitle'>;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  iwbldir?: 'ascending' | 'descending';
};

type IwLinks = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    iwprop: string;
  };
  query: {
    pages: {
      iwlinks: {
        prefix: string;
        title: string;
        url: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type IwLinksRequest = {
  /**
    * Which additional properties to get for each interwiki link:
    */
  iwprop?: Prop<'url'>;

  /**
    * Only return interwiki links with this prefix.
    */
  iwprefix?: string;

  /**
    * Interwiki link to search for. Must be used with iwprefix.
    */
  iwtitle?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  iwdir?: 'ascending' | 'descending';

  /**
    * How many interwiki links to return.
    */
  iwlimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  iwcontinue?: string;

  titles: string | string[];
};

type LangBacklinks = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    lblcontinue: string;
  };
  query: {
    langbacklinks: {
      lllang: string;
      lltitle: string;
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type LangBacklinksRequest = {
  /**
    * Language for the language link.
    */
  lbllang?: string;

  /**
    * Language link to search for. Must be used with lbllang.
    */
  lbltitle?: string;

  /**
    * When more results are available, use this to continue.
    */
  lblcontinue?: string;

  /**
    * How many total pages to return.
    */
  lbllimit?: number | 'max';

  /**
    * Which properties to get:
    */
  lblprop?: Prop<'lllang' | 'lltitle'>;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  lbldir?: 'ascending' | 'descending';
};

type LangLinks = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    llcontinue: string;
  };
  query: {
    pages: {
      langlinks: {
        autonym: string;
        lang: string;
        langname: string;
        title: string;
        url: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type LangLinksRequest = {
  /**
    * Which additional properties to get for each interlanguage link:
    */
  llprop?: Prop<'url' | 'langname' | 'autonym'>;

  /**
    * Only return language links with this language code.
    */
  lllang?: string;

  /**
    * Link to search for. Must be used with lllang.
    */
  lltitle?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  lldir?: 'ascending' | 'descending';

  /**
    * Language code for localised language names.
    */
  llinlanguagecode?: string;

  /**
    * How many langlinks to return.
    */
  lllimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  llcontinue?: string;

  titles: string | string[];
};

type Links = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    plcontinue: string;
  };
  query: {
    pages: {
      links: {
        ns: number;
        title: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type LinksRequest = {
  /**
    * Show links in these namespaces only.
    */
  plnamespace?: number | number[] | '*';

  /**
    * How many links to return.
    */
  pllimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  plcontinue?: string;

  /**
    * Only list links to these titles. Useful for checking whether a certain page links to a certain title.
    */
  pltitles?: string | string[];

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  pldir?: 'ascending' | 'descending';

  titles: string | string[];
};

type LinksHere = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    lhcontinue: string;
  };
  query: {
    pages: {
      linkshere: {
        ns: number;
        pageid: number;
        redirect: boolean;
        title: string;
      }[];
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type LinksHereRequest = {
  /**
    * Which properties to get:
    */
  lhprop?: Prop<'pageid' | 'title' | 'redirect'>;

  /**
    * Only include pages in these namespaces.
    */
  lhnamespace?: number | number[] | '*';

  /**
    * Show only items that meet these criteria:
    */
  lhshow?: Prop<'!redirect' | 'redirect'>;

  /**
    * How many to return.
    */
  lhlimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  lhcontinue?: string;

  titles: string | string[];
};

type LogEvents = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    lecontinue: string;
  };
  query: {
    logevents: {
      action: string;
      comment: string;
      logid: number;
      logpage: number;
      ns: number;
      pageid: number;
      params: Record<string, unknown>;
      parsedcomment: string;
      revid: number;
      tags: string[];
      timestamp: string;
      title: string;
      type: string;
      user: string;
      userid: number;
    }[];
  };
};

type LogEventsRequest = {
  /**
    * Which properties to get:
    */
  leprop?: Prop<
    'ids'
    | 'title'
    | 'type'
    | 'user'
    | 'userid'
    | 'timestamp'
    | 'comment'
    | 'parsedcomment'
    | 'details'
    | 'tags'
  >;

  /**
    * Filter log entries to only this type.
    */
  letype?: string;

  /**
    * Filter log actions to only this action. Overrides letype.
    * In the list of possible values, values with the asterisk wildcard such as action/* can have different strings after the slash (/).
    */
  leaction?: string;

  /**
    * The timestamp to start enumerating from.
    */
  lestart?: Date | string;

  /**
    * The timestamp to end enumerating.
    */
  leend?: Date | string;

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  ledir?: 'newer' | 'older';

  /**
    * Filter entries to those matching the given log ID(s).
    */
  leids?: number | number[];

  /**
    * Filter entries to those made by the given user.
    */
  leuser?: string;

  /**
    * Filter entries to those related to a page.
    */
  letitle?: string;

  /**
    * Filter entries to those in the given namespace.
    */
  lenamespace?: number;

  /**
    * Disabled due to miser mode.
    */
  leprefix?: string;

  /**
    * Only list event entries tagged with this tag.
    */
  letag?: string;

  /**
    * How many total event entries to return.
    */
  lelimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  lecontinue?: string;
};

type PagePropNames = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    ppncontinue: string;
  };
  query: {
    pagepropnames: {
      propname: string;
    }[];
  };
};

type PagePropNamesRequest = {
  /**
    * When more results are available, use this to continue.
    */
  ppncontinue?: string;

  /**
    * The maximum number of names to return.
    */
  ppnlimit?: number | 'max';
};

type PageProps = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    ppcontinue: string;
  };
  query: {
    pages: {
      ns: number;
      pageid: number;
      pageprops: Record<string, string>;
      title: string;
    }[];
  };
};

type PagePropsRequest = {
  /**
    * When more results are available, use this to continue.
    */
  ppcontinue?: string;

  /**
    * Only list these page properties (action=query&list=pagepropnames returns page property names in use). Useful for checking whether pages use a certain page property.
    */
  ppprop?: string | string[];

  titles: string | string[];
};

type PagesWithProp = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    pwpcontinue: string;
  };
  query: {
    pageswithprop: {
      ns: number;
      pageid: number;
      title: string;
      value: string;
    }[];
  };
};

type PagesWithPropRequest = {
  /**
    * When more results are available, use this to continue.
    */
  pwpcontinue?: string;

  /**
    * In which direction to sort.
    * @default 'ascending'
    */
  pwpdir?: 'ascending' | 'descending';

  /**
    * The maximum number of pages to return.
    */
  pwplimit?: number | 'max';

  /**
    * What pieces of information to include.
    */
  pwpprop?: Prop<'ids' | 'title' | 'value'>;

  /**
    * Page prop for which to enumerate pages.
    */
  pwppropname?: string;
};

type PrefixSearch = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    psoffset: number;
  };
  query: {
    prefixsearch: {
      ns: number;
      pageid: number;
      title: string;
    }[];
  };
};

type PrefixSearchRequest = {
  /**
    * Search string.
    */
  pssearch: string;

  /**
    * Namespaces to search. Ignored if pssearch begins with a valid namespace prefix.
    */
  psnamespace?: number | number[] | '*';

  /**
    * Maximum number of results to return.
    */
  pslimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  psoffset?: string;

  /**
    * Search profile to use.
    */
  psprofile?: 'strict' | 'normal' | 'normal-subphrases' | 'fuzzy' | 'fast-fuzzy' | 'fuzzy-subphrases' | 'classic' | 'engine_autoselect';
};

type Prop<T> = T | T[];

type ProtectedTitles = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    ptcontinue: string;
  };
  query: {
    protectedtitles: {
      comment: string;
      expiry: string;
      level: string;
      ns: number;
      parsedcomment: string;
      timestamp: string;
      title: string;
      user: string;
      userid: number;
    }[];
  };
};

type ProtectedTitlesRequest = {
  /**
    * Only list titles in these namespaces.
    */
  ptnamespace?: number | number[] | '*';

  /**
    * Only list titles with these protection levels.
    */
  ptlevel?: Prop<'autoconfirmed' | 'sysop'>;

  /**
    * How many total pages to return.
    */
  ptlimit?: number | 'max';

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  ptdir?: 'older' | 'newer';

  /**
    * Start listing at this protection timestamp.
    */
  ptstart?: Date | string;

  /**
    * Stop listing at this protection timestamp.
    */
  ptend?: Date | string;

  /**
    * Which properties to get:
    */
  ptprop?: Prop<
    'timestamp'
    | 'user'
    | 'userid'
    | 'comment'
    | 'parsedcomment'
    | 'expiry'
    | 'level'
  >;

  /**
    * When more results are available, use this to continue.
    */
  ptcontinue?: string;
};

type QueryPage = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    qpoffset: number;
  };
  query: {
    querypage: {
      cached: boolean;
      cachedtimestamp: string;
      maxresults: number;
      name: string;
      results: {
        ns: number;
        title: string;
        value: string;
      }[];
    }[];
  };
};

type QueryPageRequest = {
  /**
    * The name of the special page. Note, this is case-sensitive.
    */
  qppage: 'Ancientpages'
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
    | 'Withoutinterwiki';

  /**
      * When more results are available, use this to continue.
      */
  qpoffset?: number;

  /**
    * Number of results to return.
    */
  qplimit?: number | 'max';
};

type Random = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    rncontinue: string;
  };
  query: {
    random: {
      id: number;
      ns: number;
      title: string;
    }[];
  };
};

type RandomRequest = {
  /**
    * Return pages in these namespaces only.
    */
  rnnamespace?: number | number[] | '*';

  /**
    * How to filter for redirects.
    * @default 'nonredirects'
    */
  rnfilterredir?: 'all' | 'nonredirects' | 'redirects';

  /**
    * Limit to pages with at least this many bytes.
    */
  rnminsize?: number;

  /**
    * Limit to pages with at most this many bytes.
    */
  rnmaxsize?: number;

  /**
    * Filter pages that have the specified content model.
    */
  rncontentmodel?: 'GadgetDefinition'
    | 'Graph.JsonConfig'
    | 'Json.JsonConfig'
    | 'JsonSchema'
    | 'MassMessageListContent'
    | 'NewsletterContent'
    | 'Scribunto'
    | 'SecurePoll'
    | 'css'
    | 'flow-board'
    | 'javascript'
    | 'json'
    | 'sanitizedd-css'
    | 'text'
    | 'translate-messagebundle'
    | 'unknown'
    | 'vue'
    | 'wikitext';

  /**
      * Limit how many random pages will be returned.
      */
  rnlimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  rncontinue?: string;
};

type RecentChanges = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    rccontinue: string;
  };
  query: {
    recentchanges: {
      autopatrolled: boolean;
      bot: boolean;
      comment: string;
      minor: boolean;
      new: boolean;
      newlen: number;
      ns: number;
      old_revid: number;
      oldlen: number;
      pageid: number;
      parsedcomment: string;
      patrolled: boolean;
      rcid: number;
      redirect: boolean;
      revid: number;
      sha1: string;
      tags: string[];
      timestamp: string;
      title: string;
      type: string;
      unpatrolled: boolean;
      user: string;
      userid: number;
    }[];
  };
};

type RecentChangesRequest = {
  /**
    * The timestamp to start enumerating from.
    */
  rcstart?: Date | string;

  /**
    * The timestamp to end enumerating.
    */
  rcend?: Date | string;

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  rcdir?: 'older' | 'newer';

  /**
    * Filter changes to only these namespaces.
    */
  rcnamespace?: number | number[] | '*';

  /**
    * Only list changes by this user.
    */
  rcuser?: string;

  /**
    * Don't list changes by this user.
    */
  rcexcludeuser?: string;

  /**
    * Only list changes tagged with this tag.
    */
  rctag?: string;

  /**
    * Include additional pieces of information:
    */
  rcprop?: Prop<
    'user'
    | 'userid'
    | 'comment'
    | 'parsedcomment'
    | 'flags'
    | 'timestamp'
    | 'title'
    | 'ids'
    | 'sizes'
    | 'redirect'
    | 'patrolled'
    | 'loginfo'
    | 'tags'
    | 'sha1'
  >;

  /**
    * Show only items that meet these criteria. For example, to see only minor edits done by logged-in users, set rcshow=minor|!anon.
    */
  rcshow?: Prop<'!anon' | '!autopatrolled' | '!bot' | '!minor' | '!patrolled' | '!redirect'
    | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolled' | 'redirect'>;

  /**
      * How many total changes to return.
      */
  rclimit?: number | 'max';

  /**
    * Which types of changes to show.
    */
  rctype?: 'categorize' | 'edit' | 'external' | 'log' | 'new';

  /**
    * Only list changes which are the latest revision.
    */
  rctoponly?: boolean;

  /**
    * Filter entries to those related to a page.
    */
  rctitle?: string;

  /**
    * When more results are available, use this to continue.
    */
  rccontinue?: string;

  /**
    * When being used as a generator, generate revision IDs rather than titles.
    * Recent change entries without associated revision IDs (e.g. most log entries) will generate nothing.
    */
  rcgeneraterevisions?: boolean;

  /**
    * Only list changes that touch the named slot.
    */
  rcslot?: string;
};

type Redirects = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    rdcontinue: string;
  };
  query: {
    pages: {
      ns: number;
      pageid: number;
      redirects: {
        fragment: string;
        ns: number;
        pageid: number;
        title: string;
      }[];
      title: string;
    }[];
  };
};

type RedirectsRequest = {
  /**
    * Which properties to get:
    */
  rdprop?: Prop<'pageid' | 'title' | 'fragment'>;

  /**
    * Only include pages in these namespaces.
    */
  rdnamespace?: number | number[] | '*';

  /**
    * Show only items that meet these criteria:
    */
  rdshow?: Prop<'!fragment' | 'fragment'>;

  /**
    * How many redirects to return.
    */
  rdlimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  rdcontinue?: string;

  titles: string | string[];
};

type Revisions = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    rvcontinue: string;
  };
  query: {
    pages: {
      ns: number;
      pageid: number;
      revisions: [{
        minor: boolean;
        parentid: number;
        revid: number;
        roles: string[];
        sha1: string;
        size: number;
        slots: {
          comment: string;
          main: {
            content: string;
            contentformat: string;
            contentmodel: string;
            sha1: string;
            size: number;
          };
          parsedcomment: string;
          tags: string[];
        };
        timestamp: string;
        user: string;
        userid: number;
      }];
      title: string;
    }[];
  };
};

type RevisionsRequest = {
  /**
    * Which properties to get for each revision:
    */
  rvprop?: Prop<
    'ids'
    | 'flags'
    | 'timestamp'
    | 'user'
    | 'userid'
    | 'size'
    | 'slotsize'
    | 'sha1'
    | 'slotsha1'
    | 'contentmodel'
    | 'comment'
    | 'parsedcomment'
    | 'content'
    | 'tags'
    | 'roles'
  >;

  /**
    * Which revision slots to return data for, when slot-related properties are included in rvprops. If omitted, data from the main slot will be returned in a backwards-compatible format.
    */
  rvslots?: 'main';

  /**
    * Limit how many revisions will be returned. If rvprop=content, rvprop=parsetree, rvdiffto or rvdifftotext is used, the limit is 50. If rvparse is used, the limit is 1.
    */
  rvlimit?: number | 'max';

  /**
    * Only retrieve the content of the section with this identifier.
    */
  rvsection?: string;

  /**
    * Start enumeration from the timestamp of the revision with this ID. The revision must exist, but need not belong to this page.
    */
  rvstartid?: number;

  /**
    * Stop enumeration at the timestamp of the revision with this ID. The revision must exist, but need not belong to this page.
    */
  rvendid?: number;

  /**
    * From which revision timestamp to start enumeration.
    */
  rvstart?: Date | string;

  /**
    * Enumerate up to this timestamp.
    */
  rvend?: Date | string;

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  rvdir?: 'newer' | 'older';

  /**
    * Only include revisions made by user.
    */
  rvuser?: string;

  /**
    * Exclude revisions made by user.
    */
  rvexcludeuser?: string;

  /**
    * Only list revisions tagged with this tag.
    */
  rvtag?: string;

  /**
    * When more results are available, use this to continue.
    */
  rvcontinue?: string;

  titles: string | string[];
};

type Search = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    srcontinue: string;
  };
  query: {
    search: {
      categorysnippet: string;
      isfilematch: boolean;
      ns: number;
      pageid: number;
      size: number;
      snippet: string;
      timestamp: string;
      title: string;
      titlesnippet: string;
      wordcount: number;
    }[];
    searchinfo: {
      totalhits: number;
    };
  };
};

type SearchRequest = {
  /**
    * Search for page titles or content matching this value.
    * You can use the search string to invoke special search features, depending on what the wiki's search backend implements.
    */
  srsearch: string;

  /**
    * Search only within these namespaces.
    */
  srnamespace?: number | number[] | '*';

  /**
    * How many total pages to return.
    */
  srlimit?: number | 'max';

  /**
    * When more results are available, use this to continue. More detailed information on how to continue queries can be found on mediawiki.org.
    */
  sroffset?: number;

  /**
    * Query independent profile to use (affects ranking algorithm).
    */
  srqiprofile?: 'classic'
    | 'classic_noboostlinks'
    | 'empty'
    | 'wsum_inclinks'
    | 'wsum_inclinks_pv'
    | 'popular_inclinks_pv'
    | 'popular_inclinks'
    | 'engine_autoselect';

  /**
      * Which type of search to perform.
      */
  srwhat?: 'nearmatch' | 'text' | 'title';

  /**
    * Which metadata to return.
    */
  srinfo?: Prop<'rewrittenquery' | 'suggestion' | 'totalhits'>;

  /**
    * Which properties to return:
    */
  srprop?: Prop<
    'size'
    | 'wordcount'
    | 'timestamp'
    | 'snippet'
    | 'titlesnippet'
    | 'redirecttitle'
    | 'redirectsnippet'
    | 'sectiontitle'
    | 'sectionsnippet'
    | 'isfilematch'
    | 'categorysnippet'
    | 'extensiondata'
  >;

  /**
    * Include interwiki results in the search, if available.
    */
  srinterwiki?: boolean;

  /**
    * Enable internal query rewriting. Some search backends can rewrite the query into another which is thought to provide better results, for instance by correcting spelling errors.
    */
  srenablerewrites?: boolean;

  /**
    * Set the sort order of returned results.
    * @default 'relevance'
    */
  srsort?: 'create_timestamp_asc'
    | 'create_timestamp_desc'
    | 'incoming_links_asc'
    | 'incoming_links_desc'
    | 'just_match'
    | 'last_edit_asc'
    | 'last_edit_desc'
    | 'none'
    | 'random'
    | 'relevance'
    | 'user_random';
};

type SiteInfo = {
  query: {
    autocreatetempuser: {
      enabled: boolean;
    };
    clientlibraries: {
      name: string;
      version: string;
    }[];
    dbrepllag: {
      host: string;
      lag: number;
    }[];
    defaultoptions: Record<string, string>;
    extensions: {
      author: string;
      descriptionmsg: string;
      license: string;
      'license-name': string;
      name: string;
      url: string;
      type: string;
      'vcs-date': string;
      'vcs-url': string;
      'vcs-system': string;
    }[];
    extensiontags: string[];
    fileextensions: {
      ext: string;
    }[];
    functionhooks: string[];
    general: {
      articlepath: string;
      allcentralidlookupproviders: string[];
      allunicodefixes: boolean;
      base: string;
      case: string;
      categorycollation: string;
      centralidlookupprovider: string;
      citeresponsivereferences: boolean;
      dbtype: string;
      dbversion: string;
      extensiondistributor: {
        list: string;
        snapshots: string[];
      };
      externallinktarget: boolean;
      fallback: unknown[];
      fallback8bitEncoding: string;
      favicon: string;
      fixarabicunicode: boolean;
      fixmalayalamunicode: boolean;
      galleryoptions: {
        captionLength: boolean;
        imageHeight: number;
        imagesPerRow: number;
        imageWidth: number;
        mode: string;
        showBytes: boolean;
        showDimensions: boolean;
      };
      generator: string;
      'git-hash': string;
      'git-branch': string;
      imagelimits: {
        height: number;
        width: number;
      }[];
      imagewhitelistenabled: boolean;
      interwikimagic: boolean;
      invalidusernamechars: string;
      lang: string;
      langconversion: boolean;
      legaltitlechars: string;
      linkconversion: boolean;
      linkprefix: string;
      linkprefixcharset: string;
      linktrail: string;
      linter: {
        high: string[];
        medium: string[];
        low: string[];
      };
      logo: string;
      magiclinks: Record<string, boolean>;
      mainpage: string;
      mainpageisdomainroot: boolean;
      maxarticlesize: number;
      maxuploadsize: number;
      'max-page-id': number;
      minuploadchunksize: number;
      misermode: boolean;
      mobileserver: string;
      nofollowexceptions: unknown[];
      nofollowlinks: boolean;
      nofollowdomainexceptions: string[];
      phpsapi: string;
      phpversion: string;
      readonly: boolean;
      rtl: boolean;
      script: string;
      scriptpath: string;
      server: string;
      servername: string;
      sitename: string;
      thumblimits: number[];
      time: string;
      timeoffset: number;
      timezone: string;
      titleconversion: boolean;
      uploadsenabled: boolean;
      variantarticlepath: boolean;
      wikiid: string;
      writeapi: boolean;
    };
    interwikimap: {
      local?: boolean;
      prefix: string;
      protorel: boolean;
      url: string;
    }[];
    languages: {
      bcp47: string;
      code: string;
      name: string;
    }[];
    libraries: {
      name: string;
      version: string;
    }[];
    magicwords: {
      aliases: string[];
      'case-sensitive': boolean;
      name: string;
    }[];
    namespacealiases: {
      alias: string;
      id: number;
    }[];
    namespaces: {
      case: string;
      canonical?: boolean;
      content: boolean;
      id: number;
      name: string;
      nonincludable: boolean;
      subpages: boolean;
    }[];
    protocols: string[];
    restrictions: {
      cascadinglevels: string[];
      levels: string[];
      semiprotectedlevels: string[];
      types: string[];
    };
    rightsinfo: {
      text: string;
      url: string;
    };
    showhooks: {
      name: string;
      subscribers: string[];
    }[];
    skins: {
      code: string;
      default?: boolean;
      name: string;
      unusable?: boolean;
    }[];
    specialpagealiases: {
      aliases: string[];
      realname: string;
    }[];
    statistics: {
      activeusers: number;
      admins: number;
      articles: number;
      edits: number;
      images: number;
      jobs: number;
      pages: number;
      users: number;
    }[];
    usergroups: {
      name: string;
      rights: string[];
    }[];
    variables: string[];
  };
};

type SiteInfoRequest = {
  /**
      * Return only local or only nonlocal entries of the interwiki map.
      */
  sifilteriw: 'local' | '!local';

  /**
      * Language code for localised language names (best effort) and skin names.
      */
  siinlanguagecode: string;

  /**
      * Lists the number of users in user groups.
      */
  sinumberingroup: boolean;

  /**
      * Which information to get.
      */
  siprop: Prop<
      'general'
      | 'namespaces'
      | 'namespacealiases'
      | 'specialpagealiases'
      | 'magicwords'
      | 'interwikimap'
      | 'dbrepllag'
      | 'statistics'
      | 'usergroups'
      | 'autocreatetempuser'
      | 'clientlibraries'
      | 'libraries'
      | 'extensions'
      | 'fileextensions'
      | 'rightsinfo'
      | 'restrictions'
      | 'languages'
      | 'languagevariants'
      | 'skins'
      | 'extensiontags'
      | 'functionhooks'
      | 'showhooks'
      | 'variables'
      | 'protocols'
      | 'defaultoptions'
      | 'uploaddialog'
      | 'autopromote'
      | 'autopromoteonce'
      | 'copyuploaddomains'
  >;

  /**
      * List all database servers, not just the one lagging the most.
      */
  sishowalldb: boolean;
};

type Tags = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    tgcontinue: string;
  };
  query: {
    tags: {
      active: boolean;
      defined: boolean;
      description: string;
      displayname: string;
      hitcount: number;
      name: string;
      source: string[];
    }[];
  };
};

type TagsRequest = {
  /**
    * When more results are available, use this to continue.
    */
  tgcontinue?: string;

  /**
    * The maximum number of tags to list.
    */
  tglimit?: number | 'max';

  /**
    * Which properties to get:
    */
  tgprop?: Prop<'displayname' | 'description' | 'hitcount' | 'defined' | 'source' | 'active'>;
};

type Templates = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    tlcontinue: string;
  };
  query: {
    pages: {
      ns: number;
      pageid: number;
      templates: {
        ns: number;
        title: string;
      }[];
      title: string;
    }[];
  };
};

type TemplatesRequest = {
  /**
    * Show templates in these namespaces only.
    */
  tlnamespace?: number | number[] | '*';

  /**
    * How many templates to return.
    */
  tllimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  tlcontinue?: string;

  /**
    * Only list these templates. Useful for checking whether a certain page uses a certain template.
    */
  tltemplates?: string | string[];

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  tldir?: 'ascending' | 'descending';

  titles: string | string[];
};

type TokenType = 'createaccount'
  | 'csrf'
  | 'deleteglobalaccount'
  | 'login'
  | 'patrol'
  | 'rollback'
  | 'setglobalaccountstatus'
  | 'userrights'
  | 'watch';

type TranscludedIn = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    ticontinue: string;
  };
  query: {
    pages: {
      ns: number;
      pageid: number;
      title: string;
      transcludedin: {
        ns: number;
        pageid: number;
        redirect: boolean;
        title: string;
      }[];
    }[];
  };
};

type TranscludedInRequest = {
  /**
    * Which properties to get:
    */
  tiprop?: Prop<'pageid' | 'title' | 'redirect'>;

  /**
    * Only include pages in these namespaces.
    */
  tinamespace?: number | number[] | '*';

  /**
    * Show only items that meet these criteria:
    */
  tishow?: Prop<'!redirect' | 'redirect'>;

  /**
    * How many to return.
    */
  tilimit?: number | 'max';

  /**
    * When more results are available, use this to continue.
    */
  ticontinue?: string;

  titles: string | string[];
};

type Upload = {
  upload: {
    filename: string;
    result: string;
  };
};

type UploadRequest = {
  /**
    * Target filename.
    */
  filename?: string;

  /**
    * Upload comment. Also used as the initial page text for new files if text is not specified.
    */
  comment?: string;

  /**
    * Change tags to apply to the upload log entry and file page revision.
    */
  tags?: string | string[];

  /**
    * Initial page text for new files.
    */
  text?: string;

  /**
    * Unconditionally add or remove the page from the current user's watchlist, use preferences (ignored for bot users) or do not change watch.
    * @default 'preferences'
    */
  watchlist?: 'nochange' | 'preferences' | 'watch';

  /**
    * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
    */
  watchlistexpiry?: Date | string;

  /**
    * Ignore any warnings.
    */
  ignorewarnings?: boolean;

  /**
    * File contents.
    */
  file?: import('fs').ReadStream;

  /**
    * URL to fetch the file from.
    */
  url?: string;

  /**
    * Key that identifies a previous upload that was stashed temporarily.
    */
  filekey?: string;

  /**
    * If set, the server will stash the file temporarily instead of adding it to the repository.
    */
  stash?: boolean;

  /**
    * Filesize of entire upload.
    */
  filesize?: number;

  /**
    * Offset of chunk in bytes.
    */
  offset?: number;

  /**
    * Chunk contents.
    */
  chunk?: import('fs').ReadStream;

  /**
    * Make potentially large file operations asynchronous when possible.
    */
  async?: boolean;

  /**
    * Only fetch the upload status for the given file key.
    */
  checkstatus?: boolean;
};

type Unblock = {
  unblock: {
    id: number;
    reason: string;
    user: string;
    userid: number;
  };
};

type UnblockRequest = {
  /**
    * ID of the block to unblock (obtained through list=blocks). Cannot be used together with user.
    */
  id?: number;

  /**
    * User to unblock. Cannot be used together with id.
    */
  user?: string;

  /**
    * Reason for unblock.
    */
  reason?: string;

  /**
    * Change tags to apply to the entry in the block log.
    */
  tags?: string | string[];

  /**
    * Watch the user's or IP address's user and talk pages.
    */
  watchuser?: boolean;

  /**
    * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
    */
  watchlistexpiry?: Date | string;
};

type UserContribs = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    uccontinue: string;
  };
  query: {
    usercontribs: {
      autopatrolled: boolean;
      comment: string;
      minor: boolean;
      new: boolean;
      ns: number;
      pageid: number;
      parentid: number;
      parsedcomment: string;
      patrolled: boolean;
      revid: number;
      size: number;
      sizediff: number;
      tags: string[];
      timestamp: string;
      title: string;
      top: boolean;
      user: string;
      userid: number;
    }[];
  };
};

type UserContribsRequest = {
  /**
    * The maximum number of contributions to return.
    */
  uclimit?: number | 'max';

  /**
    * The start timestamp to return from, i.e. revisions before this timestamp.
    */
  ucstart?: Date | string;

  /**
    * The end timestamp to return to, i.e. revisions after this timestamp.
    */
  ucend?: Date | string;

  /**
    * When more results are available, use this to continue.
    */
  uccontinue?: string;

  /**
    * The users to retrieve contributions for. Cannot be used with ucuserids, ucuserprefix, or uciprange.
    */
  ucuser?: string | string[];

  /**
    * The user IDs to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or uciprange.
    */
  ucuserids?: number | number[];

  /**
    * Retrieve contributions for all users whose names begin with this value. Cannot be used with ucuser, ucuserids, or uciprange.
    */
  ucuserprefix?: string;

  /**
    * The CIDR range to retrieve contributions for. Cannot be used with ucuser, ucuserprefix, or ucuserids.
    */
  uciprange?: string;

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  ucdir?: 'newer' | 'older';

  /**
    * Only list contributions in these namespaces.
    */
  ucnamespace?: number | number[] | '*';

  /**
    * Include additional pieces of information:
    */
  ucprop?: Prop<
    'ids'
    | 'title'
    | 'timestamp'
    | 'comment'
    | 'parsedcomment'
    | 'size'
    | 'sizediff'
    | 'flags'
    | 'patrolled'
    | 'tags'
  >;

  /**
    * Show only items that meet these criteria, e.g. non minor edits only: ucshow=!minor.
    * If ucshow=patrolled or ucshow=!patrolled is set, revisions older than $wgRCMaxAge (2592000 seconds) won't be shown.
    */
  ucshow?: Prop<'!autopatrolled' | '!minor' | '!new' | '!patrolled' | '!top'
    | 'autopatrolled' | 'minor' | 'new' | 'patrolled' | 'top'>;

  /**
      * Only list revisions tagged with this tag.
      */
  uctag?: string;
};

type UserInfo = {
  query: {
    userinfo: {
      acceptlang: {
        code: string;
        q: number;
      }[];
      cancreateaccount: boolean;
      centralids: Record<string, number>;
      editcount: number;
      email: string;
      emailauthenticated: string;
      groupmemberships: {
        expiry: string;
        group: string;
      }[];
      groups: string[];
      id: number;
      implicitgroups: string[];
      latestcontrib: string;
      messages: boolean;
      name: string;
      options: Record<string, unknown>;
      ratelimits: Record<string, Record<string, {
        hits: number;
        seconds: number;
      }>>;
      registrationate: string;
      theoreticalratelimits: Record<string, Record<string, {
        hits: number;
        seconds: number;
      }>>;
      unreadcount: number;
    };
  };
};

type UserInfoRequest = {
  uiprop: Prop<
      'blockinfo'
      | 'hasmsg'
      | 'groups'
      | 'groupmemberships'
      | 'implicitgroups'
      | 'rights'
      | 'changeablegroups'
      | 'options'
      | 'editcount'
      | 'ratelimits'
      | 'theoreticalratelimits'
      | 'email'
      | 'realname'
      | 'acceptlang'
      | 'registrationdate'
      | 'unreadcount'
      | 'centralids'
      | 'latestcontrib'
      | 'cancreateaccount'
  >;
};

type UserRights = {
  userrights: {
    added: string[];
    removed: string[];
    user: string;
    userid: number;
  };
};

type UserRightsRequest = {
  /**
    * User.
    */
  user?: string;

  /**
    * Add the user to these groups, or if they are already a member, update the expiry of their membership in that group.
    */
  add?: string | string[];

  /**
    * Expiry timestamps. May be relative (e.g. 5 months or 2 weeks) or absolute (e.g. 2014-09-18T12:34:56Z). If only one timestamp is set, it will be used for all groups passed to the add parameter. Use infinite, indefinite, infinity, or never for a never-expiring user group.
    */
  expiry?: Prop<Date | string>;

  /**
    * Remove the user from these groups.
    */
  remove?: string | string[];

  /**
    * Reason for the change.
    */
  reason?: string;

  /**
    * Change tags to apply to the entry in the user rights log.
    */
  tags?: string | string[];

  /**
    * Watch the user's user and talk pages.
    */
  watchuser?: boolean;

  /**
    * Watchlist expiry timestamp. Omit this parameter entirely to leave the current expiry unchanged.
    */
  watchlistexpiry?: Date | string;
};

type Users = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    uscontinue: string;
  };
  query: {
    users: {
      attachedlocal: Record<string, boolean>;
      blockanononly: boolean;
      blockedby: string;
      blockedbyid: number;
      blockedtimestamp: string;
      blockedtimestampformatted: string;
      blockemail: boolean;
      blockexpiry: string;
      blockexpiryformatted: boolean;
      blockexpiryrelative: string;
      blockid: number;
      blocknocreate: boolean;
      blockowntalk: boolean;
      blockpartial: boolean;
      blockreason: string;
      cancreate: boolean;
      cancreateerror: {
        coded: string;
        message: string;
        params: unknown[];
        type: string;
      }[];
      centralids: Record<string, number>;
      editcount: number;
      emailable: boolean;
      gender: string;
      groupmemberships: string[];
      groups: string[];
      implicitgroups: string[];
      invalid: boolean;
      missing: boolean;
      name: string;
      registration: string;
      rights: string[];
      userid: number;
    }[];
  };
};

type UsersRequest = {
  /**
    * Which pieces of information to include:
    */
  usprop?: Prop<
    'blockinfo'
    | 'groups'
    | 'groupmemberships'
    | 'implicitgroups'
    | 'rights'
    | 'editcount'
    | 'registration'
    | 'emailable'
    | 'gender'
    | 'centralids'
    | 'cancreate'
  >;

  /**
      * With usprop=centralids, indicate whether the user is attached with the wiki identified by this ID.
      */
  usattachedwiki?: string;

  /**
    * A list of users to obtain information for.
    */
  ususers?: string | string[];

  /**
    * A list of user IDs to obtain information for.
    */
  ususerids?: number | number[];
};

type Watchlist = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    wlcontinue: string;
  };
  query: {
    watchlist: {
      anon: boolean;
      autopatrolled: boolean;
      bot: boolean;
      comment: string;
      expiry: boolean;
      minor: boolaen;
      new: boolean;
      newlen: number;
      notificationtimestamp: string;
      ns: number;
      old_revid: number;
      oldlen: number;
      pageid: number;
      parsedcomment: string;
      patrolled: boolean;
      revid: number;
      tags: string[];
      temp: boolean;
      timestamp: string;
      title: string;
      type: string;
      unpatrolled: boolean;
      user: string;
      userid: number;
    }[];
  };
};

type WatchlistRequest = {
  /**
    * Include multiple revisions of the same page within given timeframe.
    */
  wlallrev?: boolean;

  /**
    * The timestamp to start enumerating from.
    */
  wlstart?: Date | string;

  /**
    * The timestamp to end enumerating.
    */
  wlend?: Date | string;

  /**
    * Filter changes to only the given namespaces.
    */
  wlnamespace?: number | number[] | '*';

  /**
    * Only list changes by this user.
    */
  wluser?: string;

  /**
    * Don't list changes by this user.
    */
  wlexcludeuser?: string;

  /**
    * In which direction to enumerate:
    * @default 'older'
    */
  wldir?: 'newer' | 'older';

  /**
    * How many total results to return per request.
    */
  wllimit?: number | 'max';

  /**
    * Which additional properties to get:
    */
  wlprop?: Prop<
    'title'
    | 'ids'
    | 'flags'
    | 'user'
    | 'userid'
    | 'comment'
    | 'parsedcomment'
    | 'timestamp'
    | 'patrol'
    | 'sizes'
    | 'notificationtimestamp'
    | 'loginfo'
    | 'tags'
    | 'expiry'
  >;

  /**
    * Show only items that meet these criteria. For example, to see only minor edits done by logged-in users, set wlshow=minor|!anon.
    */
  wlshow?: Prop<'!anon' | '!autopatrolled' | '!bot' | '!minor' | '!patrolled' | '!unread'
    | 'anon' | 'autopatrolled' | 'bot' | 'minor' | 'patrolledd' | 'unread'>;

  /**
    * Which types of changes to show:
    */
  wltype?: Prop<'edit' | 'new' | 'log' | 'external' | 'categorize'>;

  /**
    * Used along with wltoken to access a different user's watchlist.
    */
  wlowner?: string;

  /**
    * A security token (available in the user's preferences) to allow access to another user's watchlist.
    */
  wltoken?: string;

  /**
    * When more results are available, use this to continue.
    */
  wlcontinue?: string;
};

type WatchlistRaw = {
  batchcomplete: boolean;
  continue?: {
    continue: string;
    wrcontinue: string;
  };
  watchlistraw: {
    changed: string;
    ns: number;
    title: string;
  }[];
};

type WatchlistRawRequest = {
  /**
    * When more results are available, use this to continue.
    */
  wrcontinue?: string;

  /**
    * Only list pages in the given namespaces.
    */
  wrnamespace?: number | number[] | '*';

  /**
    * How many total results to return per request.
    */
  wrlimit?: number | 'max';

  /**
    * Which additional properties to get:
    */
  wrprop?: Prop<'changed'>;

  /**
    * Only list items that meet these criteria.
    */
  wrshow?: Prop<'!changed' | 'changed'>;

  /**
    * Used along with wrtoken to access a different user's watchlist.
    */
  wrowner?: string;

  /**
    * A security token (available in the user's preferences) to allow access to another user's watchlist.
    */
  wrtoken?: string;

  /**
    * The direction in which to list.
    * @default 'ascending'
    */
  wrdir?: 'ascending' | 'descending';

  /**
    * Title (with namespace prefix) to begin enumerating from.
    */
  wrfromtitle?: string;

  /**
    * Title (with namespace prefix) to stop enumerating at.
    */
  wrtotitle?: string;

};

type AllQueries = 'allpages'
  | 'allcategories'
  | 'alldeletedrevisions'
  | 'allfileusages'
  | 'allimages'
  | 'alllinks'
  | 'allpages'
  | 'allredirects'
  | 'allrevisions'
  | 'alltransclusions'
  | 'backlinks'
  | 'categorymembers'
  | 'embeddedin'
  | 'exturlusage'
  | 'imageusage'
  | 'iwbacklinks'
  | 'langbacklinks'
  | 'pageswithprop'
  | 'prefixsearch'
  | 'protectedtitles'
  | 'querypage'
  | 'random'
  | 'recentchanges'
  | 'search';

type PrefixGenerator<T> = {
  [key in keyof T as `g${key}`]: T[key]
};

type AllProps = 'categories'
  | 'categoryinfo'
  | 'contributors'
  | 'deletedrevisions'
  | 'duplicatefiles'
  | 'extlinks'
  | 'fileusage'
  | 'globalusage'
  | 'imageinfo'
  | 'images'
  | 'info'
  | 'iwlinks'
  | 'langlinks'
  | 'links'
  | 'linkshere'
  | 'pageprops'
  | 'redirects'
  | 'revisions'
  | 'templates'
  | 'transcludedin'
  | 'transcodestatus'
  | 'videoinfo'
  | 'wbentityusage';

type PropsRequestMap = {
  categories: CategoriesRequest;
  categoryinfo: CategoryInfoRequest;
  contributors: ContributorsRequest;
  deletedrevisions: DeletedRevisionsRequest;
  duplicatefiles: DuplicateFilesRequest;
  extlinks: ExtLinksRequest;
  fileusage: FileUsageRequest;
  globalusage: GlobalUsageRequest;
  imageinfo: ImageInfoRequest;
  images: ImagesRequest;
  info: InfoRequest;
  iwlinks: IwLinksRequest;
  langlinks: LangLinksRequest;
  links: LinksRequest;
  linkshere: LinksHereRequest;
  pageprops: PagePropsRequest;
  redirects: RedirectsRequest;
  revisions: RevisionsRequest;
  templates: TemplatesRequest;
  transcludedin: TranscludedInRequest;
};

type PropsResultMap = {
  categories: { categories: Categories['query']['pages'][number]['categories'] };
  categoryinfo: { categoryinfo: CategoryInfo['query']['pages'][number]['categoryinfo'] };
  contributors: { contributors: Contributors['query']['pages'][number]['contributors'] };
  deletedrevisions: { deletedrevisions: DeletedRevisions['query']['pages'][number]['deletedrevisions'] };
  duplicatefiles: { duplicatefiles: DuplicateFiles['query']['pages'][number]['duplicatefiles'] };
  extlinks: { extlinks: ExtLinks['query']['pages'][number]['extlinks'] };
  fileusage: { fileusage: FileUsage['query']['pages'][number]['fileusage'] };
  globalusage: { globalusage: GlobalUsage['query']['pages'][number]['globalusage'] };
  imageinfo: { imageinfo: ImageInfo['query']['pages'][number]['imageinfo'] };
  images: { images: Images['query']['pages'][number]['images'] };
  info: { info: Info['query']['pages'][number]['info'] };
  iwlinks: { iwlinks: IwLinks['query']['pages'][number]['iwlinks'] };
  langlinks: { langlinks: LangLinks['query']['pages'][number]['langlinks'] };
  links: { links: Links['query']['pages'][number]['links'] };
  linkshere: { linkshere: LinksHere['query']['pages'][number]['linkshere'] };
  pageprops: { pageprops: PageProps['query']['pages'][number]['pageprops'] };
  redirects: { redirects: Redirects['query']['pages'][number]['redirects'] };
  revisions: {
    revisions: Array<Omit<Revisions['query']['pages'][number]['revisions'][number], 'slots'>
      & Revisions['query']['pages'][number]['revisions'][number]['slots']['main']>;
  };
  templates: { templates: Templates['query']['pages'][number]['templates'] };
  transcludedin: { transcludedin: TranscludedIn['query']['pages'][number]['transcludedin'] };
};

type PropsKeys<T> = T extends readonly (infer U)[] ? U : T;

type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends // eslint-disable-line @typescript-eslint/no-explicit-any
  (x: infer I) => void
    ? I
    : never;

type GeneratorRequestParams<T extends AllProps | readonly AllProps[]> =
  UnionToIntersection<
    PropsRequestMap[PropsKeys<T> & AllProps]
  >;

type GeneratorResultParams<T extends AllProps | readonly AllProps[]> =
  UnionToIntersection<
    PropsResultMap[PropsKeys<T> & AllProps]
  >;

type GeneratorRequest<T extends AllQueries, Props extends AllProps | readonly AllProps[]> = {
  [`${string}continue`]?: string;
  generator: T;
  pageids?: number | number[];
  prop: Props;
  revids?: number | number[];
  titles?: string | string[];
} & Omit<GeneratorRequestParams<Props>, 'titles'> & PrefixGenerator<
  T extends 'allpages' ? AllPagesRequest
    : T extends 'allcategories' ? AllCategories
      : T extends 'alldeletedrevisions' ? AllDeletedRevisionsRequest
        : T extends 'allfileusages' ? AllFileUsagesRequest
          : T extends 'allimages' ? AllImagesRequest
            : T extends 'alllinks' ? AllLinksRequest
              : T extends 'allpages' ? AllPagesRequest
                : T extends 'allredirects' ? AllRedirectsRequest
                  : T extends 'allrevisions' ? AllRevisionsRequest
                    : T extends 'alltransclusions' ? AllTransclusionsRequest
                      : T extends 'backlinks' ? BacklinksRequest
                        : T extends 'categorymembers' ? CategoryMembersRequest
                          : T extends 'embeddedin' ? EmbeddedInRequest
                            : T extends 'exturlusage' ? ExtUrlUsageRequest
                              : T extends 'imageusage' ? ImageUsageRequest
                                : T extends 'iwbacklinks' ? IwBacklinksRequest
                                  : T extends 'langbacklinks' ? LangBacklinksRequest
                                    : T extends 'pageswithprop' ? PagesWithPropRequest
                                      : T extends 'prefixsearch' ? PrefixSearchRequest
                                        : T extends 'protectedtitles' ? ProtectedTitlesRequest
                                          : T extends 'querypage' ? QueryPageRequest
                                            : T extends 'random' ? RandomRequest
                                              : T extends 'recentchanges' ? RecentChangesRequest
                                                : T extends 'search' ? SearchRequest
                                                  : {}>; // eslint-disable-line @typescript-eslint/no-empty-object-type

type GeneratorResult<Props extends AllProps | readonly AllProps[]> = {
  continue: Record<`${string}continue`, string>;
  query: {
    pages: Array<{
      ns: number;
      pageid: number;
      title: string;
    } & GeneratorResultParams<Props>>;
  };
};

