import Subscription from '~/lib/subscriptions/subscription';

const SUCCESS = 'success' as const;
const WARN = 'warn' as const;
const ERROR = 'error' as const;

const MESSAGES = {
  status: {
    free: {
      label: 'Free Plan',
      heading: 'You are currently on the Free Plan',
      description: () =>
        "You're on a free plan. You can upgrade to a paid plan at any time.",
      type: SUCCESS,
    },
    active: {
      label: 'Active',
      heading: 'Your subscription is active',
      description: () =>
        'Your subscription is active. You can manage your subscription and billing in the Customer Portal.',
      type: SUCCESS,
    },
    trialing: {
      label: 'Trial',
      heading: "You're on a trial",
      description: ({
        trialEndDate,
      }: {
        trialEndDate?: Maybe<string | null>;
      }) => `Your trial will end on ${trialEndDate}`,
      type: SUCCESS,
    },
    past_due: {
      label: 'Past Due',
      heading: 'Your invoice is past due',
      description: () =>
        'Your invoice is past due. Please update your payment method.',
      type: ERROR,
    },
    canceled: {
      label: 'Canceled',
      heading: 'Your subscription is canceled',
      description: ({ endDate }: { endDate?: Maybe<string | null> }) =>
        `Your subscription is canceled. It is scheduled to end on ${endDate}`,
      type: WARN,
    },
    unpaid: {
      label: 'Unpaid',
      heading: 'Your invoice is unpaid',
      description: () =>
        'Your invoice is unpaid. Please update your payment' + ' method.',
      type: ERROR,
    },
    incomplete: {
      label: 'Incomplete',
      heading: "We're waiting for your payment",
      description: () =>
        "We're waiting for your payment to go through. Please bear with us.",
      type: WARN,
    },
    incomplete_expired: {
      label: 'Expired',
      heading: 'Your payment has expired',
      description: () =>
        'Your payment has expired. Please update your payment method.',
      type: ERROR,
    },
    paused: {
      label: 'Paused',
      heading: 'Your subscription is paused',
      description: () =>
        'Your subscription is paused. You can resume it at any time.',
      type: WARN,
    },
  },
};

export function getMessagesByStatus(status: Subscription['status'] | 'free') {
  return MESSAGES.status[status];
}
