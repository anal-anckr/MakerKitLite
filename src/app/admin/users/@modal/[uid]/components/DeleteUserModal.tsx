'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { User } from '@supabase/gotrue-js';

import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';
import Modal from '~/core/ui/Modal';
import Button from '~/core/ui/Button';
import { deleteUserAction } from '~/app/admin/users/@modal/[uid]/actions';

function DeleteUserModal({
  user,
}: React.PropsWithChildren<{
  user: User;
}>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [pending, startTransition] = useTransition();
  const displayText = user.email ?? user.phone ?? '';

  const onDismiss = () => {
    router.back();

    setIsOpen(false);
  };

  const onConfirm = () => {
    startTransition(async () => {
      await deleteUserAction({
        userId: user.id,
      });

      onDismiss();
    });
  };

  return (
    <Modal heading={'Delete User'} isOpen={isOpen} setIsOpen={onDismiss}>
      <form action={onConfirm}>
        <div className={'flex flex-col space-y-4'}>
          <div className={'flex flex-col space-y-2 text-sm'}>
            <p>
              You are about to delete <b>{displayText}</b>.
            </p>

            <p>
              <b>You cannot undo this action.</b> This will also delete all of
              the user&apos;s data.
            </p>

            <p>Are you sure you want to do this?</p>
          </div>

          <div>
            <TextFieldLabel>
              Confirm by typing <b>DELETE</b>
              <TextFieldInput required type={'text'} pattern={'DELETE'} />
            </TextFieldLabel>
          </div>

          <div className={'flex space-x-2.5 justify-end'}>
            <Modal.CancelButton disabled={pending} onClick={onDismiss}>
              Cancel
            </Modal.CancelButton>

            <Button loading={pending} variant={'destructive'}>
              Yes, delete user
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default DeleteUserModal;
