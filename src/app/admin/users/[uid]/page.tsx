import { use } from 'react';
import Link from 'next/link';

import { ChevronRightIcon } from '@heroicons/react/24/outline';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import AdminHeader from '~/app/admin/components/AdminHeader';
import AdminGuard from '~/app/admin/components/AdminGuard';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';
import Heading from '~/core/ui/Heading';

import UserActionsDropdown from '~/app/admin/users/[uid]/components/UserActionsDropdown';

import Tile from '~/core/ui/Tile';
import Badge from '~/core/ui/Badge';
import Label from '~/core/ui/Label';
import { PageBody } from '~/core/ui/Page';

import configuration from '~/configuration';

interface Params {
  params: {
    uid: string;
  };
}

export const metadata = {
  title: `Manage User | ${configuration.site.siteName}`,
};

function AdminUserPage({ params }: Params) {
  const uid = params.uid;

  const { auth, user } = use(loadData(uid));
  const displayName = user?.displayName;
  const authUser = auth?.user;
  const email = authUser?.email;
  const phone = authUser?.phone;

  const isBanned = Boolean(
    authUser && 'banned_until' in authUser && authUser.banned_until !== 'none',
  );

  return (
    <>
      <AdminHeader>Manage User</AdminHeader>

      <PageBody>
        <div className={'flex flex-col space-y-6'}>
          <div className={'flex justify-between'}>
            <Breadcrumbs displayName={displayName ?? email ?? ''} />

            <div>
              <UserActionsDropdown uid={uid} isBanned={isBanned} />
            </div>
          </div>

          <Tile>
            <Heading type={4}>User Details</Heading>

            <div className={'flex space-x-2 items-center'}>
              <div>
                <Label>Status</Label>
              </div>

              <div className={'inline-flex'}>
                {isBanned ? (
                  <Badge size={'small'} color={'error'}>
                    Banned
                  </Badge>
                ) : (
                  <Badge size={'small'} color={'success'}>
                    Active
                  </Badge>
                )}
              </div>
            </div>

            <TextFieldLabel>
              Display name
              <TextFieldInput
                className={'max-w-sm'}
                defaultValue={displayName ?? ''}
                disabled
              />
            </TextFieldLabel>

            <TextFieldLabel>
              Email
              <TextFieldInput
                className={'max-w-sm'}
                defaultValue={email ?? ''}
                disabled
              />
            </TextFieldLabel>

            <TextFieldLabel>
              Phone number
              <TextFieldInput
                className={'max-w-sm'}
                defaultValue={phone ?? ''}
                disabled
              />
            </TextFieldLabel>
          </Tile>
        </div>
      </PageBody>
    </>
  );
}

export default AdminGuard(AdminUserPage);

async function loadData(uid: string) {
  const client = getSupabaseServerComponentClient({ admin: true });
  const authUser = client.auth.admin.getUserById(uid);

  const userData = client
    .from('users')
    .select(
      `
      id,
      displayName: display_name,
      photoURL: photo_url
  `,
    )
    .eq('id', uid)
    .single();

  const [auth, user] = await Promise.all([authUser, userData]);

  return {
    auth: auth.data,
    user: user.data,
  };
}

function Breadcrumbs(
  props: React.PropsWithChildren<{
    displayName: string;
  }>,
) {
  return (
    <div className={'flex space-x-1 items-center text-xs p-2'}>
      <Link href={'/admin'}>Admin</Link>
      <ChevronRightIcon className={'w-3'} />
      <Link href={'/admin/users'}>Users</Link>
      <ChevronRightIcon className={'w-3'} />
      <span>{props.displayName}</span>
    </div>
  );
}
