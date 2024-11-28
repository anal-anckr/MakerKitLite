'use client';

import { useCallback, useContext } from 'react';

import UserSessionContext from '~/core/session/contexts/user-session';
import useUserSession from '~/core/hooks/use-user-session';
import UserData from '~/core/session/types/user-data';
import UpdateProfileForm from './UpdateProfileForm';
import SettingsTile from '../../components/SettingsTile';
import UpdatePhoneNumberForm from '../components/UpdatePhoneNumberForm';
import If from '~/core/ui/If';

import { refreshSessionAction } from '../actions';

import configuration from '~/configuration';
import ProfileDangerZone from '~/app/(app)/settings/profile/components/ProfileDangerZone';

function UpdateProfileFormContainer() {
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const session = useUserSession();

  const onUpdateProfileData = useCallback(
    (data: Partial<UserData>) => {
      const userRecordData = userSession?.data;

      if (userRecordData) {
        setUserSession({
          ...userSession,
          data: {
            ...userRecordData,
            ...data,
          },
        });
      }
    },
    [setUserSession, userSession],
  );

  if (!session) {
    return null;
  }

  return (
    <div className={'flex flex-col space-y-8'}>
      <SettingsTile
        heading={`My Details`}
        subHeading={`Manage your profile details`}
      >
        <UpdateProfileForm
          session={session}
          onUpdateProfileData={onUpdateProfileData}
        />
      </SettingsTile>

      <If condition={configuration.auth.providers.phoneNumber}>
        <SettingsTile
          heading={`Phone Number`}
          subHeading={`Manage your phone number`}
        >
          <UpdatePhoneNumberForm
            session={session}
            onUpdate={async () => {
              await refreshSessionAction();
            }}
          />
        </SettingsTile>
      </If>

      <If condition={configuration.features.enableAccountDeletion}>
        <SettingsTile
          heading={`Danger Zone`}
          subHeading={`Delete your account`}
        >
          <ProfileDangerZone />
        </SettingsTile>
      </If>
    </div>
  );
}

export default UpdateProfileFormContainer;
