import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import useMutation from 'swr/mutation';

import type { SupabaseClient } from '@supabase/supabase-js';

import configuration from '~/configuration';
import useUpdateProfileMutation from '~/lib/user/hooks/use-update-profile';

import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';

import Modal from '~/core/ui/Modal';
import useSupabase from '~/core/hooks/use-supabase';

import type UserSession from '~/core/session/types/user-session';
import type UserData from '~/core/session/types/user-data';
import AuthErrorMessage from '~/app/auth/components/AuthErrorMessage';
import ImageUploader from '~/core/ui/ImageUploader';
import { USERS_TABLE } from '~/lib/db-tables';

function UpdateProfileForm({
  session,
  onUpdateProfileData,
}: {
  session: UserSession;
  onUpdateProfileData: (user: Partial<UserData>) => void;
}) {
  const updateProfileMutation = useUpdateProfileMutation();
  const currentPhotoURL = session.data?.photoUrl ?? '';
  const currentDisplayName = session?.data?.displayName ?? '';

  const user = session.auth?.user;
  const email = user?.email ?? '';

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: currentDisplayName,
      photoURL: '',
    },
  });

  const onSubmit = async (displayName: string) => {
    const info = {
      id: user.id,
      displayName,
    };

    const promise = updateProfileMutation.trigger(info).then(() => {
      onUpdateProfileData(info);
    });

    return toast.promise(promise, {
      success: 'Profile successfully updated',
      error: `Encountered an error. Please try again`,
      loading: `Updating profile...`,
    });
  };

  const displayNameControl = register('displayName', {
    value: currentDisplayName,
  });

  useEffect(() => {
    reset({
      displayName: currentDisplayName ?? '',
      photoURL: currentPhotoURL ?? '',
    });
  }, [currentDisplayName, currentPhotoURL, reset]);

  return (
    <div className={'flex flex-col space-y-8'}>
      <UploadProfileAvatarForm
        currentPhotoURL={currentPhotoURL}
        userId={user?.id}
        onAvatarUpdated={(photoUrl) => onUpdateProfileData({ photoUrl })}
      />

      <form
        data-cy={'update-profile-form'}
        onSubmit={handleSubmit((value) => {
          return onSubmit(value.displayName);
        })}
        className={'flex flex-col space-y-4'}
      >
        <TextField>
          <TextField.Label>
            Display Name
            <TextField.Input
              {...displayNameControl}
              data-cy={'profile-display-name'}
              minLength={2}
              placeholder={''}
            />
          </TextField.Label>
        </TextField>

        <TextField>
          <TextField.Label>
            Email
            <TextField.Input disabled value={email} />
          </TextField.Label>

          <div>
            <Button
              type={'button'}
              variant={'ghost'}
              size={'small'}
              href={configuration.paths.settings.email}
            >
              <span className={'text-xs font-normal'}>Update Email</span>
            </Button>
          </div>
        </TextField>

        <div>
          <Button
            className={'w-full md:w-auto'}
            loading={updateProfileMutation.isMutating}
          >
            Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
}

