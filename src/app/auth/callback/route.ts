import type { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

import getLogger from '~/core/logger';
import configuration from '~/configuration';
import getSupabaseRouteHandlerClient from '~/core/supabase/route-handler-client';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const logger = getLogger();

  const authCode = requestUrl.searchParams.get('code');

  if (authCode) {
    const client = getSupabaseRouteHandlerClient();

    try {
      const { error } = await client.auth.exchangeCodeForSession(authCode);

      // if we have an error, we redirect to the error page
      if (error) {
        return onError({
          error: error.message,
        });
      }
    } catch (error) {
      logger.error(
        {
          error,
        },
        `An error occurred while exchanging code for session`,
      );

      const message = error instanceof Error ? error.message : error;

      return onError({
        error: message as string,
      });
    }
  }

  return redirect(configuration.paths.appHome);
}

function onError({ error }: { error: string }) {
  const errorMessage = getAuthErrorMessage(error);

  getLogger().error(
    {
      error,
    },
    `An error occurred while signing user in`,
  );

  redirect(`/auth/callback/error?error=${errorMessage}`);
}

/**
 * Checks if the given error message indicates a verifier error.
 * We check for this specific error because it's highly likely that the
 * user is trying to sign in using a different browser than the one they
 * used to request the sign in link. This is a common mistake, so we
 * want to provide a helpful error message.
 */
function isVerifierError(error: string) {
  return error.includes('both auth code and code verifier should be non-empty');
}

function getAuthErrorMessage(error: string) {
  return isVerifierError(error)
    ? getCodeVerifierMessageError()
    : getGenericErrorMessage();
}

function getCodeVerifierMessageError() {
  return `It looks like you're trying to sign in using a different browser than the one you used to request the sign in link. Please try again using the same browser.`;
}

function getGenericErrorMessage() {
  return `Sorry, we could not authenticate you. Please try again.`;
}
