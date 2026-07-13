import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import NotificationForm from "../../components/notifications/NotificationForm";

import {
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification,
} from "../../services/notificationService";

import "../../styles/notification.css";

function Notifications() {

  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {

      const data = await getNotifications();

      setNotifications(data);

    } catch {

      toast.error("Failed to load notifications");

    }
  };

  const handleSave = async (notification) => {

    try {

      if (selectedNotification) {

        await updateNotification(selectedNotification.id, notification);

        toast.success("Notification Updated");

      } else {

        await addNotification(notification);

        toast.success("Notification Added");

      }

      setSelectedNotification(null);

      setShowForm(false);

      loadNotifications();

    } catch {

      toast.error("Operation Failed");

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Notification?")) return;

    try {

      await deleteNotification(id);

      toast.success("Notification Deleted");

      loadNotifications();

    } catch {

      toast.error("Delete Failed");

    }

  };

  const filteredNotifications = notifications.filter((n) => {

    const keyword = search.toLowerCase();

    return (

      n.title?.toLowerCase().includes(keyword) ||

      n.message?.toLowerCase().includes(keyword) ||

      n.type?.toLowerCase().includes(keyword)

    );

  });

  return (

    <DashboardLayout>

      <div className="notifications-page">

        <div className="notifications-header">

          <h1>Notifications</h1>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedNotification(null);
              setShowForm(true);
            }}
          >
            + Add Notification
          </button>

        </div>

        <div className="notification-stats">

          <div className="stat-card">

            <h3>{notifications.length}</h3>

            <p>Total</p>

          </div>

          <div className="stat-card active-card">

            <h3>

              {notifications.filter(n => !n.read).length}

            </h3>

            <p>Unread</p>

          </div>

          <div className="stat-card completed-card">

            <h3>

              {notifications.filter(n => n.read).length}

            </h3>

            <p>Read</p>

          </div>

        </div>

        <input
          className="search-box"
          placeholder="Search Notification..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showForm && (

          <NotificationForm

            onSave={handleSave}

            selectedNotification={selectedNotification}

            onCancel={() => {

              setSelectedNotification(null);

              setShowForm(false);

            }}

          />

        )}

        <table className="notification-table">

          <thead>

            <tr>

              <th>ID</th>

              <th>Title</th>

              <th>Message</th>

              <th>Type</th>

              <th>Time</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredNotifications.length > 0 ? (

              filteredNotifications.map((notification) => (

                <tr key={notification.id}>

                  <td>{notification.id}</td>

                  <td>{notification.title}</td>

                  <td>{notification.message}</td>

                  <td>{notification.type}</td>

                  <td>{notification.time}</td>

                  <td>

                    <span
                      className={
                        notification.read
                          ? "completed"
                          : "pending"
                      }
                    >

                      {notification.read ? "Read" : "Unread"}

                    </span>

                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedNotification(notification);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(notification.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >

                  No Notifications Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}

export default Notifications;