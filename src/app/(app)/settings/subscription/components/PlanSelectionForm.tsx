'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

import PricingTable from '~/components/PricingTable';
import CheckoutRedirectButton from '../components/CheckoutRedirectButton';

import Button from '~/core/ui/Button';
import ErrorBoundary from '~/core/ui/ErrorBoundary';
import If from '~/core/ui/If';
import BillingPortalRedirectButton from '~/app/(app)/settings/subscription/components/BillingRedirectButton';

const EmbeddedStripeCheckout = dynamic(
  () => import('./EmbeddedStripeCheckout'),
  {
    ssr: false,
  },
);

const PlanSelectionForm: React.FCC<{
  customerId: Maybe<string>;
}> = ({ customerId }) => {
  const [clientSecret, setClientSecret] = useState<string>();
  const [retry, setRetry] = useState(0);

  return (
    <div className={'flex flex-col space-y-6'}>
      <div className={'flex w-full flex-col space-y-8'}>
        <If condition={clientSecret}>
          <EmbeddedStripeCheckout clientSecret={clientSecret as string} />
        </If>

        <PricingTable
          CheckoutButton={(props) => {
            return (
              <ErrorBoundary
                key={retry}
                fallback={
                  <CheckoutErrorMessage
                    onRetry={() => setRetry((retry) => retry + 1)}
                  />
                }
              >
                <CheckoutRedirectButton
                  stripePriceId={props.stripePriceId}
                  recommended={props.recommended}
                  onCheckoutCreated={setClientSecret}
                >
                  Checkout
                </CheckoutRedirectButton>
              </ErrorBoundary>
            );
          }}
        />

        <If condition={customerId}>
          <div className={'flex flex-col items-center space-y-4'}>
            <div>or</div>

            <BillingPortalRedirectButton customerId={customerId as string}>
              Go to Customer Portal
            </BillingPortalRedirectButton>

            <span className={'text-xs text-gray-500 dark:text-gray-400'}>
              Visit your Customer Portal to manage your subscription and billing
            </span>
          </div>
        </If>
      </div>
    </div>
  );
};

export default PlanSelectionForm;

function CheckoutErrorMessage({ onRetry }: { onRetry: () => void }) {
  return (
    <div className={'flex flex-col space-y-2'}>
      <span className={'text-red-500 text-sm font-medium'}>
        Sorry, we were unable to load the checkout form. Please try again.
      </span>

      <Button onClick={onRetry} variant={'ghost'}>
        Retry
      </Button>
    </div>
  );
}
