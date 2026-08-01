import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/client";

function Browse() {
  const [learning, setLearning] = useState("");
  const [native, setNative] = useState("");
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  function loadPartners() {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (learning) params.set("learning", learning);
    if (native) params.set("native", native);

    apiFetch(`/users?${params.toString()}`)
      .then(setPartners)
      .catch(() => setError("Could not load partners."))
      .finally(() => setLoading(false));
  }

  function handleFilter(e) {
    e.preventDefault();
    loadPartners();
  }

  return (
    <div className="max-w-2xl mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Browse Partners</h1>

      <form onSubmit={handleFilter} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="They speak (e.g. Spanish)"
          value={learning}
          onChange={(e) => setLearning(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="They're learning (e.g. English)"
          value={native}
          onChange={(e) => setNative(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded px-4">
          Filter
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && partners.length === 0 && (
        <p className="text-gray-500">No partners match those filters yet.</p>
      )}

      <div className="flex flex-col gap-3">
        {partners.map((partner) => (
          <Link
            key={partner.id}
            to={`/partners/${partner.id}`}
            className="border p-4 rounded flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{partner.name}</p>
              <p className="text-sm text-gray-500">{partner.timezone}</p>
            </div>
            <span className="text-blue-600 text-sm">View →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Browse;