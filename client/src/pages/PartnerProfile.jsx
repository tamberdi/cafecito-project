import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function PartnerProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUserId = searchParams.get("userId");
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  useEffect(() => {
    apiFetch(`/users/${id}`).then(setPartner).catch(() => setError("Could not load profile."));
    apiFetch(`/languages/user/${id}`).then(setLanguages).catch(() => {});
  }, [id]);

  async function handleSendRequest() {
    if (!currentUserId) {
      setError("You need to be logged in to send a request. Try visiting this page with ?userId=YOUR_ID for now.");
      return;
    }

    try {
      await apiFetch("/partnerships", {
        method: "POST",
        body: JSON.stringify({ userAId: parseInt(currentUserId), userBId: parseInt(id) }),
      });
      setRequestStatus("Request sent!");
    } catch (err) {
      setRequestStatus(err.message);
    }
  }

  async function handleReport(e) {
    e.preventDefault();
    if (!currentUserId) return;

    try {
      await apiFetch("/safety/reports", {
        method: "POST",
        body: JSON.stringify({
          reporterId: parseInt(currentUserId),
          reportedId: parseInt(id),
          reason: reportReason,
        }),
      });
      setActionStatus("Report submitted.");
      setShowReportForm(false);
      setReportReason("");
    } catch (err) {
      setActionStatus("Could not submit report.");
    }
  }

  async function handleBlock() {
    if (!currentUserId) return;
    if (!confirm(`Block ${partner.name}? You won't see each other's profiles or be able to form a partnership.`)) {
      return;
    }

    try {
      await apiFetch("/safety/blocks", {
        method: "POST",
        body: JSON.stringify({ blockerId: parseInt(currentUserId), blockedId: parseInt(id) }),
      });
      setActionStatus("User blocked.");
      setTimeout(() => navigate("/browse"), 1000);
    } catch (err) {
      setActionStatus(err.message);
    }
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!partner) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">{partner.name}</h1>
      <p className="text-gray-600 mb-4">{partner.timezone}</p>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">Languages</h2>
        <div className="flex flex-col gap-2">
          {languages.map((lang) => (
            <div key={lang.id} className="border p-2 rounded">
              {lang.language} — {lang.level} {lang.isNative && "(native)"}
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSendRequest} className="bg-blue-600 text-white p-2 rounded w-full">
        Send Partnership Request
      </button>
      {requestStatus && <p className="text-sm mt-2 text-gray-600">{requestStatus}</p>}

      <div className="mt-8 pt-4 border-t flex gap-4 text-sm">
        <button onClick={() => setShowReportForm(!showReportForm)} className="text-gray-500">
          Report
        </button>
        <button onClick={handleBlock} className="text-red-600">
          Block
        </button>
      </div>

      {showReportForm && (
        <form onSubmit={handleReport} className="mt-3 flex flex-col gap-2">
          <textarea
            placeholder="Reason (optional)"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="border p-2 rounded text-sm"
          />
          <button type="submit" className="bg-gray-600 text-white p-2 rounded text-sm">
            Submit Report
          </button>
        </form>
      )}

      {actionStatus && <p className="text-sm mt-2 text-gray-600">{actionStatus}</p>}
    </div>
  );
}

export default PartnerProfile;