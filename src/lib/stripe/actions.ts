'use server';

import { z } from 'zod';
import { join } from 'path';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { RedirectType } from 'next/dist/client/components/redirect';

import getLogger from '~/core/logger';
import getApiRefererPath from '~/core/generic/get-api-referer-path';

import createStripeCheckout from '~/lib/stripe/create-checkout';
import requireSession from '~/lib/user/require-session';

import configuration from '~/configuration';
import createBillingPortalSession from '~/lib/stripe/create-billing-portal-session';
import { withSession } from '~/core/generic/actions-utils';
import { getUserSubscription } from '~/lib/subscriptions/queries';
import getSupabaseServerActionClient from '~/core/supabase/action-client';

export const createCheckoutAction = withSession(
  async (_, formData: FormData) => {
    const logger = getLogger();
    const body = Object.fromEntries(formData);
    const bodyResult = await getCheckoutBodySchema().safeParseAsync(body);

    const redirectToErrorPage = (error?: string) => {
      const referer = getApiRefererPath(headers());
      const url = join(referer, `?error=true`);

      logger.error({ error }, `Could not create Stripe Checkout session`);

      return redirect(url);
    };

    // Validate the body schema
    if (!bodyResult.success) {
      return redirectToErrorPage(`Invalid request body`);
    }

    const { priceId, returnUrl } = bodyResult.data;

    // create the Supabase client
    const client = getSupabaseServerActionClient();

    // require the user to be logged in
    const sessionResult = await requireSession(client);
    const userId = sessionResult.user.id;
    const customerEmail = sessionResult.user.email;

    const { data: customerSubscriptionData } = await getUserSubscription(
      client,
      userId,
    );

    const customerId = customerSubscriptionData?.customerId;

    const plan = getPlanByPriceId(priceId);

    // check if the plan exists in the configuration.
    if (!plan) {
      console.warn(
        `Plan not found for price ID "${priceId}". Did you forget to add it to the configuration? If the Price ID is incorrect, the checkout will be rejected. Please check the Stripe dashboard`,
      );
    }

    const trialPeriodDays =
      plan && 'trialPeriodDays' in plan
        ? (plan.trialPeriodDays as number)
        : undefined;

    const embedded = configuration.stripe.embedded;

    // create the Stripe Checkout session
    const session = await createStripeCheckout({
      returnUrl,
      userId,
      priceId,
      customerId,
      trialPeriodDays,
      customerEmail,
      embedded,
    }).catch((e) => {
      logger.error(e, `Stripe Checkout error`);
    });

    // check if the response is valid (i.e. it contains the URL)
    // if not, redirect to the error page
    if (!session) {
      return redirectToErrorPage(`An unexpected error occurred`);
    }

    logger.info(
      {
        id: session.id,
        userId,
      },
      `Created Stripe Checkout session`,
    );

    // if the checkout is embedded, we need to render the checkout
    // therefore, we send the clientSecret back to the client
    if (embedded) {
      logger.info(
        { id: session.id },
        `Using embedded checkout mode. Sending client secret back to client.`,
      );

      return {
        clientSecret: session.client_secret,
      };
    }

    // if the checkout is embedded, we need to render the checkout
    // therefore, we send the clientSecret back to the client
    if (embedded) {
      logger.info(
        { id: session.id },
        `Using embedded checkout mode. Sending client secret back to client.`,
      );

      return {
        clientSecret: session.client_secret,
      };
    }

    // retrieve the Checkout Portal URL
    const portalUrl = getCheckoutPortalUrl(session.url, returnUrl);

    // redirect user back based on the response
    return redirect(portalUrl, RedirectType.replace);
  },
);

export const createBillingPortalSessionAction = withSession(
  async (formData: FormData) => {
    const body = Object.fromEntries(formData);
    const bodyResult = await getBillingPortalBodySchema().safeParseAsync(body);
    const referrerPath = getApiRefererPath(headers());

    // Validate the body schema
    if (!bodyResult.success) {
      return redirectToErrorPage(referrerPath);
    }

    const { customerId } = bodyResult.data;

    const client = getSupabaseServerActionClient();
    const logger = getLogger();

    await requireSession(client);

    const referer = headers().get('referer');
    const origin = headers().get('origin');
    const returnUrl = referer || origin || configuration.paths.appHome;

    // get the Stripe Billing Portal session
    const { url } = await createBillingPortalSession({
      returnUrl,
      customerId,
    }).catch((e) => {
      logger.error(e, `Stripe Billing Portal redirect error`);

      return redirectToErrorPage(referrerPath);
    });

    // redirect to the Stripe Billing Portal
    return redirect(url, RedirectType.replace);
  },
);

function getBillingPortalBodySchema() {
  return z.object({
    customerId: z.string().min(1),
  });
}

function getCheckoutBodySchema() {
  return z.object({
    priceId: z.string().min(1),
    returnUrl: z.string().min(1),
  });
}

function getPlanByPriceId(priceId: string) {
  const products = configuration.stripe.products;

  type Plan = (typeof products)[0]['plans'][0];

  return products.reduce<Maybe<Plan>>((acc, product) => {
    if (acc) {
      return acc;
    }

    return product.plans.find(({ stripePriceId }) => stripePriceId === priceId);
  }, undefined);
}

/**
 *
 * @param portalUrl
 * @param returnUrl
 * @description return the URL of the Checkout Portal
 * if running in emulator mode and the portal URL is undefined (as
 * stripe-mock does) then return the returnUrl (i.e. it redirects back to
 * the subscriptions page)
 */
function getCheckoutPortalUrl(portalUrl: string | null, returnUrl: string) {
  if (isTestingMode() && !portalUrl) {
    return [returnUrl, 'success=true'].join('?');
  }

  return portalUrl as string;
}

/**
 * @description detect if Stripe is running in emulator mode
 */
function isTestingMode() {
  const enableStripeTesting = process.env.ENABLE_STRIPE_TESTING;

  return enableStripeTesting === 'true';
}

function redirectToErrorPage(referrerPath: string) {
  const url = join(referrerPath, `?error=true`);

  return redirect(url);
}
