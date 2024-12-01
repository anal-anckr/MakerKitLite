import { NextRequest, NextResponse } from 'next/server';
import csrf from 'edge-csrf';

import HttpStatusCode from '~/core/generic/http-status-code.enum';
import configuration from '~/configuration';
import createMiddlewareClient from '~/core/supabase/middleware-client';
import GlobalRole from '~/core/session/types/global-role';
import getLogger from './core/logger';

const CSRF_SECRET_COOKIE = 'csrfSecret';
const NEXT_ACTION_HEADER = 'next-action';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|locales|assets|api/stripe/webhook|api/*).*)',
  ],
};
const logger = getLogger();

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const csrfResponse = await withCsrfMiddleware(request, response);
  const sessionResponse = await sessionMiddleware(request, csrfResponse);

  if (request.nextUrl.pathname.startsWith('/api')) {
    const apiMiddlewareResponse = await apiMiddleware(request, sessionResponse);
    return apiMiddlewareResponse;
  } else {
    return await adminMiddleware(request, sessionResponse);
  }
}

async function sessionMiddleware(req: NextRequest, res: NextResponse) {
  const supabase = createMiddlewareClient(req, res);

  await supabase.auth.getSession();

  return res;
}

async function withCsrfMiddleware(
  request: NextRequest,
  response = new NextResponse(),
) {
  // set up CSRF protection
  const csrfMiddleware = csrf({
    cookie: {
      secure: configuration.production,
      name: CSRF_SECRET_COOKIE,
    },
    // ignore CSRF errors for server actions since protection is built-in
    ignoreMethods: isServerAction(request)
      ? ['POST']
      : // always ignore GET, HEAD, and OPTIONS requests
        ['GET', 'HEAD', 'OPTIONS'],
  });

  const csrfError = await csrfMiddleware(request, response);

  // if there is a CSRF error, return a 403 response
  if (csrfError) {
    return NextResponse.json('Invalid CSRF token', {
      status: HttpStatusCode.Forbidden,
    });
  }

  // otherwise, return the response
  return response;
}

function isServerAction(request: NextRequest) {
  const headers = new Headers(request.headers);

  return headers.has(NEXT_ACTION_HEADER);
}

async function adminMiddleware(request: NextRequest, response: NextResponse) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  if (!isAdminPath) {
    return response;
  }

  const supabase = createMiddlewareClient(request, response);
  const user = await supabase.auth.getUser();

  // If user is not logged in, redirect to sign in page.
  // This should never happen, but just in case.
  if (!user) {
    return NextResponse.redirect(configuration.paths.signIn);
  }

  const role = user.data.user?.app_metadata['role'];

  // If user is not an admin, redirect to 404 page.
  if (!role || role !== GlobalRole.SuperAdmin) {
    return NextResponse.redirect(`${configuration.site.siteUrl}/404`);
  }

  // in all other cases, return the response
  return response;
}
async function apiMiddleware(
  request: NextRequest,
  sessionResponse: NextResponse,
) {
  const supabase = createMiddlewareClient(request, sessionResponse);
  await adminMiddleware(request, sessionResponse);
  const cookieHeader = request.headers.get('Cookie');

  // If token is missing, respond with 401 Unauthorized
  if (!cookieHeader) {
    return { data: null, error: 'token is Invalid', status: 400 };
  }

  const cookies = cookieHeader.split('=')[1];
  if (!cookies) return null;

  const tokenJson = decodeURIComponent(cookies);
  if (!tokenJson) {
    return { data: null, error: 'token is Invalid', status: 400 };
  }

  const tokenArray = tokenJson.split(';');

  const token = JSON.parse(tokenArray[0]).access_token;

  // Verify the token
  try {
    const { data: checkUserExist, error } = await supabase.auth.getUser(token);
    if (error) {
      return { data: null, error: 'User is Invalid', status: 498 };
    }
    return {
      userId: checkUserExist.user.id,
      userEmail: checkUserExist.user.email,
      error: null,
      status: 200,
    };
  } catch (error) {
    return { data: null, error: 'Unauthorized: Token', status: 401 };
  }
}
