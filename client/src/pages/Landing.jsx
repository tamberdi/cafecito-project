import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";

function Landing() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const user = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, timezone }),
      });
      navigate(`/profile?userId=${user.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">Cafecito</h1>
      <p className="text-gray-500 mb-10">
        Practice a new language like you're catching up with a friend — no pressure, just consistent conversation.
      </p>

      <div className="flex justify-center gap-8 mb-10">
        <div className="w-24">
          <div className="text-2xl mb-1">🗣️</div>
          <p className="text-xs font-medium">Find a partner</p>
          <p className="text-xs text-gray-400">Matched by language and timezone</p>
        </div>
        <div className="w-24">
          <div className="text-2xl mb-1">📝</div>
          <p className="text-xs font-medium">Log sessions</p>
          <p className="text-xs text-gray-400">Quick notes, right after you talk</p>
        </div>
        <div className="w-24">
          <div className="text-2xl mb-1">🔥</div>
          <p className="text-xs font-medium">Build a streak</p>
          <p className="text-xs text-gray-400">Stay consistent, see your progress</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Timezone (e.g. America/Chicago)"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Landing;