import loadAppData from '~/lib/server/loaders/load-app-data';
import AppRouteShell from '~/app/(app)/components/AppRouteShell';

async function AppLayout({ children }: React.PropsWithChildren) {
  const data = await loadAppData();

  return <AppRouteShell data={data}>{children}</AppRouteShell>;
}

export default AppLayout;
