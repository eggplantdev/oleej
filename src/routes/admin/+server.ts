import { redirect } from '@sveltejs/kit';
import { adminUrl } from '../../constans/constans';

export function GET() {
  redirect(307, adminUrl);
}