function UploadProfileAvatarForm(props: {
  currentPhotoURL: string | null;
  userId: string;
  onAvatarUpdated: (url: string | null) => void;
}) {
  const client = useSupabase();

  const onValueChange = useCallback(
    async (file: File | null) => {
      const removeExistingStorageFile = () => {
        if (props.currentPhotoURL) {
          return (
            deleteProfilePhoto(client, props.currentPhotoURL) ??
            Promise.resolve()
          );
        }

        return Promise.resolve();
      };

      if (file) {
        const promise = removeExistingStorageFile().then(() =>
          uploadUserProfilePhoto(client, file, props.userId).then(
            (photoUrl) => {
              props.onAvatarUpdated(photoUrl);

              return client
                .from(USERS_TABLE)
                .update({
                  photo_url: photoUrl,
                })
                .eq('id', props.userId)
                .throwOnError();
            },
          ),
        );

        toast.promise(promise, {
          loading: `Updating avatar...`,
          success: `Avatar successfully updated`,
          error: `Error updating avatar`,
        });
      } else {
        const promise = removeExistingStorageFile().then(() => {
          props.onAvatarUpdated(null);

          return client
            .from(USERS_TABLE)
            .update({
              photo_url: null,
            })
            .eq('id', props.userId)
            .throwOnError();
        });

        toast.promise(promise, {
          loading: `Updating avatar...`,
          success: `Avatar successfully updated`,
          error: `Error updating avatar`,
        });
      }
    },
    [client, props],
  );

  return (
    <ImageUploader value={props.currentPhotoURL} onValueChange={onValueChange}>
      <div className={'flex flex-col space-y-1'}>
        <span className={'text-sm'}>Upload your avatar picture</span>

        <span className={'text-xs'}>
          Please choose an image to upload as your profile picture.
        </span>
      </div>
    </ImageUploader>
  );
}

async function uploadUserProfilePhoto(
  client: SupabaseClient,
  photoFile: File,
  userId: string,
) {
  const bytes = await photoFile.arrayBuffer();
  const bucket = client.storage.from('avatars');
  const extension = photoFile.name.split('.').pop();
  const fileName = await getAvatarFileName(userId, extension);

  const result = await bucket.upload(fileName, bytes, {
    upsert: true,
  });

  if (!result.error) {
    return bucket.getPublicUrl(fileName).data.publicUrl;
  }

  throw result.error;
}

function deleteProfilePhoto(client: SupabaseClient, url: string) {
  const bucket = client.storage.from('avatars');
  const fileName = url.split('/').pop()?.split('?')[0];

  if (!fileName) {
    return Promise.reject(new Error('Invalid file name'));
  }

  return bucket.remove([fileName]);
}

function RemovePhoneNumberButton({
  onSuccess,
}: React.PropsWithChildren<{
  onSuccess: () => void;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const unlinkProfileNumberMutation = useUnlinkProfilePhone();

  const onUnlinkPhoneNumber = useCallback(() => {
    const promise = unlinkProfileNumberMutation.trigger().then(() => {
      setIsModalOpen(false);
      onSuccess();
    });

    return toast.promise(promise, {
      loading: `Unlinking account...`,
      success: `Account successfully unlinked`,
      error: `Sorry, we couldn't unlink this account`,
    });
  }, [unlinkProfileNumberMutation, onSuccess]);

  return (
    <>
      <Button
        type={'button'}
        variant={'ghost'}
        size={'small'}
        onClick={() => setIsModalOpen(true)}
      >
        <span className={'text-xs font-normal'}>Remove Phone Number</span>
      </Button>

      <Modal
        heading={`Remove Phone Number`}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      >
        <div className={'flex flex-col space-y-2.5 text-sm'}>
          <div>
            You&apos;re about to remove your phone number. You will not be able
            to use it to login to your account.
          </div>

          <div>Are you sure you want to continue?</div>

          <AuthErrorMessage error={unlinkProfileNumberMutation.error} />

          <div className={'flex justify-end space-x-2'}>
            <Modal.CancelButton onClick={() => setIsModalOpen(false)} />

            <Button
              type={'button'}
              variant={'destructive'}
              loading={unlinkProfileNumberMutation.isMutating}
              onClick={onUnlinkPhoneNumber}
            >
              Yes, remove phone number
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function useUnlinkProfilePhone() {
  const client = useSupabase();
  const key = 'unlinkProfilePhone';

  return useMutation(key, async () => {
    return client.auth
      .updateUser({
        phone: undefined,
      })
      .then((response) => {
        if (response.error) {
          throw response.error;
        }

        return response.data;
      });
  });
}

async function getAvatarFileName(
  userId: string,
  extension: string | undefined,
) {
  const { nanoid } = await import('nanoid');
  const uniqueId = nanoid(16);

  return `${userId}.${extension}?v=${uniqueId}`;
}

export default UpdateProfileForm;
