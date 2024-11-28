import type { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';
import { USERS_TABLE } from '~/lib/db-tables';

/**
 * @description Fetch user object data (not auth!) by ID {@link userId}
 */
export async function getUserDataById(
  client: SupabaseClient<Database>,
  userId: string,
) {
  const result = await client
    .from(USERS_TABLE)
    .select(
      `
      id,
      displayName: display_name,
      photoUrl: photo_url
    `,
    )
    .eq('id', userId)
    .maybeSingle();

  return result.data;
}
