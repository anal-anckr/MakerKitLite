import loadDynamic from 'next/dynamic';
import AppHeader from '~/app/(app)/components/AppHeader';
import { PageBody } from '~/core/ui/Page';

const DashboardDemo = loadDynamic(
  () => import('~/app/(app)/components/DashboardDemo'),
  {
    ssr: false,
  },
);

export const metadata = {
  title: 'Dashboard',
};

function DashboardPage() {
  return (
    <>
      <AppHeader
        title={'Dashboard'}
        description={
          "An overview of your organization's activity and performance across all your projects."
        }
      />

      <PageBody>
        <DashboardDemo />
      </PageBody>
    </>
  );
}

export default DashboardPage;
