import DashboardLayout from "../../components/layout/DashboardLayout";
import SettingsForm from "../../components/settings/SettingsForm";
import "../../styles/settings.css";

function Settings() {

  return (

    <DashboardLayout>

      <div className="settings-page">

        <h1>Settings</h1>

        <SettingsForm />

      </div>

    </DashboardLayout>

  );

}

export default Settings;