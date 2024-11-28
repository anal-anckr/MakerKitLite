'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import useCollapsible from '~/core/hooks/use-sidebar-state';
import AppSidebar from '~/app/(app)/components/AppSidebar';
import Toaster from '~/components/Toaster';
import SentryBrowserWrapper from '~/components/SentryProvider';
import UserSession from '~/core/session/types/user-session';

import CsrfTokenContext from '~/lib/contexts/csrf';
import SidebarContext from '~/lib/contexts/sidebar';
import UserSessionContext from '~/core/session/contexts/user-session';
import AuthChangeListener from '~/components/AuthChangeListener';
import type loadAppData from '~/lib/server/loaders/load-app-data';

const RouteShell: React.FCC<{
  data: Awaited<ReturnType<typeof loadAppData>>;
}> = ({ data, children }) => {
  const userSessionContext: UserSession = useMemo(() => {
    return {
      auth: data.auth,
      subscription: data.subscription,
      customerId: data.customerId,
      data: data.user ?? undefined,
    };
  }, [data]);

  const [userSession, setUserSession] =
    useState<Maybe<UserSession>>(userSessionContext);

  const updateCurrentUser = useCallback(() => {
    if (userSessionContext.auth) {
      setUserSession(userSessionContext);
    }
  }, [userSessionContext]);

  useEffect(updateCurrentUser, [updateCurrentUser]);

  return (
    <SentryBrowserWrapper>
      <UserSessionContext.Provider value={{ userSession, setUserSession }}>
        <CsrfTokenContext.Provider value={data.csrfToken}>
          <AuthChangeListener
            accessToken={data.auth?.accessToken}
            whenSignedOut={'/'}
          >
            <main>
              <Toaster richColors={false} />

              <RouteShellWithSidebar
                collapsed={data.ui.sidebarState === 'collapsed'}
              >
                {children}
              </RouteShellWithSidebar>
            </main>
          </AuthChangeListener>
        </CsrfTokenContext.Provider>
      </UserSessionContext.Provider>
    </SentryBrowserWrapper>
  );
};

export default RouteShell;

function RouteShellWithSidebar(
  props: React.PropsWithChildren<{
    collapsed: boolean;
  }>,
) {
  const [collapsed, setCollapsed] = useCollapsible(props.collapsed);

  return (
    <div className={'flex h-full flex-1 overflow-hidden'}>
      <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div className={'hidden lg:block'}>
          <AppSidebar />
        </div>

        <div
          className={
            'relative mx-auto h-screen w-full overflow-y-auto' +
            ' flex flex-col flex-1'
          }
        >
          {props.children}
        </div>
      </SidebarContext.Provider>
    </div>
  );
}
