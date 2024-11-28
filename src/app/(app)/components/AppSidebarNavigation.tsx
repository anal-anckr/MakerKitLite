'use client';

import { SidebarItem, SidebarDivider, SidebarGroup } from '~/core/ui/Sidebar';

import NAVIGATION_CONFIG from '~/navigation.config';

function AppSidebarNavigation() {
  return (
    <>
      {NAVIGATION_CONFIG.items.map((item, index) => {
        if ('divider' in item) {
          return <SidebarDivider key={index} />;
        }

        if ('children' in item) {
          return (
            <SidebarGroup
              key={item.label}
              label={item.label}
              collapsible={item.collapsible}
              collapsed={item.collapsed}
            >
              {item.children.map((child) => {
                return (
                  <SidebarItem
                    key={child.path}
                    end={child.end}
                    path={child.path}
                    Icon={child.Icon}
                  >
                    {child.label}
                  </SidebarItem>
                );
              })}
            </SidebarGroup>
          );
        }

        return (
          <SidebarItem
            key={item.path}
            end={item.end}
            path={item.path}
            Icon={item.Icon}
          >
            {item.label}
          </SidebarItem>
        );
      })}
    </>
  );
}

export default AppSidebarNavigation;
