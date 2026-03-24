import { Client, type ClientOptions } from './client';

export class Wiki {
  public readonly client: Client;
  protected readonly cachedTokens: Record<string, string> = {};

  public constructor (url: string | URL, options?: ClientOptions) {
    this.client = new Client(url, options);
  }

  public async action<T = unknown>(params: Record<string, unknown>, options: Record<string, unknown> = {}): Promise<T> {
    const defaults: Record<string, unknown> = {
      format: 'json',
      formatversion: 2,
    };
    if (!options.token) {
      defaults.token = await this.csrfToken();
    }

    params = Object.assign(options, defaults, params);
    return await this.client.post<T>(params);
  }

  /**
    * Enumerate all categories.
    * @see https://www.mediawiki.org/wiki/API:Allcategories
    */
  public allcategories(params: AllCategoriesRequest) {
    return this.query<AllCategories>(params, { list: 'allcategories' });
  }

  /**
    * List all deleted revisions by a user or in a namespace.
    * @see https://www.mediawiki.org/wiki/API:Alldeletedrevisions
    */
  public alldeletedrevisions(params: AllDeletedRevisionsRequest) {
    return this.query<AllDeletedRevisions>(params, { list: 'alldeletedrevisions' });
  }

  /**
    * List all file usages, including non-existing.
    * @see https://www.mediawiki.org/wiki/API:Allfileusages
    */
  public allfileusages(params: AllFileUsagesRequest) {
    return this.query<AllFileUsages>(params, { list: 'allfileusages' });
  }

  /**
    * Enumerate all images sequentially.
    * @see https://www.mediawiki.org/wiki/API:Allimages
    */
  public allimages(params: AllImagesRequest) {
    return this.query<AllImages>(params, { list: 'allimages' });
  }

  /**
    * Enumerate all links that point to a given namespace.
    * @see https://www.mediawiki.org/wiki/API:Alllinks
    */
  public alllinks(params: AllLinksRequest) {
    return this.query<AllLinks>(params, { list: 'alllinks' });
  }

  /**
    * Returns messages from the site.
    * @see https://www.mediawiki.org/wiki/API:Allmessages
    */
  public async allmessages(params: AllMessagesRequest) {
    const result = await this.query<AllMessages>(params, { meta: 'allmessages' });

    return result.query.allmessages;
  }

  /**
    * Enumerate all pages sequentially in a given namespace.
    * @see https://www.mediawiki.org/wiki/API:Allpages
    */
  public allpages(params: AllPagesRequest) {
    return this.query<AllPages>(params, { list: 'allpages' });
  }

  /**
    * List all redirects to a namespace.
    * @see https://www.mediawiki.org/wiki/API:Allredirects
    */
  public allredirects(params: AllRedirectsRequest) {
    return this.query<AllRedirects>(params, { list: 'allredirects' });
  }

  /**
    * List all revisions.
    * @see https://www.mediawiki.org/wiki/API:Allrevisions
    */
  public allrevisions(params: AllRevisionsRequest) {
    return this.query<AllRevisions>(params, { list: 'allrevisions' });
  }

  /**
    * List all transclusions (pages embedded using `{{x}}`), including non-existing.
    * @see https://www.mediawiki.org/wiki/API:Alltransclusions
    */
  public alltransclusions(params: AllTransclusionsRequest) {
    return this.query<AllTransclusions>(params, { list: 'alltransclusions' });
  }

  /**
    * Enumerate all registered users.
    * @see https://www.mediawiki.org/wiki/API:Allusers
    */
  public allusers(params: AllUsersRequest) {
    return this.query<AllUsers>(params, { list: 'allusers' });
  }

  /**
    * Find all pages that link to the given page.
    * @see https://www.mediawiki.org/wiki/API:Backlinks
    */
  public backlinks(params: BacklinksRequest) {
    return this.query<Backlinks>(params, { list: 'backlinks' });
  }

  /**
    * Block a user.
    */
  public async block(params: BlockRequest) {
    const request = await this.action<Block>(params, { action: 'block' });
    return request.block;
  }

  /**
    * List all blocked users and IP addresses.
    * @see https://www.mediawiki.org/wiki/API:Blocks
    */
  public blocks(params: BlocksRequest) {
    return this.query<Blocks>(params, { list: 'blocks' });
  }

  /**
    * List all categories the pages belong to.
    * @see https://www.mediawiki.org/wiki/API:Categories
    */
  public categories(params: CategoriesRequest) {
    return this.query<Categories>(params, { prop: 'categories' });
  }

  /**
    * Returns information about the given categories.
    * @see https://www.mediawiki.org/wiki/API:Categoryinfo
    */
  public categoryinfo(params: CategoryInfoRequest) {
    return this.query<CategoryInfo>(params, { prop: 'categoryinfo' });
  }

