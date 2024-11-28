import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/database.types';
import { CUSTOMERS_SUBSCRIPTIONS_TABLE } from '~/lib/db-tables';
import Subscription from '~/lib/subscriptions/subscription';

type Client = SupabaseClient<Database>;

/**
 * @name getUserSubscription
 * @description Returns the user's subscription
 */
export async function getUserSubscription(client: Client, userId: string) {
  return client
    .from(CUSTOMERS_SUBSCRIPTIONS_TABLE)
    .select<
      string,
      {
        customerId: string;
        subscription: Maybe<Subscription>;
      }
    >(
      `
        customerId: customer_id,
        subscription: subscription_id (
          id,
          status,
          currency,
          interval,
          cancelAtPeriodEnd: cancel_at_period_end,
          intervalCount: interval_count,
          priceId: price_id,
          createdAt: created_at,
          periodStartsAt: period_starts_at,
          periodEndsAt: period_ends_at,
          trialStartsAt: trial_starts_at,
          trialEndsAt: trial_ends_at
        )
      `
    )
    .eq('user_id', userId)
    .throwOnError()
    .maybeSingle();
}

/**
 * @name getOrganizationSubscriptionActive
 * @description Returns whether the organization is on an active
 * subscription, regardless of plan.
 */
export async function getOrganizationSubscriptionActive(
  client: Client,
  userId: string
) {
  const { data } = await getUserSubscription(client, userId);

  const status = data?.subscription?.status;

  if (!status) {
    return false;
  }

  return status === 'active' || status === 'trialing';
}
