import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { type UserDto, fetchAllUsers, assignRole, removeRole } from "../../../api/users";

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const data = await fetchAllUsers();
        setUsers(data);
      } catch {
        Swal.fire({
          icon: "error",
          title: "Failed to load users",
          background: "#1a1a2e",
          color: "#fff",
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    void loadUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
    try {
      if (currentlyAdmin) {
        await removeRole(userId, "Admin");
      } else {
        await assignRole(userId, "Admin");
      }
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const newRoles = currentlyAdmin
              ? u.roles.filter((r) => r !== "Admin")
              : [...u.roles, "Admin"];
            return { ...u, roles: newRoles };
          }
          return u;
        })
      );
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Role updated!",
        showConfirmButton: false,
        timer: 1500,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update role",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  return (
    <div className="admin-dashboard__section">
      <div className="admin-dashboard__header">
        <h1>User Management</h1>
      </div>
      {loadingUsers ? (
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="admin-dashboard__table-container">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.roles.includes("Admin");
                return (
                  <tr key={u.id}>
                    <td>{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="admin-dashboard__badge">
                        {isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`admin-dashboard__action-button ${isAdmin
                            ? "admin-dashboard__action-button--delete"
                            : "admin-dashboard__action-button--edit"
                          }`}
                        onClick={() => handleToggleAdmin(u.id, isAdmin)}
                      >
                        {isAdmin ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
