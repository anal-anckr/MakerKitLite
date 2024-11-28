import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { USERS_TABLE } from '~/lib/db-tables';
import UserData from '~/core/session/types/user-data';
import Subscription from '~/lib/subscriptions/subscription';

export async function getUsers(ids: string[]) {
  const client = getSupabaseServerComponentClient({ admin: true });

  const { data: users, error } = await client
    .from(USERS_TABLE)
    .select<
      string,
      UserData & {
        subscription: {
          customerId: string;
          data: Subscription;
        };
      }
    >(
      `
      id,
      photoURL: photo_url,
      displayName: display_name,
      subscription: customers_subscriptions (
        customerId: customer_id,
        data: subscription_id (
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
      )
    `,
    )
    .in('id', ids);

  if (error) {
    throw error;
  }

  return users;
}
