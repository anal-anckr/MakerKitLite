'use client';

import { useFormStatus } from 'react-dom';

import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';
import ErrorBoundary from '~/core/ui/ErrorBoundary';
import Alert from '~/core/ui/Alert';

import { deleteUserAccountAction } from '~/lib/user/actions.server';

function ProfileDangerZone() {
  return <DeleteProfileContainer />;
}

export default ProfileDangerZone;

function DeleteProfileContainer() {
  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex flex-col space-y-1'}>
        <Heading type={5}>Delete Account</Heading>

        <p className={'text-gray-500 text-sm'}>
          Please note that this action cannot be undone. You will be asked to
          confirm before your account is deleted.
        </p>
      </div>

      <div>
        <DeleteProfileModal />
      </div>
    </div>
  );
}

function DeleteProfileModal() {
  return (
    <Modal
      heading={`Deleting account`}
      Trigger={
        <Button data-cy={'delete-account-button'} variant={'destructive'}>
          Delete Account
        </Button>
      }
    >
      <ErrorBoundary fallback={<DeleteProfileErrorAlert />}>
        <DeleteProfileForm />
      </ErrorBoundary>
    </Modal>
  );
}

function DeleteProfileForm() {
  return (
    <form
      action={deleteUserAccountAction}
      className={'flex flex-col space-y-4'}
    >
      <div className={'flex flex-col space-y-6'}>
        <div>
          This will delete your account and the data associated with it.
          Furthermore, we will immediately cancel any active subscriptions. This
          action cannot be undone.
        </div>

        <TextFieldLabel>
          Type DELETE to confirm
          <TextFieldInput
            data-cy={'delete-account-input-field'}
            required
            type={'text'}
            className={'w-full'}
            placeholder={''}
            pattern={`DELETE`}
          />
        </TextFieldLabel>

        <div>Are you sure you want to delete your account?</div>
      </div>

      <div className={'flex justify-end space-x-2.5'}>
        <DeleteAccountSubmitButton />
      </div>
    </form>
  );
}

function DeleteAccountSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      data-cy={'confirm-delete-account-button'}
      name={'action'}
      value={'delete'}
      variant={'destructive'}
      loading={pending}
    >
      Yes, delete my account
    </Button>
  );
}

function DeleteProfileErrorAlert() {
  return (
    <Alert type={'error'}>
      <Alert.Heading>Sorry, we couldn&apos;t delete your account</Alert.Heading>
      Please try again later or contact support if the problem persists.
    </Alert>
  );
}
