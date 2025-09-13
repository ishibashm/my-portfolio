import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { fetchGraphQL } from '@/utils/fetchGraphQL';
import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  mutation LoginWithCookies($login: String!, $password: String!) {
    loginWithCookies(login: $login, password: $password) {
      status
    }
  }
`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const { data } = await fetchGraphQL<{ loginWithCookies: { status: string } }>({
    query: LOGIN_MUTATION,
    variables: {
      login: process.env.WORDPRESS_AUTH_USER,
      password: process.env.WORDPRESS_AUTH_PASSWORD,
    },
  });

  if (data.loginWithCookies.status !== 'SUCCESS') {
    return new Response('Failed to login', { status: 401 });
  }

  draftMode().enable();

  redirect(`/${slug || ''}`);
}
