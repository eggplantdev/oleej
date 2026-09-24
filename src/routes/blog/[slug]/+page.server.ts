import { fail, type Actions, type RequestEvent } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getPostDataQuery } from '../../../constans/queries';
import { baseUrl, graphqlUrl } from '../../../constans/constans';

export const load = async ({ params }) => {
  const postDataQuery = getPostDataQuery(params.slug);

  const getData = async (query: string) => {
    const data = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return data.json();
  };

  return {
    post: await getData(postDataQuery),
  };
};

const MAX_AUTHOR_LENGTH = 100;
const MAX_CONTENT_LENGTH = 5000;

// Posts as a Subscriber (no moderate_comments cap), so WP moderation rules and Akismet still apply.
const submitComment = async ({ request, url, getClientAddress }: RequestEvent) => {
  const formData = Object.fromEntries(await request.formData());

  // Honeypot: humans never see this field. Fake success so the bot doesn't retry.
  // Meaningless name on purpose — Safari/Chrome autofill fills fields like "website".
  if (formData.hp_x7) {
    console.warn('comment honeypot triggered');
    return { success: true };
  }

  const postId = Number(formData.post_id);
  const parent = formData.parent ? Number(formData.parent) : undefined;
  const authorName = String(formData.author_name ?? '').trim();
  const content = String(formData.content ?? '').trim();

  if (!postId || !authorName || !content) return fail(400);
  if (authorName.length > MAX_AUTHOR_LENGTH || content.length > MAX_CONTENT_LENGTH) return fail(400);

  const response = await fetch(`${baseUrl}comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${env.WP_COMMENTS_USER}:${env.WP_COMMENTS_APP_PASSWORD}`),
      // Akismet reads IP/UA/referer from the request it receives, which here is Vercel's server, so every
      // comment looks like a datacenter bot. Forward the commenter's real signals; a WP snippet maps
      // X-Commenter-IP onto Akismet's user_ip.
      'User-Agent': request.headers.get('user-agent') ?? '',
      Referer: `${url.origin}${url.pathname}`,
      'X-Commenter-IP': getClientAddress(),
    },
    body: JSON.stringify({ post: postId, parent, author_name: authorName, content }),
  });

  if (!response.ok) return fail(response.status);
  return { success: true };
};

export const actions: Actions = {
  add_comment: submitComment,
  add_comment_response: submitComment,
};