  /**
    * List all pages in a given category.
    * @see https://www.mediawiki.org/wiki/API:Categorymembers
    */
  public categorymembers(params: CategoryMembersRequest) {
    return this.query<CategoryMembers>(params, { list: 'categorymembers' });
  }

  /**
    * Get the list of logged-in contributors (including temporary users) and the count of
    * logged-out contributors to a page.
    * @see https://www.mediawiki.org/wiki/API:Contributors
    */
  public contributors(params: ContributorsRequest) {
    return this.query<Contributors>(params, { prop: 'contributors' });
  }

  public async csrfToken(force = false): Promise<string> {
    const tokens = await this.tokens('csrf', force);
    return tokens.csrftoken!;
  }

  /**
    * Get deleted revision information.
    * @see https://www.mediawiki.org/wiki/API:Deletedrevisions
    */
  public deletedrevisions(params: DeletedRevisionsRequest) {
    return this.query<DeletedRevisions>(params, { prop: 'deletedrevisions' });
  }

  /**
    * List all files that are duplicates of the given files based on hash values.
    * @see https://www.mediawiki.org/wiki/API:Duplicatefiles
    */
  public duplicatefiles(params: DuplicateFilesRequest) {
    return this.query<DuplicateFiles>(params, { prop: 'duplicatefiles' });
  }

  /**
    * Create and edit pages.
    */
  public async edit(params: EditRequest) {
    const request = await this.action<Edit>(params, {
      action: 'edit',
      assert: params.bot ? 'bot' : 'user',
    });
    return request.edit;
  }

  /**
    * Find all pages that embed (transclude) the given title.
    * @see https://www.mediawiki.org/wiki/API:Embeddedin
    */
  public embeddedin(params: EmbeddedInRequest) {
    return this.query<EmbeddedIn>(params, { list: 'embeddedin' });
  }

  /**
    * Returns all external URLs (not interwikis) from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Extlinks
    */
  public extlinks(params: ExtLinksRequest) {
    return this.query<ExtLinks>(params, { prop: 'extlinks' });
  }

  /**
    * Enumerate pages that contain a given URL.
    * @see https://www.mediawiki.org/wiki/API:Exturlusage
    */
  public exturlusage(params: ExtUrlUsageRequest) {
    return this.query<ExtUrlUsage>(params, { list: 'exturlusage' });
  }

  /**
    * Enumerate all deleted files sequentially.
    * @see https://www.mediawiki.org/wiki/API:Filearchive
    */
  public filearchive(params: FileArchiveRequest) {
    return this.query<FileArchive>(params, { list: 'filearchive' });
  }

  /**
    * Return meta information about image repositories configured on the wiki.
    * @see https://www.mediawiki.org/wiki/API:Filerepoinfo
    */
  public async filerepoinfo(params: FileRepoInfoRequest) {
    const result = await this.query<FileRepoInfo>(params, { meta: 'filerepoinfo' });

    return result.query.repos;
  }

  /**
    * Find all pages that use the given files.
    * @see https://www.mediawiki.org/wiki/API:Fileusage
    */
  public fileusage(params: FileUsageRequest) {
    return this.query<FileUsage>(params, { prop: 'fileusage' });
  }

  /**
    * Get the list of pages to work on by executing the specified query module.
    * @see https://www.mediawiki.org/wiki/API:Query#Generators
    */
  public generate<T extends AllQueries, P extends AllProps>(params: GeneratorRequest<T, P>) {
    return this.query<GeneratorResult<P>>(params);
  }

  /**
    * Returns global image usage for a certain image.
    * @see https://www.mediawiki.org/wiki/API:Globalusage
    */
  public globalusage(params: GlobalUsageRequest) {
    return this.query<GlobalUsageRequest>(params, { prop: 'globalusage' });
  }

  /**
    * Returns file information and upload history.
    * @see https://www.mediawiki.org/wiki/API:Imageinfo
    */
  public imageinfo(params: ImageInfoRequest) {
    return this.query<ImageInfo>(params, { prop: 'imageinfo' });
  }

  /**
    * Return all files contained on the given pages.
    * @see https://www.mediawiki.org/wiki/API:Images
    */
  public images(params: ImagesRequest) {
    return this.query<Images>(params, { prop: 'images' });
  }

  /**
    * Find all pages that use the given image title.
    * @see https://www.mediawiki.org/wiki/API:Imageusage
    */
  public imageusage(params: ImageUsageRequest) {
    return this.query<ImageUsage>(params, { list: 'imageusage' });
  }

  /**
    * Get basic page information.
    * @see https://www.mediawiki.org/wiki/API:Info
    */
  public info(params: InfoRequest) {
    return this.query<Info>(params, { prop: 'info' });
  }

