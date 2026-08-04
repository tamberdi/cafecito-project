import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function Dashboard() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [partnerships, setPartnerships] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    loadPartnerships();
  }, [userId]);

  function loadPartnerships() {
    apiFetch(`/partnerships/user/${userId}`)
      .then(setPartnerships)
      .catch(() => setError("Could not load partnerships."));
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

          return (
            <div key={p.id} className="border p-4 rounded">
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
                <button
                  onClick={() => updateStatus(p.id, "ended")}
                  className="text-red-600 text-sm mt-2"
                >
                  End Partnership
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;