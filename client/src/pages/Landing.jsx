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
      setError("Something went wrong creating your account.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Cafecito</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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