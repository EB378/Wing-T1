"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getProfile, saveProfileUpdate } from "@/app/actions";

interface ProfileFormData {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  country: string;
  postCode: string;
  role: string;
  qualifications: string[];
}

const ProfileMain = () => {
  const t = useTranslations("HomePage");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    id: 0,
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

  const {
    data,
    mutate: server_getProfile,
  } = useMutation({
    mutationFn: getProfile,
    onSuccess: (data) => {
      setFormData({
        id: data.id || 0,
        fullName: data.fullName || "",
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        streetAddress: data.streetAddress || "",
        city: data.city || "",
        country: data.country || "",
        postCode: data.postCode || "",
        role: data.role || "",
        qualifications: data.qualifications || [],
      }); // Update form data with fetched profile data
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getProfile();
  }, [server_getProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfileUpdate(new FormData(e.target as HTMLFormElement));
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    
    <>
    <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
      {JSON.stringify(formData, null, 2)}
    </pre>
    <form onSubmit={handleSubmit}>
      <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
      <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="Street Address" />
      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
      <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
      <input type="text" name="postCode" value={formData.postCode} onChange={handleChange} placeholder="Post Code" />
      <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
      <input type="text" name="qualifications" value={formData.qualifications.join(', ')} onChange={handleChange} placeholder="Qualifications" />
      <button type="submit">Save</button>
    </form>
    </>
  );
};

export default ProfileMain;