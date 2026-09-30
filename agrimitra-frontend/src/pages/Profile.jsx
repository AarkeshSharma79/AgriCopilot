import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateProfile as apiUpdateProfile } from "../services/authService";

export default function Profile() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await apiUpdateProfile({ name, location });
      login({ name, location });
      setMsg("Profile saved successfully!");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <Navbar />
      <main className="px-6 pb-10">
        <form onSubmit={handleSave} className="card max-w-lg">
          <p className="card-title mb-4">Profile</p>
          {msg && (
            <div className="mb-4 text-xs font-semibold text-leaf-700 bg-leaf-50 p-2.5 rounded-xl border border-leaf-200">
              {msg}
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.avatar || "/images/avatar-placeholder.png"}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover bg-leaf-100"
              onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            />
            <div>
              <p className="font-display font-semibold text-forest-950">{user?.name}</p>
              <p className="text-sm text-forest-950/50">{user?.plan || "Premium Plan"}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-forest-950/40">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 rounded-xl border border-forest-950/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500"
              />
            </div>
            <div>
              <label className="text-xs text-forest-950/40">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 rounded-xl border border-forest-950/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-leaf-500"
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary mt-6">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </main>
    </div>
  );
}

