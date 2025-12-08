import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      if (!formData.currentPassword) {
        setError("Current password is required to change password");
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = { name: formData.name };
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await api.put("/auth/profile", updateData);
      setSuccess("Profile updated successfully");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Refresh page to update user data
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-8">
          Profile
        </h1>

        {error && (
          <div className="mb-6 border border-red-200 text-red-600 px-4 py-3 text-sm font-light">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-green-200 text-green-600 px-4 py-3 text-sm font-light">
            {success}
          </div>
        )}

        <div className="border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-light text-gray-900">Account Details</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-600 hover:text-gray-900 font-light underline"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light tracking-wide">
                  NAME
                </label>
                <p className="text-sm text-gray-900 font-light">{user.name}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light tracking-wide">
                  EMAIL
                </label>
                <p className="text-sm text-gray-900 font-light">{user.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
                  EMAIL
                </label>
                <p className="text-sm text-gray-500 font-light py-3">
                  {user.email} (cannot be changed)
                </p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-light text-gray-900 mb-4">
                  Change Password (Optional)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
                      CURRENT PASSWORD
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
                      NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">
                      CONFIRM NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-0 py-3 border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm font-light"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 text-white py-3 hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-light tracking-wide"
                >
                  {loading ? "SAVING..." : "SAVE CHANGES"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user.name,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setError("");
                  }}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 hover:border-gray-900 hover:text-gray-900 transition-colors text-sm font-light tracking-wide"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-200 text-gray-600 py-3 hover:border-red-600 hover:text-red-600 transition-colors text-sm font-light tracking-wide"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
