// components/members/profile/Profile.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getProfile, saveProfileUpdate } from "@/app/actions";

const ProfileMain = () => {
  const t = useTranslations("HomePage");
  const [error, setError] = useState("");

  const {
    data,
    mutate: server_getProfile,
  } = useMutation({
    mutationFn: getProfile,
    onSuccess: () => {
      // Success callback
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getProfile({
      fullName: "",
      username: "",
      streetAddress: "",
      city: "",
      country: "",
      postCode: "",
      role: "",
      qualifications: [],
    });
  }, [server_getProfile]);

  interface ProfileFormData {
    fullName: string;
    username: string;
    streetAddress: string;
    city: string;
    country: string;
    postCode: string;
    role: string;
    qualifications: string[];
    email: string;
    phone: string;
  }

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    country: "",
    postCode: "",
    role: "",
    qualifications: [],
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsEditing(true);
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, qualifications: options });
    setIsEditing(true);
  };

  const handleSave = () => {
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formDataToSubmit.append(key, item));
      } else {
        formDataToSubmit.append(key, value);
      }
    });
    saveProfileUpdate(formDataToSubmit);
    console.log("Saved data:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form logic here
    setFormData({
      fullName: "",
      username: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      country: "",
      postCode: "",
      role: "",
      qualifications: [],
    });
    setIsEditing(false);
  };

  const profiledisplay = data ? {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      streetAddress: data.streetAddress,
      city: data.city,
      country: data.country,
      postCode: data.postCode,
      role: data.role,
      qualifications: data.qualifications,
    } : null;

  return (
    <div className="m-10 text-black bg-white rounded p-4 h-full">
         <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <div className="mb-4">
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.fullName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Username</label>
        <input
          type="text"
          name="username"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.username}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          name="email"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Phone</label>
        <input
          type="text"
          name="phone"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Street Address</label>
        <input
          type="text"
          name="streetAddress"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.streetAddress}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">City</label>
        <input
          type="text"
          name="city"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.city}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Country</label>
        <input
          type="text"
          name="country"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.country}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Post Code</label>
        <input
          type="text"
          name="postCode"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.postCode}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Role</label>
        <input
          type="text"
          name="role"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          value={profiledisplay?.role}
          readOnly
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Qualifications</label>
        <select
          name="qualifications"
          className="w-full p-2 border border-gray-300 rounded-md bg-white"
          multiple
          value={profiledisplay?.qualifications}
          onChange={handleMultiSelectChange}
        >
          <option value="IR">IR</option>
          <option value="NF">NF</option>
          <option value="CFI">CFI</option>
          <option value="CFIIR">CFIIR</option>
          <option value="SAR">SAR</option>
        </select>
      </div>
      {isEditing && (
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md mr-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
};

export default ProfileMain;