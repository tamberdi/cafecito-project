import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function Profile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadUser();
  }, [userId]);

  function loadUser() {
    apiFetch(`/users/${userId}`)
      .then((data) => {
        setUser(data);
        setName(data.name);
        setTimezone(data.timezone || "");
      })
      .catch(() => setError("Could not load profile."));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updated = await apiFetch(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, timezone }),
      });
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      setError("Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName(user.name);
    setTimezone(user.timezone || "");
    setIsEditing(false);
  }

  if (error && !user) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">Loading...</div>;

  if (isEditing) {
    return (
      <div className="max-w-md mx-auto mt-16 p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            placeholder="Name"
          />
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="border p-2 rounded"
            placeholder="Timezone"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white p-2 rounded flex-1"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border p-2 rounded flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-gray-600">{user.timezone}</p>
      <p className="text-sm text-gray-400 mt-4">
        Member since {new Date(user.joinedAt).toLocaleDateString()}
      </p>
      <button
        onClick={() => setIsEditing(true)}
        className="mt-6 border p-2 rounded w-full"
      >
        Edit Profile
      </button>
    </div>
  );
}

export default Profile;