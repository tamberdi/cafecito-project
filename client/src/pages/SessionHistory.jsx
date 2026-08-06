import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function SessionHistory() {
  const [searchParams] = useSearchParams();
  const partnershipId = searchParams.get("partnershipId");

  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");

  const [sessionDate, setSessionDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!partnershipId) return;
    loadSessions();
  }, [partnershipId]);

  function loadSessions() {
    apiFetch(`/sessions/partnership/${partnershipId}`)
      .then(setSessions)
      .catch(() => setError("Could not load sessions."));
  }

  async function handleAddSession(e) {
  e.preventDefault();
  setError("");

  try {
    const created = await apiFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({
        partnershipId: parseInt(partnershipId),
        sessionDate,
        durationMinutes: parseInt(durationMinutes),
        notes,
      }),
    });
    setSessions([...sessions, created]);
    setSessionDate("");
    setDurationMinutes("");
    setNotes("");
  } catch (err) {
    setError(err.message);
  }
}

  async function handleDelete(id) {
    try {
      await apiFetch(`/sessions/${id}`, { method: "DELETE" });
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (err) {
      setError("Could not delete session.");
    }
  }

  if (!partnershipId) {
    return <div className="p-8">Add ?partnershipId=X to the URL to view session history.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Session History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex flex-col gap-3 mb-8">
        {sessions.map((s) => (
          <div key={s.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{s.sessionDate}</span>
              <button onClick={() => handleDelete(s.id)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600">{s.durationMinutes} minutes</p>
            {s.notes && <p className="text-sm text-gray-500 mt-1">{s.notes}</p>}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Log a Session</h2>
      <form onSubmit={handleAddSession} className="flex flex-col gap-2">
        <input
          type="date"
          value={sessionDate}
          onChange={(e) => setSessionDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Save Session
        </button>
      </form>
    </div>
  );
}

export default SessionHistory;