import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { userId } = useUser();
  const [partnerships, setPartnerships] = useState([]);
  const [streaks, setStreaks] = useState({});
  const [error, setError] = useState("");

  const [modalPartnershipId, setModalPartnershipId] = useState(null);
  const [sessionDate, setSessionDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");
  const [modalError, setModalError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    loadPartnerships();
  }, [userId]);

  async function loadPartnerships() {
    try {
      const data = await apiFetch(`/partnerships/user/${userId}`);
      setPartnerships(data);

      const streakEntries = await Promise.all(
        data.map(async (p) => {
          const result = await apiFetch(`/partnerships/${p.id}/streak`);
          return [p.id, result.streak];
        })
      );
      setStreaks(Object.fromEntries(streakEntries));
    } catch (err) {
      setError("Could not load partnerships.");
    }
  }

  async function updateStatus(id, status) {
    try {
      await apiFetch(`/partnerships/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadPartnerships();
    } catch (err) {
      setError("Could not update partnership.");
    }
  }

  function openModal(partnershipId) {
    setModalPartnershipId(partnershipId);
    setSessionDate("");
    setDurationMinutes("");
    setNotes("");
    setModalError("");
  }

  function closeModal() {
    setModalPartnershipId(null);
  }

  async function handleLogSession(e) {
    e.preventDefault();
    setModalError("");
    setSaving(true);

    try {
      await apiFetch("/sessions", {
        method: "POST",
        body: JSON.stringify({
          partnershipId: modalPartnershipId,
          sessionDate,
          durationMinutes: parseInt(durationMinutes),
          notes,
        }),
      });
      closeModal();
      loadPartnerships();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!userId) return <div className="p-8">Add ?userId=YOUR_ID to the URL to view your dashboard.</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Partnerships</h1>

      {partnerships.length === 0 && <p className="text-gray-500">No partnerships yet.</p>}

      <div className="flex flex-col gap-3">
        {partnerships.map((p) => {
          const otherUserId = p.userAId === parseInt(userId) ? p.userBId : p.userAId;
          const isRecipient = p.userBId === parseInt(userId);
          const streak = streaks[p.id] ?? "...";

          return (
            <div key={p.id} className="border p-4 rounded flex justify-between items-start">
              <div>
                <p className="font-medium">Partner: User #{otherUserId}</p>
                <p className="text-sm text-gray-500">Status: {p.status}</p>

                {p.status === "pending" && isRecipient && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => updateStatus(p.id, "active")}
                      className="bg-blue-600 text-white text-sm p-2 rounded flex-1"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(p.id, "declined")}
                      className="border text-sm p-2 rounded flex-1"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {p.status === "active" && (
                  <div className="flex gap-3 mt-2 items-center">
                    <button
                      onClick={() => openModal(p.id)}
                      className="bg-blue-600 text-white text-sm p-2 rounded"
                    >
                      + Log session
                    </button>
                    <Link to={`/sessions?partnershipId=${p.id}`} className="text-blue-600 text-sm">
                      View history
                    </Link>
                    <button
                      onClick={() => updateStatus(p.id, "ended")}
                      className="text-red-600 text-sm"
                    >
                      End Partnership
                    </button>
                  </div>
                )}
              </div>

              {p.status === "active" && (
                <div className="text-right">
                  <p className="text-xl font-bold">{streak}</p>
                  <p className="text-xs text-gray-500">day streak</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {modalPartnershipId && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-lg p-6 pb-20 sm:pb-6 w-full sm:max-w-sm">
          <div className="w-9 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden"></div>
            <h2 className="text-lg font-bold mb-4">Log a session</h2>
            <form onSubmit={handleLogSession} className="flex flex-col gap-3">
              <input
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="border p-2 rounded"
                required
              />
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="border p-2 rounded"
              />
              {modalError && <p className="text-red-600 text-sm">{modalError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white p-2 rounded flex-1"
                >
                  {saving ? "Saving..." : "Save session"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="border p-2 rounded flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;