import Link from 'next/link';

import configuration from '~/configuration';
import Heading from '~/core/ui/Heading';

import PasswordResetContainer from '~/app/auth/components/PasswordResetContainer';

export const metadata = {
  title: 'Password Reset',
};

function PasswordResetPage() {
  return (
    <>
      <div>
        <Heading type={5}>Reset your Password</Heading>
      </div>

      <div className={'flex flex-col space-y-4'}>
        <PasswordResetContainer />

        <div className={'flex justify-center text-xs'}>
          <p className={'flex space-x-1'}>
            <span>Have you recovered your password?</span>

            <Link
              className={'text-primary-800 hover:underline dark:text-primary'}
              href={configuration.paths.signIn}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default PasswordResetPage;
