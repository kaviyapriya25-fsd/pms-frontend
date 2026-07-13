import { useState } from "react";
import "../../styles/settings.css";

function SettingsForm() {

  const [settings, setSettings] = useState({
    adminName: "Administrator",
    email: "admin@pms.com",
    password: "",
    confirmPassword: "",
    darkMode: false,
    emailNotification: true,
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    alert("Settings Saved Successfully");

  };

  return (

    <form
      className="settings-form"
      onSubmit={handleSubmit}
    >

      <div className="settings-card">

        <h2>Admin Profile</h2>

        <input
          type="text"
          name="adminName"
          value={settings.adminName}
          onChange={handleChange}
          placeholder="Admin Name"
        />

        <input
          type="email"
          name="email"
          value={settings.email}
          onChange={handleChange}
          placeholder="Email"
        />

      </div>

      <div className="settings-card">

        <h2>Change Password</h2>

        <input
          type="password"
          name="password"
          value={settings.password}
          onChange={handleChange}
          placeholder="New Password"
        />

        <input
          type="password"
          name="confirmPassword"
          value={settings.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />

      </div>

      <div className="settings-card">

        <h2>Preferences</h2>

        <label>

          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleChange}
          />

          Enable Dark Mode

        </label>

        <label>

          <input
            type="checkbox"
            name="emailNotification"
            checked={settings.emailNotification}
            onChange={handleChange}
          />

          Email Notifications

        </label>

      </div>

      <button
        className="save-btn"
        type="submit"
      >
        Save Settings
      </button>

    </form>

  );

}

export default SettingsForm;