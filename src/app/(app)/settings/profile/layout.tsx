import ProfileSettingsTabs from './components/ProfileSettingsTabs';
import SettingsContentContainer from '../components/SettingsContentContainer';

function ProfileSettingsLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div>
        <ProfileSettingsTabs />
      </div>

      <SettingsContentContainer>{children}</SettingsContentContainer>
    </>
  );
}

export default ProfileSettingsLayout;
