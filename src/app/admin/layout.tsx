import { use } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import isUserSuperAdmin from '~/app/admin/utils/is-user-super-admin';
import AdminSidebar from '~/app/admin/components/AdminSidebar';
import AdminProviders from '~/app/admin/components/AdminProviders';
import { Page } from '~/core/ui/Page';

function AdminLayout({ children }: React.PropsWithChildren) {
  const isAdmin = use(isUserSuperAdmin());

  if (!isAdmin) {
    redirect('/');
  }

  const csrfToken = headers().get('X-CSRF-Token');

  return (
    <AdminProviders csrfToken={csrfToken}>
      <Page sidebar={<AdminSidebar />}>{children}</Page>
    </AdminProviders>
  );
}

export default AdminLayout;
