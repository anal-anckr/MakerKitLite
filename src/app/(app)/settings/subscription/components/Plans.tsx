'use client';

import If from '~/core/ui/If';
import SubscriptionCard from './SubscriptionCard';

import PlanSelectionForm from '~/app/(app)/settings/subscription/components/PlanSelectionForm';
import BillingPortalRedirectButton from '~/app/(app)/settings/subscription/components/BillingRedirectButton';
import useUserSession from '~/core/hooks/use-user-session';

const Plans = () => {
  const userSession = useUserSession();
  const subscription = userSession?.subscription;
  const customerId = userSession?.customerId;

  if (!subscription) {
    return <PlanSelectionForm customerId={customerId} />;
  }

  return (
    <div className={'flex flex-col space-y-4'}>
      <div>
        <div
          className={'border w-full lg:w-9/12 xl:w-6/12 rounded-xl divide-y'}
        >
          <div className={'p-6'}>
            <SubscriptionCard subscription={subscription} />
          </div>

          <div className={'flex justify-end p-6'}>
            <If condition={customerId}>
              <div className={'flex flex-col space-y-2 items-end'}>
                <BillingPortalRedirectButton customerId={customerId as string}>
                  Go to Customer Portal
                </BillingPortalRedirectButton>

                <span className={'text-xs text-gray-500 dark:text-gray-400'}>
                  Visit your Customer Portal to manage your subscription and
                  billing.
                </span>
              </div>
            </If>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
