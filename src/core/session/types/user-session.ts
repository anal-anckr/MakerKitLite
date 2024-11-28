import type UserData from '~/core/session/types/user-data';
import type Subscription from '~/lib/subscriptions/subscription';

/**
 * This interface combines the user's metadata from
 * Supabase Auth and the user's record in Database
 */
interface UserSession {
  auth: {
    accessToken: Maybe<string>;

    user: {
      id: string;
      email: Maybe<string>;
      phone: Maybe<string> | null;
    };
  };

  data: Maybe<UserData>;
  subscription?: Subscription | null;
  customerId?: Maybe<string>;
}

export default UserSession;
