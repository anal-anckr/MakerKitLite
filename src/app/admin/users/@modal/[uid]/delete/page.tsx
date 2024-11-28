import { use } from 'react';

import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import AdminGuard from '~/app/admin/components/AdminGuard';
import DeleteUserModal from '../components/DeleteUserModal';

interface Params {
  params: {
    uid: string;
  };
}

function DeleteUserModalPage({ params }: Params) {
  const client = getSupabaseServerComponentClient({ admin: true });
  const { data, error } = use(client.auth.admin.getUserById(params.uid));

  if (!data || error) {
    throw new Error(`User not found`);
  }

  const user = data.user;

  return <DeleteUserModal user={user} />;
}

export default AdminGuard(DeleteUserModalPage);
