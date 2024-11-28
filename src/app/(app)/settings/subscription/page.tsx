import Plans from './components/Plans';
import PlansStatusAlertContainer from './components/PlanStatusAlertContainer';
import { Section, SectionBody, SectionHeader } from '~/core/ui/Section';

export const metadata = {
  title: 'Subscription',
};

const SubscriptionSettingsPage = () => {
  return (
    <Section className={'border-transparent'}>
      <SectionHeader
        className={'!p-0'}
        title={'Subscription'}
        description={'Manage your Subscription and Billing'}
      />

      <SectionBody className={'space-y-4 !px-0'}>
        <PlansStatusAlertContainer />

        <Plans />
      </SectionBody>
    </Section>
  );
};

export default SubscriptionSettingsPage;
