import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useUser } from "../context/UserContext";

const LEVELS = ["beginner", "intermediate", "advanced", "fluent"];

function Profile() {
  const { userId } = useUser();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [saving, setSaving] = useState(false);

  const [languages, setLanguages] = useState([]);
  const [newLang, setNewLang] = useState("");
  const [newLevel, setNewLevel] = useState("beginner");
  const [newIsNative, setNewIsNative] = useState(false);
  const [langError, setLangError] = useState("");

  const [editingLangId, setEditingLangId] = useState(null);
  const [editLevel, setEditLevel] = useState("");
  const [editIsNative, setEditIsNative] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadUser();
    loadLanguages();
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

  function loadLanguages() {
    apiFetch(`/languages/user/${userId}`)
      .then(setLanguages)
      .catch(() => setLangError("Could not load languages."));
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

  async function handleAddLanguage(e) {
    e.preventDefault();
    setLangError("");
    if (!newLang.trim()) return;

    try {
      const created = await apiFetch("/languages", {
        method: "POST",
        body: JSON.stringify({
          userId: parseInt(userId),
          language: newLang,
          level: newLevel,
          isNative: newIsNative,
        }),
      });
      setLanguages([...languages, created]);
      setNewLang("");
      setNewLevel("beginner");
      setNewIsNative(false);
    } catch (err) {
      setLangError("Could not add language.");
    }
  }

  async function handleDeleteLanguage(id) {
    try {
      await apiFetch(`/languages/${id}`, { method: "DELETE" });
      setLanguages(languages.filter((l) => l.id !== id));
    } catch (err) {
      setLangError("Could not remove language.");
    }
  }

  function startEditLanguage(lang) {
    setEditingLangId(lang.id);
    setEditLevel(lang.level);
    setEditIsNative(lang.isNative);
  }

  async function handleSaveLanguage(id) {
    setLangError("");
    try {
      const updated = await apiFetch(`/languages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ level: editLevel, isNative: editIsNative }),
      });
      setLanguages(languages.map((l) => (l.id === id ? updated : l)));
      setEditingLangId(null);
    } catch (err) {
      setLangError("Could not update language.");
    }
  }

  if (error && !user) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-4 mb-8">
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
            <button type="submit" disabled={saving} className="bg-blue-600 text-white p-2 rounded flex-1">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={handleCancel} className="border p-2 rounded flex-1">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.timezone}</p>
          <p className="text-sm text-gray-400 mt-4">
            Member since {new Date(user.joinedAt).toLocaleDateString()}
          </p>
          <button onClick={() => setIsEditing(true)} className="mt-6 border p-2 rounded w-full">
            Edit Profile
          </button>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-3">Languages</h2>

        {langError && <p className="text-red-600 text-sm mb-2">{langError}</p>}

        <div className="flex flex-col gap-2 mb-4">
          {languages.map((lang) =>
            editingLangId === lang.id ? (
              <div key={lang.id} className="border p-2 rounded flex flex-col gap-2">
                <span className="font-medium">{lang.language}</span>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(e.target.value)}
                  className="border p-2 rounded"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editIsNative}
                    onChange={(e) => setEditIsNative(e.target.checked)}
                  />
                  Native language
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveLanguage(lang.id)}
                    className="bg-blue-600 text-white p-2 rounded flex-1 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingLangId(null)}
                    className="border p-2 rounded flex-1 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div key={lang.id} className="flex justify-between items-center border p-2 rounded">
                <span>
                  {lang.language} — {lang.level} {lang.isNative && "(native)"}
                </span>
                <div className="flex gap-3">
                  <button onClick={() => startEditLanguage(lang)} className="text-blue-600 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteLanguage(lang.id)} className="text-red-600 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        <form onSubmit={handleAddLanguage} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Language"
            value={newLang}
            onChange={(e) => setNewLang(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            className="border p-2 rounded"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={newIsNative}
              onChange={(e) => setNewIsNative(e.target.checked)}
            />
            Native language
          </label>
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Add Language
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;