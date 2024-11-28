import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import AppHeader from '~/app/(app)/components/AppHeader';
import { PageBody } from '~/core/ui/Page';

const links = [
  {
    path: '/settings/profile',
    label: `Profile`,
  },
  {
    path: '/settings/subscription',
    label: 'Subscription',
  },
];

async function SettingsLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <AppHeader
        title={'Settings'}
        description={'Manage your settings and preferences.'}
      />

      <PageBody>
        <NavigationMenu bordered>
          {links.map((link) => (
            <NavigationItem
              className={'flex-1 lg:flex-none'}
              link={link}
              key={link.path}
            />
          ))}
        </NavigationMenu>

        <div
          className={`mt-4 flex h-full flex-col space-y-4 lg:mt-6 lg:flex-row lg:space-x-8 lg:space-y-0`}
        >
          {children}
        </div>
      </PageBody>
    </>
  );
}

export default SettingsLayout;