  /**
    * Find all pages that link to the given interwiki link.
    * Can be used to find all links with a prefix, or all links to a title (with a given prefix).
    * Using neither parameter is effectively "all interwiki links".
    * @see https://www.mediawiki.org/wiki/API:Iwbacklinks
    */
  public iwbacklinks(params: IwBacklinksRequest) {
    return this.query<IwBacklinks>(params, { list: 'iwbacklinks' });
  }

  /**
    * Returns all interwiki links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Iwlinks
    */
  public iwlinks(params: IwLinksRequest) {
    return this.query<IwLinks>(params, { prop: 'iwlinks' });
  }

  /**
    * Find all pages thast link to the given language link.
    * Can be used to find all links with a language code, or all links to a title (with a given language).
    * Using neither parameter is effectively "all language links".
    * @see https://www.mediawiki.org/wiki/API:Langbacklinks
    */
  public langbacklinks(params: LangBacklinksRequest) {
    return this.query<LangBacklinks>(params, { list: 'langbacklinks' });
  }

  /**
    * Returns all interlanguage links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Langlinks
    */
  public langlinks(params: LangLinksRequest) {
    return this.query<LangLinks>(params, { prop: 'langlinks' });
  }

  /**
    * Returns all links from the given pages.
    * @see https://www.mediawiki.org/wiki/API:Links
    */
  public links(params: LinksRequest) {
    return this.query<Links>(params, { prop: 'links' });
  }

  /**
    * Find all pages that link to the given pages.
    * @see https://www.mediawiki.org/wiki/API:Linkshere
    */
  public linkshere(params: LinksHereRequest) {
    return this.query<LinksHere>(params, { prop: 'linkshere' });
  }

  /**
    * Get events from logs.
    * @see https://www.mediawiki.org/wiki/API:Logevents
    */
  public logevents(params: LogEventsRequest) {
    return this.query<LogEvents>(params, { list: 'logevents' });
  }

