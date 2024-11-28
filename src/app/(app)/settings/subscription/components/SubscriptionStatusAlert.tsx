import classNames from 'clsx';
import Subscription from '~/lib/subscriptions/subscription';
import { getMessagesByStatus } from '~/lib/subscriptions/subscription-messages';

function SubscriptionStatusAlert(
  props: React.PropsWithChildren<{
    subscription: Subscription;
    values: {
      endDate: string;
      trialEndDate: string | null;
    };
  }>,
) {
  const status = props.subscription.status;
  const { type, description } = getMessagesByStatus(status);

  return (
    <span
      className={classNames('text-sm', {
        'text-orange-700 dark:text-gray-400': type === 'warn',
        'text-red-700 dark:text-red-400': type === 'error',
        'text-green-700 dark:text-green-400': type === 'success',
      })}
    >
      <span className={'block'}>{description(props.values)}</span>
    </span>
  );
}

export default SubscriptionStatusAlert;
