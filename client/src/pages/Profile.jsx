import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/client";

function Profile() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    apiFetch(`/users/${userId}`)
      .then(setUser)
      .catch(() => setError("Could not load profile."));
  }, [userId]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!user) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">{user.name}</h1>
      <p className="text-gray-600">{user.email}</p>
      <p className="text-gray-600">{user.timezone}</p>
      <p className="text-sm text-gray-400 mt-4">
        Member since {new Date(user.joinedAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default Profile;