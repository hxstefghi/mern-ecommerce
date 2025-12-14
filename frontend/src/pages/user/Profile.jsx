import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = 'My Profile - MERN Store';
  }, []);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressData, setAddressData] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "",
  });

  // Update address data when user object changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || ""
      }));
      setAddressData({
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zipCode: user.address?.zipCode || "",
        country: user.address?.country || "",
      });
    }
  }, [user]);

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
      await refreshUser();
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.put("/auth/profile", { address: addressData });
      await refreshUser();
      toast.success("Shipping address updated successfully");
      setIsEditingAddress(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-white mb-8">
          Profile
        </h1>

        {error && (
          <div className="mb-6 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 text-sm font-light dark:bg-red-950/30">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-green-200 dark:border-green-900 text-green-600 dark:text-green-400 px-4 py-3 text-sm font-light dark:bg-green-950/30">
            {success}
          </div>
        )}

        <div className="border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-8 dark:bg-gray-900">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-light text-gray-900 dark:text-white">Account Details</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-light underline"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                  NAME
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.name}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                  EMAIL
                </label>
                <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.email}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                  EMAIL
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light py-3">
                  {user.email} (cannot be changed)
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                <h3 className="text-sm font-light text-gray-900 dark:text-white mb-4">
                  Change Password (Optional)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
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
                      className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                      NEW PASSWORD
                    </label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
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
                      className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 dark:bg-gray-800 text-white py-3 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-light tracking-wide"
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
                  className="flex-1 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-3 hover:border-gray-900 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Shipping Address Section */}
        <div className="border border-gray-100 dark:border-gray-800 p-6 sm:p-8 mb-8 dark:bg-gray-900">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-light text-gray-900 dark:text-white">Shipping Address</h2>
            {!isEditingAddress && (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-light underline"
              >
                {user?.address?.street ? "Edit" : "Add"}
              </button>
            )}
          </div>

          {!isEditingAddress ? (
            <div className="space-y-4">
              {user?.address?.street ? (
                <>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                      STREET
                    </label>
                    <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.address.street}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                        CITY
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.address.city}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                        STATE
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.address.state}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                        ZIP CODE
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.address.zipCode}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 font-light tracking-wide">
                        COUNTRY
                      </label>
                      <p className="text-sm text-gray-900 dark:text-gray-300 font-light">{user.address.country}</p>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">No shipping address saved</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddressUpdate} className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                  STREET ADDRESS
                </label>
                <input
                  type="text"
                  required
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                  className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                  placeholder="Enter street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                    CITY
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                    STATE
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.state}
                    onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                    className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                    ZIP CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.zipCode}
                    onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                    className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                    placeholder="Zip code"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-300 mb-2 font-light tracking-wide">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    required
                    value={addressData.country}
                    onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                    className="w-full px-0 py-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-500 transition-colors bg-transparent text-sm font-light dark:text-white"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gray-900 dark:bg-gray-800 text-white py-3 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm font-light tracking-wide"
                >
                  {loading ? "SAVING..." : "SAVE ADDRESS"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingAddress(false);
                    setAddressData({
                      street: user?.address?.street || "",
                      city: user?.address?.city || "",
                      state: user?.address?.state || "",
                      zipCode: user?.address?.zipCode || "",
                      country: user?.address?.country || "",
                    });
                    setError("");
                  }}
                  className="flex-1 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-3 hover:border-gray-900 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-light tracking-wide"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="w-full border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-3 hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-500 transition-colors text-sm font-light tracking-wide"
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}
