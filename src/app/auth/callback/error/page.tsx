import { redirect } from 'next/navigation';

import { Alert, AlertHeading } from '~/core/ui/Alert';
import Button from '~/core/ui/Button';
import ResendLinkForm from './ResendLinkForm';

interface Params {
  searchParams: {
    error: string;
  };
}

function AuthCallbackErrorPage({ searchParams }: Params) {
  const { error } = searchParams;

  // if there is no error, redirect the user to the sign-in page
  if (!error) {
    redirect('/auth/sign-in');
  }

  return (
    <div className={'flex flex-col space-y-4 py-4'}>
      <div>
        <Alert type={'error'}>
          <AlertHeading>Authentication Error</AlertHeading>

          {error}
        </Alert>
      </div>

      <ResendLinkForm />

      <div className={'flex flex-col space-y-2'}>
        <Button variant={'ghost'}>
          <a href={'/auth/sign-in'}>Sign In</a>
        </Button>
      </div>
    </div>
  );
}

export default AuthCallbackErrorPage;
