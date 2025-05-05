"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Header } from "../homepage/components/Header"; // Update the path to the correct location of the Header component

export default function AccountSettingsPage() {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordWarning, setPasswordWarning] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    setLoading(true);
    // Simulate a delay for uploading
    setTimeout(() => {
      alert("Image uploaded successfully.");
      setLoading(false);
    }, 1500);
  };

  // Function to determine password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = "Weak";
    let warnings = [];

    // Check length
    if (password.length >= 8) {
      strength = "Medium";
    }
    if (password.length >= 12) {
      strength = "Strong";
    }

    // Check for various conditions
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

  const handlePasswordChange = () => {
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

    // Calculate password strength
    calculatePasswordStrength(newPassword);

    setErrorMessage(null);
    setLoading(true);
    setTimeout(() => {
      alert("Password updated successfully.");
      setLoading(false);
      setNewPassword("");
    }, 1500);
  };

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate saving all changes
    setTimeout(() => {
      alert("All changes saved successfully.");
      setLoading(false);
    }, 1500);
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-8 space-y-10">
        <h1 className="text-4xl font-bold text-black mb-12 text-center tracking-wide">
          Account Settings
        </h1>

        {/* Profile Picture Section */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold text-black mb-6">Profile Picture</h2>

          <div className="flex items-center space-x-6">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-28 h-28 object-cover rounded-full border-2 border-sky-500 shadow-lg transition-all duration-300 transform hover:scale-105"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-300" />
            )}

            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered file-input-sm w-full max-w-xs"
              />
              <button
                onClick={handleUpload}
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm shadow-md hover:shadow-xl flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-white w-5 h-5" />
                ) : (
                  "Upload New Photo"
                )}
              </button>
            </div>
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
              calculatePasswordStrength(e.target.value); // Update password strength in real-time
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
            {/* Password Strength Indicator */}
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

        {/* Save Changes Button */}
        <div className="text-center">
          <button
            onClick={handleSaveChanges}
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin text-white w-5 h-5" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
