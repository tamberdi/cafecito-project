import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function PartnerProfile() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentUserId = searchParams.get("userId");

  const [partner, setPartner] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [error, setError] = useState("");
  const [requestStatus, setRequestStatus] = useState("");

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
      setRequestStatus("Could not send request (maybe one already exists).");
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
    </div>
  );
}

export default PartnerProfile;