import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TeamLeaderForm from "../../components/forms/TeamLeaderForm";

import {
  getTeamLeaders,
  addTeamLeader,
  updateTeamLeader,
  deleteTeamLeader,
} from "../../services/teamLeaderService";

import "./teamleader.css";

function TeamLeaders() {

  const [leaders, setLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTeamLeaders();
  }, []);

  const loadTeamLeaders = async () => {
    try {

      const data = await getTeamLeaders();

      console.log("Team Leaders:", data);

      setLeaders(data);

    } catch (error) {

      console.log(error);

      toast.error("Failed to load Team Leaders");

    }
  };

  const handleSave = async (leader) => {

    try {

      if (selectedLeader) {

        await updateTeamLeader(selectedLeader.id, leader);

        toast.success("Team Leader Updated Successfully");

      } else {

        await addTeamLeader(leader);

        toast.success("Team Leader Added Successfully");

      }

      setSelectedLeader(null);
      setShowForm(false);

      loadTeamLeaders();

    } catch {

      toast.error("Operation Failed");

    }

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete Team Leader?")) return;

    try {

      await deleteTeamLeader(id);

      toast.success("Team Leader Deleted");

      loadTeamLeaders();

    } catch {

      toast.error("Delete Failed");

    }

  };

  const filteredLeaders = leaders.filter((leader) => {

    const keyword = search.toLowerCase();

    return (

      leader.name?.toLowerCase().includes(keyword) ||

      leader.email?.toLowerCase().includes(keyword) ||

      leader.department?.toLowerCase().includes(keyword) ||

      leader.project?.toLowerCase().includes(keyword)

    );

  });

  return (

    <DashboardLayout>

      <div className="employees-page">

        <div className="employees-header">

          <h1>Team Leaders</h1>

          <button
            className="add-btn"
            onClick={() => {
              setSelectedLeader(null);
              setShowForm(true);
            }}
          >
            + Add Team Leader
          </button>

        </div>

        <div className="employee-stats">

          <div className="stat-card">

            <h3>{leaders.length}</h3>

            <p>Total Leaders</p>

          </div>

          <div className="stat-card active-card">

            <h3>

              {leaders.filter((l) => l.status === "Active").length}

            </h3>

            <p>Active</p>

          </div>

          <div className="stat-card pending-card">

            <h3>

              {leaders.filter((l) => l.status === "Inactive").length}

            </h3>

            <p>Inactive</p>

          </div>

        </div>

        <input
          className="search-box"
          placeholder="Search Team Leader..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {showForm && (

          <TeamLeaderForm
            onSave={handleSave}
            selectedLeader={selectedLeader}
            onCancel={() => {
              setSelectedLeader(null);
              setShowForm(false);
            }}
          />

        )}

        <table className="employee-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Project</th>
              <th>Status</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredLeaders.length > 0 ? (

              filteredLeaders.map((leader) => (

                <tr key={leader.id}>

                  <td>{leader.id}</td>

                  <td>{leader.name}</td>

                  <td>{leader.email}</td>

                  <td>{leader.phone}</td>

                  <td>{leader.department}</td>

                  <td>{leader.project}</td>

                  <td>

                    <span className={leader.status.toLowerCase()}>

                      {leader.status}

                    </span>

                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedLeader(leader);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(leader.id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="8" style={{ textAlign: "center" }}>

                  No Team Leaders Found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>

  );

}

export default TeamLeaders;