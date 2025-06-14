import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PortalPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check localStorage for access flag
    const access = localStorage.getItem("hasAdminAccess");
    if (access === "true") {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/validate-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });

    const data = await res.json();
    if (data.valid) {
      localStorage.setItem("hasAdminAccess", "true");
      setAuthorized(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  if (!authorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <h1 className="text-xl font-bold text-center">Admin Access</h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded hover:bg-gray-800"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-4 text-6xl font-thin ">Welcome to Admin Portal</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/portal/orders")}
          className="px-6 py-3 text-white bg-black rounded hover:bg-gray-800"
        >
          View Orders
        </button>
        <button
          onClick={() => router.push("/portal/products")}
          className="px-6 py-3 text-white bg-black rounded hover:bg-gray-800"
        >
          Manage Products
        </button>
      </div>
    </div>
  );
}
