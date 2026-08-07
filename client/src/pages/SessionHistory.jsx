import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function SessionHistory() {
  const [searchParams] = useSearchParams();
  const partnershipId = searchParams.get("partnershipId");

  const [sessions, setSessions] = useState([]);
  const [sessionTopics, setSessionTopics] = useState({});
  const [allTopics, setAllTopics] = useState([]);
  const [error, setError] = useState("");

  const [sessionDate, setSessionDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [notes, setNotes] = useState("");

  const [topicInput, setTopicInput] = useState({});
  const [filterTopic, setFilterTopic] = useState("");

  useEffect(() => {
    if (!partnershipId) return;
    loadSessions();
    apiFetch("/topics").then(setAllTopics).catch(() => {});
  }, [partnershipId]);

  async function loadSessions() {
    try {
      const data = await apiFetch(`/sessions/partnership/${partnershipId}`);
      setSessions(data);

      const topicEntries = await Promise.all(
        data.map(async (s) => {
          const topics = await apiFetch(`/topics/session/${s.id}`);
          return [s.id, topics];
        })
      );
      setSessionTopics(Object.fromEntries(topicEntries));
    } catch (err) {
      setError("Could not load sessions.");
    }
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
      setSessionTopics({ ...sessionTopics, [created.id]: [] });
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

  async function handleAddTopic(sessionId) {
    const name = topicInput[sessionId];
    if (!name || !name.trim()) return;

    try {
      const topic = await apiFetch("/topics", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });
      const tag = await apiFetch("/topics/tag", {
        method: "POST",
        body: JSON.stringify({ sessionId, topicId: topic.id }),
      });
      setSessionTopics({
        ...sessionTopics,
        [sessionId]: [...(sessionTopics[sessionId] || []), { ...tag, topicId: topic.id, name: topic.name, category: topic.category }],
      });
      setTopicInput({ ...topicInput, [sessionId]: "" });

      if (!allTopics.find((t) => t.id === topic.id)) {
        setAllTopics([...allTopics, topic]);
      }
    } catch (err) {
      setError("Could not add topic.");
    }
  }

  async function handleRemoveTopic(sessionId, tagId) {
    try {
      await apiFetch(`/topics/tag/${tagId}`, { method: "DELETE" });
      setSessionTopics({
        ...sessionTopics,
        [sessionId]: sessionTopics[sessionId].filter((t) => t.tagId !== tagId),
      });
    } catch (err) {
      setError("Could not remove topic.");
    }
  }

  if (!partnershipId) {
    return <div className="p-8">Add ?partnershipId=X to the URL to view session history.</div>;
  }

  const filteredSessions = filterTopic
    ? sessions.filter((s) => (sessionTopics[s.id] || []).some((t) => t.name === filterTopic))
    : sessions;

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Session History</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {allTopics.length > 0 && (
        <div className="mb-4">
          <select
            value={filterTopic}
            onChange={(e) => setFilterTopic(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">All topics</option>
            {allTopics.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-8">
        {filteredSessions.map((s) => (
          <div key={s.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <span className="font-medium">{s.sessionDate}</span>
              <button onClick={() => handleDelete(s.id)} className="text-red-600 text-sm">
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600">{s.durationMinutes} minutes</p>
            {s.notes && <p className="text-sm text-gray-500 mt-1">{s.notes}</p>}

            <div className="flex flex-wrap gap-1 mt-2">
              {(sessionTopics[s.id] || []).map((t) => (
                <span
                  key={t.tagId}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded flex items-center gap-1"
                >
                  {t.name}
                  <button onClick={() => handleRemoveTopic(s.id, t.tagId)} className="text-blue-500">
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-1 mt-2">
              <input
                type="text"
                placeholder="Add topic"
                value={topicInput[s.id] || ""}
                onChange={(e) => setTopicInput({ ...topicInput, [s.id]: e.target.value })}
                className="border p-1 rounded text-sm flex-1"
              />
              <button
                onClick={() => handleAddTopic(s.id)}
                className="bg-blue-600 text-white text-sm px-2 rounded"
              >
                Tag
              </button>
            </div>
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