'use client';

import React, { useMemo } from 'react';

import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import MobileNavigationDropdown from '~/core/ui/MobileNavigationDropdown';

import useUser from '~/core/hooks/use-user';

const BASE_PATH = `/settings/profile`;

const links = {
  General: {
    path: BASE_PATH,
    label: 'General',
  },
  Authentication: {
    path: [BASE_PATH, `authentication`].join('/'),
    label: 'Authentication',
  },
  Email: {
    path: [BASE_PATH, `email`].join('/'),
    label: 'Email',
  },
  Password: {
    path: [BASE_PATH, `password`].join('/'),
    label: 'Password',
  },
};

const itemClassName = `flex justify-center lg:justify-start items-center w-full`;

const ProfileSettingsTabs: React.FC = () => {
  const canEditPassword = useCanUpdatePassword();

  return (
    <>
      <div className={'hidden min-w-[12rem] lg:flex'}>
        <NavigationMenu vertical pill>
          <NavigationItem
            depth={0}
            className={itemClassName}
            link={links.General}
          />

          <NavigationItem
            className={itemClassName}
            link={links.Authentication}
          />

          <NavigationItem
            className={itemClassName}
            disabled={!canEditPassword}
            link={links.Email}
          />

          <NavigationItem
            className={itemClassName}
            disabled={!canEditPassword}
            link={links.Password}
          />
        </NavigationMenu>
      </div>

      <div className={'block w-full lg:hidden'}>
        <MobileNavigationDropdown links={Object.values(links)} />
      </div>
    </>
  );
};

export default ProfileSettingsTabs;

function useCanUpdatePassword() {
  const { data: user } = useUser();

  // user can only edit email and password
  // if they signed up with the EmailAuthProvider provider
  return useMemo(() => {
    if (!user) {
      return false;
    }

    const emailProviderId = 'email';
    const identities = user.identities ?? [];

    return identities.some((identity) => {
      return identity.provider === emailProviderId;
    });
  }, [user]);
}
