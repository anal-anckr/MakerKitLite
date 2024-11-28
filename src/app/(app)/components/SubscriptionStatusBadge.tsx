import { Tooltip, TooltipTrigger, TooltipContent } from '~/core/ui/Tooltip';
import Badge from '~/core/ui/Badge';

import Subscription from '~/lib/subscriptions/subscription';
import { getMessagesByStatus } from '~/lib/subscriptions/subscription-messages';

function SubscriptionStatusBadge({
  subscription,
}: React.PropsWithChildren<{
  subscription: Maybe<Subscription>;
}>) {
  const status = subscription?.status ?? 'free';
  const messages = getMessagesByStatus(status);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge size={'small'} color={messages.type}>
          {messages.label}
        </Badge>
      </TooltipTrigger>

      <TooltipContent>
        {messages.description(getDates(subscription))}
      </TooltipContent>
    </Tooltip>
  );
}

function getDates(subscription: Maybe<Subscription>) {
  if (!subscription) {
    return {};
  }

  return {
    endDate: new Date(subscription.periodEndsAt).toDateString(),
    trialEndDate: subscription.trialEndsAt
      ? new Date(subscription.trialEndsAt).toDateString()
      : null,
  };
}

export default SubscriptionStatusBadge;
