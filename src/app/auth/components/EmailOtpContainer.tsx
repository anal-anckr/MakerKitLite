'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import VerificationCodeInput from '~/app/auth/components/VerificationCodeInput';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';

import configuration from '~/configuration';

import useSignInWithOtp from '~/core/hooks/use-sign-in-with-otp';
import useVerifyOtp from '~/core/hooks/use-verify-otp';

function EmailOtpContainer({
  shouldCreateUser,
}: React.PropsWithChildren<{
  shouldCreateUser: boolean;
}>) {
  const [email, setEmail] = useState('');

  if (email) {
    return <VerifyOtpForm email={email} />;
  }

  return (
    <EmailOtpForm onSuccess={setEmail} shouldCreateUser={shouldCreateUser} />
  );
}

function VerifyOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const verifyOtpMutation = useVerifyOtp();
  const [verifyCode, setVerifyCode] = useState('');

  return (
    <form
      className={'w-full'}
      onSubmit={async (event) => {
        event.preventDefault();

        const origin = window.location.origin;
        const redirectTo = [origin, configuration.paths.authCallback].join('');

        await verifyOtpMutation.trigger({
          email,
          token: verifyCode,
          type: 'email',
          options: {
            redirectTo,
          },
        });

        router.replace(configuration.paths.appHome);
      }}
    >
      <div className={'flex flex-col space-y-4'}>
        <VerificationCodeInput
          onValid={setVerifyCode}
          onInvalid={() => setVerifyCode('')}
        />

        <Button loading={verifyOtpMutation.isMutating} disabled={!verifyCode}>
          {verifyOtpMutation.isMutating ? `Verifying Code...` : `Verify Code`}
        </Button>
      </div>
    </form>
  );
}

function EmailOtpForm({
  shouldCreateUser,
  onSuccess,
}: React.PropsWithChildren<{
  shouldCreateUser: boolean;
  onSuccess: (email: string) => void;
}>) {
  const signInWithOtpMutation = useSignInWithOtp();

  return (
    <form
      className={'w-full'}
      onSubmit={async (event) => {
        event.preventDefault();

        const email = event.currentTarget.email.value;

        await signInWithOtpMutation.trigger({
          email,
          options: {
            shouldCreateUser,
          },
        });

        onSuccess(email);
      }}
    >
      <div className={'flex flex-col space-y-4'}>
        <TextFieldLabel>
          Email Address
          <TextFieldInput name={'email'} type={'email'} placeholder={''} />
        </TextFieldLabel>

        <Button loading={signInWithOtpMutation.isMutating}>
          <If
            condition={signInWithOtpMutation.isMutating}
            fallback={`Send Code to Email`}
          >
            Sending Code...
          </If>
        </Button>
      </div>
    </form>
  );
}

export default EmailOtpContainer;
