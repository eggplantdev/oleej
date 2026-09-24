import { fail, type Actions } from '@sveltejs/kit';
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

// Posts as a Subscriber (no moderate_comments cap), so WP puts every comment into the manual-approval queue.
const submitComment = async (request: Request) => {
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
    },
    body: JSON.stringify({ post: postId, parent, author_name: authorName, content }),
  });

  if (!response.ok) return fail(response.status);
  return { success: true };
};

export const actions: Actions = {
  add_comment: ({ request }) => submitComment(request),
  add_comment_response: ({ request }) => submitComment(request),
};
