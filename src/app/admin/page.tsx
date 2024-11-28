import { use } from 'react';

import AdminHeader from '~/app/admin/components/AdminHeader';
import AdminGuard from '~/app/admin/components/AdminGuard';
import AdminDashboard from '~/app/admin/components/AdminDashboard';
import getSupabaseServerComponentClient from '~/core/supabase/server-component-client';
import { PageBody } from '~/core/ui/Page';

import configuration from '~/configuration';

export const metadata = {
  title: `Admin | ${configuration.site.siteName}`,
};

function AdminPage() {
  const data = use(loadData());

  return (
    <>
      <AdminHeader>Admin</AdminHeader>

      <PageBody>
        <AdminDashboard data={data} />
      </PageBody>
    </>
  );
}

export default AdminGuard(AdminPage);

async function loadData() {
  const client = getSupabaseServerComponentClient({ admin: true });

  const { count: usersCount } = await client.from('users').select('*', {
    count: 'exact',
    head: true,
  });

  const { count: activeSubscriptions } = await client
    .from('subscriptions')
    .select(`*`, {
      count: 'exact',
      head: true,
    })
    .eq('status', 'active');

  const { count: trialSubscriptions } = await client
    .from('subscriptions')
    .select(`*`, {
      count: 'exact',
      head: true,
    })
    .eq('status', 'trialing');

  return {
    usersCount: usersCount || 0,
    activeSubscriptions: activeSubscriptions || 0,
    trialSubscriptions: trialSubscriptions || 0,
  };
}
