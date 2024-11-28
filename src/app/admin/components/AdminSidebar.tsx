'use client';

import { HomeIcon, UserIcon } from '@heroicons/react/24/outline';
import Sidebar, { SidebarContent, SidebarItem } from '~/core/ui/Sidebar';
import Logo from '~/core/ui/Logo';

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent className={'pt-6 pb-4'}>
        <Logo href={'/admin'} />
      </SidebarContent>

      <SidebarContent>
        <SidebarItem
          end
          path={'/admin'}
          Icon={() => <HomeIcon className={'h-6'} />}
        >
          Admin
        </SidebarItem>

        <SidebarItem
          path={'/admin/users'}
          Icon={() => <UserIcon className={'h-6'} />}
        >
          Users
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}

export default AdminSidebar;
