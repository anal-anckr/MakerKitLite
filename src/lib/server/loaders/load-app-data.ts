import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  isRedirectError,
  getURLFromRedirectError,
} from 'next/dist/client/components/redirect';

import getUIStateCookies from '~/lib/server/loaders/utils/get-ui-state-cookies';
import { getUserDataById } from '../../user/database/queries';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import requireSession from '~/lib/user/require-session';
import getLogger from '~/core/logger';

import { getUserSubscription } from '~/lib/subscriptions/queries';

/**
 * @name loadAppData
 * @description This function is responsible for loading the application data
 * from the server-side, used in the (app) layout. The data is cached for
 * the request lifetime, which allows you to call the same across layouts.
 */
const loadAppData = cache(async () => {
  try {
    const client = getSupabaseServerComponentClient();
    const session = await requireSession(client);

    const user = session.user;
    const userId = user.id;

    // we fetch the user record from the Database
    // which is a separate object from the auth metadata
    const [userRecord, { data }] = await Promise.all([
      getUserDataById(client, userId),
      getUserSubscription(client, userId),
    ]);

    if (!userRecord) {
      return redirectToHomePage();
    }

    const subscription = data?.subscription;
    const customerId = data?.customerId;

    const csrfToken = getCsrfToken();
    const accessToken = session.access_token;

    return {
      accessToken,
      csrfToken,
      auth: {
        accessToken: session.access_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          phone: session.user.phone,
        },
      },
      subscription: subscription,
      customerId,
      user: userRecord,
      ui: getUIStateCookies(),
    };
  } catch (error) {
    const logger = getLogger();

    // if the error is a redirect error, we simply redirect the user
    // to the destination URL extracted from the error
    if (isRedirectError(error)) {
      const url = getURLFromRedirectError(error);

      return redirect(url);
    }

    logger.warn(
      {
        error: JSON.stringify(error),
      },
      `Could not load application data`,
    );

    // in case of any error, we redirect the user to the home page
    // to avoid any potential infinite loop
    return redirectToHomePage();
  }
});

function redirectToHomePage() {
  return redirect('/');
}

function getCsrfToken() {
  return headers().get('X-CSRF-Token');
}

export default loadAppData;
