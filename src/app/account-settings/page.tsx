"use client";

import { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { Header } from "../homepage/components/Header"; // Update the path to the correct location of the Header component
import supabase from "../../../config/supabaseClient";

export default function AccountSettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordWarning, setPasswordWarning] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false); // Track delete confirmation state
  const [userData, setUserData] = useState<{ username: string; avatar_url: string | null } | null>(null);

  // Fetch user data on page load
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setErrorMessage("Failed to fetch user data.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("User")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) {
        setErrorMessage("Failed to fetch user profile.");
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const calculatePasswordStrength = (password: string) => {
    let strength = "Weak";
    let warnings = [];

    if (password.length >= 8) {
      strength = "Medium";
    }
    if (password.length >= 12) {
      strength = "Strong";
    }

    if (!/(?=.*[0-9])/.test(password)) {
      warnings.push("Include at least one number.");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      warnings.push("Include at least one uppercase letter.");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      warnings.push("Include at least one special character.");
    }

    if (warnings.length > 0) {
      setPasswordWarning(warnings.join(" "));
    } else {
      setPasswordWarning(null);
    }

    setPasswordStrength(strength);
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      setErrorMessage("Password cannot be empty.");
      setPasswordWarning(null);
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      setPasswordWarning("Weak password: Consider adding a mix of characters.");
      return;
    }

    calculatePasswordStrength(newPassword);

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMessage("Failed to update password.");
    } else {
      alert("Password updated successfully.");
      setNewPassword("");
    }

    setLoading(false);
  };

  const handleAccountDeletion = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setLoading(true);

    try {
      // Get the current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setErrorMessage("Failed to fetch user data.");
        setLoading(false);
        return;
      }

      // Delete user data from custom database tables
      const { error: deleteDataError } = await supabase
        .from("User")
        .delete()
        .eq("id", user.id);

      if (deleteDataError) {
        setErrorMessage("Failed to delete user data.");
        setLoading(false);
        return;
      }

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setErrorMessage("Failed to sign out user.");
        setLoading(false);
        return;
      }

      alert("Account deleted successfully.");
      window.location.href = "/"; // Redirect to homepage
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-8 space-y-10">
        {/* Profile Section */}
        <div className="flex items-center space-x-6 mb-8">
          {userData?.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-sky-500 shadow-lg"
            />
          ) : (
            <FaUserCircle className="w-20 h-20 text-gray-300" />
          )}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {userData?.username || "Guest"}
            </h2>
            <p className="text-gray-500">Manage your account settings below</p>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-black mb-6">Change Password</h2>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              calculatePasswordStrength(e.target.value);
            }}
            placeholder="Enter new password"
            className="w-full border border-gray-300 px-6 py-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all duration-200"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {passwordWarning && (
            <p className="text-yellow-500 text-sm mb-4">{passwordWarning}</p>
          )}

          <div className="mb-4">
            <div
              className={`h-2 w-full rounded-lg ${
                passwordStrength === "Strong"
                  ? "bg-green-500"
                  : passwordStrength === "Medium"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>
            <p className="text-sm mt-2">
              Password Strength: {passwordStrength}
            </p>
          </div>

          <button
            onClick={handlePasswordChange}
            className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-white w-5 h-5" />
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-black mb-6">Delete Account</h2>

          <p className="text-red-500 text-sm mb-4">
            WARNING: Deleting your account is permanent and cannot be undone.
          </p>

          {!isDeleteConfirming ? (
            <button
              onClick={() => setIsDeleteConfirming(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl flex items-center justify-center"
            >
              Delete Account
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={handleAccountDeletion}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white w-5 h-5" />
                ) : (
                  "Confirm Delete"
                )}
              </button>
              <button
                onClick={() => setIsDeleteConfirming(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}