  /**
    * Log in and get authentication tokens.
    *
    * This action should only be used in combination with Special:BotPasswords.
    *
    * This will modify your "Wiki" instance, and all next requests will be authenticated.
    * @see https://www.mediawiki.org/wiki/API:Login
    */
  public async login(username: string, password: string) {
    const tokens = await this.tokens('login');
    const params = {
      action: 'login',
      format: 'json',
      formatversion: '2',
      lgname: username,
      lgpassword: password,
      lgtoken: tokens.logintoken!,
    };

    const result = await this.client.post<{
      login: {
        lguserid: number;
        lgusername: string;
        result: string;
      };
    }>(params, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });
    return result.login;
  }

  /**
    * Log out and clear session data.
    */
  public async logout(): Promise<void> {
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
    * List all page property names in use on the wiki.
    * @see https://www.mediawiki.org/wiki/API:Pagepropnames
    */
  public pagepropnames(params: PagePropNamesRequest) {
    return this.query<PagePropNames>(params, { list: 'pagepropnames' });
  }

  /**
    * Get various page properties defined in the page content.
    * @see https://www.mediawiki.org/wiki/API:Pageprops
    */
  public pageprops(params: PagePropsRequest) {
    return this.query<PageProps>(params, { prop: 'pageprops' });
  }

  /**
    * List all pages using a given page property.
    * @see https://www.mediawiki.org/wiki/API:Pageswithprop
    */
  public pageswithprop(params: PagesWithPropRequest) {
    return this.query<PagesWithProp>(params, { list: 'pageswithprop' });
  }

  /**
    * Perform a prefix search for page titles.
    * @see https://www.mediawiki.org/wiki/API:Prefixsearch
    */
  public prefixsearch(params: PrefixSearchRequest) {
    return this.query<PrefixSearch>(params, { list: 'prefixsearch' });
  }

  /**
    * List all titles protected from creation.
    * @see https://www.mediawiki.org/wiki/API:Protectedtitles
    */
  public protectedtitles(params: ProtectedTitlesRequest) {
    return this.query<ProtectedTitles>(params, { list: 'protectedtitles' });
  }

  public async query<T = unknown>(params: Record<string, unknown>, options: Record<string, unknown> = {}): Promise<T> {
    options = Object.assign(options, {
      action: 'query',
      format: 'json',
      formatversion: 2,
    });

    params = Object.assign(options, params);
    return await this.client.get<T>(params);
  }

  /**
    * Get a list provided by a QueryPage-based special page.
    * @see https://www.mediawiki.org/wiki/API:Querypage
    */
  public querypage(params: QueryPageRequest) {
    return this.query<QueryPage>(params, { list: 'querypage' });
  }

  /**
    * Get a set of random pages.
    * @see https://www.mediawiki.org/wiki/API:Random
    */
  public random(params: RandomRequest) {
    return this.query<Random>(params, { list: 'random' });
  }

  /**
    * Enumerate recent changes.
    * @see https://www.mediawiki.org/wiki/API:Recentchanges
    */
  public recentchanges(params: RecentChangesRequest) {
    return this.query<RecentChanges>(params, { list: 'recentchanges' });
  }

  /**
    * Returns all redirects to the given pages.
    * @see https://www.mediawiki.org/wiki/API:Redirects
    */
  public redirects(params: RedirectsRequest) {
    return this.query<Redirects>(params, { prop: 'redirects' });
  }

  /**
    * Get revision information.
    * @see https://www.mediawiki.org/wiki/API:Revisions
    */
  public revisions(params: RevisionsRequest) {
    return this.query<Revisions>(params, { prop: 'revisions' });
  }

  /**
    * Perform a full text search.
    * @see https://www.mediawiki.org/wiki/API:Search
    */
  public search(params: SearchRequest) {
    return this.query<Search>(params, { list: 'search' });
  }

  /**
    * Return general information about the site.
    * @see https://www.mediawiki.org/wiki/API:Siteinfo
    */
  public async siteinfo(params: SiteInfoRequest) {
    const result = await this.query<SiteInfo>(params, { meta: 'siteinfo' });

    return result.query;
  }

  /**
    * List change tags.
    * @see https://www.mediawiki.org/wiki/API:Tags
    */
  public tags(params: TagsRequest) {
    return this.query<Tags>(params, { list: 'tags' });
  }

  /**
    * Returns all pages transcluded on the given pages.
    * @see https://www.mediawiki.org/wiki/API:Templates
    */
  public templates(params: TemplatesRequest) {
    return this.query<Templates>(params, { prop: 'templates' });
  }

  /**
    * Gets tokens for data-modifying actions.
    * @see https://www.mediawiki.org/wiki/API:Tokens
    */
  public async tokens(tokenType: '*' | Prop<TokenType>, force = false): Promise<{
    [k in `${TokenType}token`]?: string
  }> {
    if (!force && typeof tokenType === 'string' && this.cachedTokens[tokenType]) {
      return {
        [`${tokenType}token`]: this.cachedTokens[tokenType],
      };
    }

    let type: string;

    if (Array.isArray(tokenType)) type = tokenType.join('|');
    else type = tokenType;

    const tokens = await this.client.get<{
      query: {
        tokens: Record<`${TokenType}token`, string>;
      };
    }>({
      action: 'query',
      format: 'json',
      formatversion: '2',
      meta: 'tokens',
      type,
    });

    return tokens.query.tokens;
  }

  /**
    * Find all pages that transclude the given pages.
    * @see https://www.mediawiki.org/wiki/API:Transcludedin
    */
  public transcludedin(params: TranscludedInRequest) {
    return this.query<TranscludedIn>(params, { prop: 'transcludedin' });
  }

  /**
    * Unblock a user.
    */
  public async unblock(params: UnblockRequest) {
    const request = await this.action<Unblock>(params, { action: 'unblock' });
    return request.unblock;
  }

  /**
    * Upload a file, or get the status of pending uploads.
    */
  public async upload(params: UploadRequest) {
    const defaults: Record<string, unknown> = {
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
    * Get all edits by a user.
    * @see https://www.mediawiki.org/wiki/API:Usercontribs
    */
  public usercontribs(params: UserContribsRequest) {
    return this.query<UserContribs>(params, { list: 'usercontribs' });
  }

  /**
    * Get information about the current user.
    * @see https://www.mediawiki.org/wiki/API:Userinfo
    */
  public async userinfo(params: UserInfoRequest) {
    const result = await this.query<UserInfo>(params, { meta: 'userinfo' });

    return result.query.userinfo;
  }

  /**
    * Change a user's group membership.
    */
  public async userrights(params: UserRightsRequest) {
    const token = await this.tokens('userrights');
    const request = await this.action<UserRights>(params, { action: 'userrights', token: token.userrightstoken! });
    return request.userrights;
  }

  /**
    * Get information about a list of users.
    * @see https://www.mediawiki.org/wiki/API:Users
    */
  public users(params: UsersRequest) {
    return this.query<Users>(params, { list: 'users' });
  }

  /**
    * Get recent changes to pages in the current user's watchlist.
    * @see https://www.mediawiki.org/wiki/API:Watchlist
    */
  public watchlist(params: WatchlistRequest) {
    return this.query<Watchlist>(params, { list: 'watchlist' });
  }

  /**
    * Get all pages on the current user's watchlist.
    * @see https://www.mediawiki.org/wiki/API:Watchlistraw
    */
  public watchlistraw(params: WatchlistRawRequest) {
    return this.query<WatchlistRaw>(params, { list: 'watchlistraw' });
  }
}
