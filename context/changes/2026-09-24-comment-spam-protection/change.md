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

- [x] Settings → Discussion: "Comment must be manually approved" on; "Comment author must have
      a previously approved comment" off.
- [x] Spam comments removed.
- [x] Code Snippets plugin → snippet "Block anonymous wp-comments-post.php"
      (`pre_comment_on_post` → `wp_die(403)`). Verified: POST returns 403, nothing saved.
      Anonymous REST and XML-RPC comments are off by WP default.
- [x] Leaked admin application password revoked. Verified: REST auth returns 401.
- [x] WP admin login password changed.
- [x] seohost panel password rotated (by the hosting owner; not accessible to us).

### Done in code

- `src/routes/blog/[slug]/+page.server.ts`: one `submitComment` helper for both actions; posts to
  the live host (`baseUrl`); credentials from `WP_COMMENTS_USER` / `WP_COMMENTS_APP_PASSWORD`;
  honeypot (`website` field) returns fake success; length validation; failures return `fail()`
  so the form shows the error dialog.
- GraphQL query + types: `databaseId` for post and comments; forms send numeric IDs.
- Forms: hidden honeypot field; success shows "Komentarz pojawi się po zatwierdzeniu".
- `notes.md` / `notes.txt` untracked and gitignored. They remain in public git history, so the
  credentials in them count as leaked for good.

### Open

- [ ] Create WP user `comments-bot` with the **Subscriber** role plus an application password.
      Subscribers lack `moderate_comments`, so their comments go into the approval queue.
- [ ] Set `WP_COMMENTS_USER` / `WP_COMMENTS_APP_PASSWORD` in `.env` and in Vercel env vars, then
      redeploy.
- [ ] Verify end-to-end: a comment from the blog lands in WP → Comments → Pending.
- [ ] Confirm which inbox gets moderation emails (Settings → General → Administration Email
      Address).
- [ ] DB password rotation needs the hosting panel (the hosting owner). Low risk: MySQL is
      localhost-only.
- [ ] Optional: Cloudflare Turnstile or a Vercel Firewall rate limit on POST `/blog/*`, if spam
      starts coming through the frontend.
