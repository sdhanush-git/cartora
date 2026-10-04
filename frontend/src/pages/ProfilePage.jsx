import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Shield, Calendar, Package, Lock, MapPin, Phone, Check, AlertCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit details form
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [savingDetails, setSavingDetails] = useState(false);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    document.title = "Cartora | Profile";
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get("/auth/profile");
        setProfileData(res.data);
        setUsername(res.data.username || "");
        setPhone(res.data.phone || "");
        if (res.data.address) {
          setAddress({
            address: res.data.address.address || "",
            city: res.data.address.city || "",
            state: res.data.address.state || "",
            pincode: res.data.address.pincode || "",
          });
        }
      } catch (error) {
        toast.error("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, toast]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }

    try {
      setSavingDetails(true);
      const res = await api.put("/auth/profile", {
        username: username.trim(),
        phone: phone.trim(),
        address,
      });
      setProfileData(res.data.user);
      if (setUser) {
        setUser((prev) => ({ ...prev, username: res.data.user.username }));
      }
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      setChangingPassword(true);
      const res = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(res.data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Please log in</h2>
        <p className="mt-2 text-sm text-gray-500">You must be logged in to view your profile.</p>
        <Link
          to="/login"
          className="mt-4 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-8 w-44 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-48 animate-pulse rounded-2xl bg-gray-100 md:col-span-1" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-100 md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Account Profile
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Account Overview Card */}
        <div className="space-y-6 md:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-950 text-white">
              <User size={30} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-950">
              {profileData?.username}
            </h2>
            <p className="text-sm text-gray-500">{profileData?.email}</p>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-4 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield size={14} className="text-gray-400" /> Role
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 font-semibold uppercase tracking-wider text-gray-800">
                  {profileData?.role}
                </span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Package size={14} className="text-gray-400" /> Orders
                </span>
                <span className="font-semibold text-gray-900">
                  {profileData?.orderCount || 0}
                </span>
              </div>

              {profileData?.createdAt && (
                <div className="flex items-center justify-between text-gray-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar size={14} className="text-gray-400" /> Member Since
                  </span>
                  <span className="text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <Link
                to="/orders"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Package size={14} />
                View My Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="space-y-8 md:col-span-2">
          {/* Personal Info Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-semibold text-gray-950">
              Personal Information
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Update your contact details and default shipping address.
            </p>

            <form onSubmit={handleUpdateProfile} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Username
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={profileData?.email || ""}
                    className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-500 outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Email address cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Phone
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                  />
                </div>
              </div>

              {/* Shipping Address Fields */}
              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
                  Default Address
                </label>
                <div className="mt-2 space-y-3">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-gray-950"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-gray-950"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-gray-950"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none transition focus:border-gray-950"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingDetails}
                  className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                >
                  {savingDetails ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-semibold text-gray-950">
              Change Password
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Ensure your account is using a long, random password to stay secure.
            </p>

            <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="rounded-xl border border-gray-900 bg-transparent px-5 py-2.5 text-sm font-medium text-gray-950 transition hover:bg-gray-950 hover:text-white disabled:opacity-50 cursor-pointer"
                >
                  {changingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
