import 'server-only';

import { cache } from 'react';
import { redirect } from 'next/navigation';

import configuration from '~/configuration';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import verifyRequiresMfa from '~/core/session/utils/check-requires-mfa';
import getLogger from '~/core/logger';
const logger = getLogger();
/**
 * @name loadAuthPageData
 * @description This function is responsible for loading the authentication
 * layout's data.
 * If the user is logged in and does not require multi-factor
 * authentication, redirect them to the app home page. Otherwise, continue
 * to the authentication pages.
 */
const loadAuthPageData = cache(async () => {
  const client = getSupabaseServerComponentClient();

  const {
    data: { session },
  } = await client.auth.getSession();

  const requiresMultiFactorAuthentication = await verifyRequiresMfa(client);

  // If the user is logged in and does not require multi-factor authentication,
  // redirect them to the home page.
  if (session && !requiresMultiFactorAuthentication) {
    logger.info(
      `User is logged in and does not require multi-factor authentication. Redirecting to home page.`,
    );

    redirect(configuration.paths.appHome);
  }

  return {};
});

export default loadAuthPageData;
