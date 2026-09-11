import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useUser } from "../context/UserContext";

function DemoUserSwitcher() {
  const { userId, setUserId } = useUser();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch("/users").then(setUsers).catch(() => {});
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setUserId(value ? parseInt(value) : null);
  }

  return (
    <div className="fixed top-2 right-2 z-50 bg-yellow-100 border border-yellow-400 rounded p-2 text-xs">
      <label className="font-medium mr-2">Demo as:</label>
      <select
        value={userId || ""}
        onChange={handleChange}
        className="border rounded p-1 text-xs"
      >
        <option value="">— none —</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
    </div>
  );
}

export default DemoUserSwitcher;