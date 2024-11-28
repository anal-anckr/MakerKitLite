'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import If from '~/core/ui/If';

import EmailPasswordSignUpContainer from '~/app/auth/components/EmailPasswordSignUpContainer';
import PhoneNumberSignInContainer from '~/app/auth/components/PhoneNumberSignInContainer';
import EmailLinkAuth from '~/app/auth/components/EmailLinkAuth';
import OAuthProviders from '~/app/auth/components/OAuthProviders';

import configuration from '~/configuration';
import EmailOtpContainer from '~/app/auth/components/EmailOtpContainer';

function SignUpMethodsContainer() {
  const router = useRouter();

  const onSignUp = useCallback(() => {
    router.replace(configuration.paths.appHome);
  }, [router]);

  return (
    <>
      <If condition={configuration.auth.providers.oAuth.length}>
        <OAuthProviders />

        <div>
          <span className={'text-xs text-gray-400'}>
            or continue with email
          </span>
        </div>
      </If>

      <If condition={configuration.auth.providers.emailPassword}>
        <EmailPasswordSignUpContainer onSignUp={onSignUp} />
      </If>

      <If condition={configuration.auth.providers.phoneNumber}>
        <PhoneNumberSignInContainer onSuccess={onSignUp} mode={'signUp'} />
      </If>

      <If condition={configuration.auth.providers.emailLink}>
        <EmailLinkAuth />
      </If>

      <If condition={configuration.auth.providers.emailOtp}>
        <EmailOtpContainer shouldCreateUser={true} />
      </If>
    </>
  );
}

export default SignUpMethodsContainer;
