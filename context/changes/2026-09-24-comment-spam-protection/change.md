---
change_id: comment-spam-protection
title: Stop bot comment spam and restore the blog comment form
status: new
created: 2026-09-24
updated: 2026-09-24
archived_at: null
branch: null
worktree: null
---

## Notes

### Diagnosis

- 266 casino/SEO spam comments, all auto-approved, all anonymous (none posted as `admin`).
- Entry point: WordPress's native `wp-comments-post.php` on `srv71890.seohost.com.pl`. Bots
  never touched the SvelteKit frontend.
- The frontend comment form was broken for real readers: actions posted to the dead old host
  `serwer2304048.home.pl`, and sent GraphQL global IDs instead of numeric `post` / `parent` IDs.
- The repo `eggplantdev/oleej` is public. `notes.md` / `notes.txt` committed WP admin, DB and
  hosting-panel credentials, and `+page.server.ts` hardcoded an admin WP application password.
  That application password was still valid on the live site until revoked.

### Done in WordPress admin (2026-09-24)

- [x] Settings → Discussion: manual approval **off** (comments publish immediately); hold comments
      with 1+ links; moderation words `casino`, `bet`, `slot`, `http`; both notification emails on.
- [x] Spam comments marked as spam.
- [x] Leaked admin application password revoked (verified 401). WP admin login password changed.
- [x] seohost panel password rotated (by the hosting owner; not accessible to us).
- [x] User `coments-bot` (sic; id 3, Subscriber) with an application password for the frontend.
- [x] Code Snippets (all "Run everywhere"):
  - **block bot comments**: `pre_comment_on_post` → `wp_die(403)`. Blocks anonymous
    `wp-comments-post.php`, the original spam entry point. Anonymous REST and XML-RPC comments
    are off by WP default.
  - **allowed frontend comments**: `wp_is_comment_flood` → `false` for `coments-bot`. Every
    frontend comment shares one WP user, so the per-user flood limit rejected real readers.
  - **preprocess_comment**: removes Akismet's `rest_pre_insert_comment` and `preprocess_comment`
    checks for `coments-bot`. Akismet sees Vercel's datacenter IP, a `node` UA and no email, and
    flagged normal readers as spam. Snippet must hook `rest_pre_insert_comment`: REST comments
    are checked there first.
- Code Snippets' editor mangles pasted code (drops characters, auto-closes brackets) and
  auto-deactivates a snippet on a syntax error. After pasting, compare line by line and check the
  toggle is on.

### Done in code

- `src/routes/blog/[slug]/+page.server.ts`: one `submitComment` helper for both actions; posts to
  the live host (`baseUrl`) as `coments-bot` via `WP_COMMENTS_USER` / `WP_COMMENTS_APP_PASSWORD`
  (Vercel env, Production); honeypot `hp_x7` (not `website`, which Safari autofills) returns fake
  success; length validation; failures return `fail(status)`. Forwards the reader's User-Agent,
  a Referer and `X-Commenter-IP` so WP sees real signals (unused while Akismet is skipped).
- GraphQL query + types: `databaseId` for post and comments; forms send numeric IDs.
- `Comments.svelte`: list is reactive, so a new comment shows without a reload.
- Vercel: `engines.node` 22.x and adapter runtime `nodejs22.x` (the project was pinned to Node 18).
- `notes.md` / `notes.txt` untracked and gitignored. They remain in public git history, so the
  credentials in them count as leaked for good.

### Known behavior

- WP rejects a comment identical to an existing one on the same post (409). All frontend
  comments share `coments-bot`'s email, so this applies across different readers.

### Open

- [ ] Update WordPress to 7.1.2.
- [ ] DB password rotation needs the hosting panel (the hosting owner). Low risk: MySQL is
      localhost-only.
- [ ] If spam gets through the frontend: Cloudflare Turnstile on the form, or a Vercel Firewall
      rate limit on POST `/blog/*`.
