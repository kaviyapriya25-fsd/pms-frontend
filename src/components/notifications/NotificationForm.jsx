import { useEffect, useState } from "react";
import "../../styles/notification.css";

function NotificationForm({
  onSave,
  selectedNotification,
  onCancel,
}) {

  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "Info",
    time: "",
    read: false,
  });

  useEffect(() => {
    if (selectedNotification) {
      setNotification(selectedNotification);
    }
  }, [selectedNotification]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNotification({
      ...notification,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave(notification);

    setNotification({
      title: "",
      message: "",
      type: "Info",
      time: "",
      read: false,
    });
  };

  return (

    <div className="notification-form-container">

      <h2>
        {selectedNotification
          ? "Edit Notification"
          : "Add Notification"}
      </h2>

      <form
        className="notification-form"
        onSubmit={handleSubmit}
      >

        <input
          name="title"
          placeholder="Title"
          value={notification.title}
          onChange={handleChange}
          required
        />

        <input
          name="message"
          placeholder="Message"
          value={notification.message}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={notification.type}
          onChange={handleChange}
        >
          <option>Info</option>
          <option>Success</option>
          <option>Warning</option>
          <option>Error</option>
        </select>

        <input
          type="datetime-local"
          name="time"
          value={notification.time}
          onChange={handleChange}
        />

        <label>

          <input
            type="checkbox"
            name="read"
            checked={notification.read}
            onChange={handleChange}
          />

          Read

        </label>

        <div className="form-buttons">

          <button type="submit">
            {selectedNotification ? "Update" : "Save"}
          </button>

          {selectedNotification && (

            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>

          )}

        </div>

      </form>

    </div>

  );

}

export default NotificationForm;