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
  const t = useTranslations("Profile");
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
    <div className="bg-background p-4 rounded-lg shadow-md border-solid border-foreground border-2">
      <h2 className="font-bold text-2xl mb-4">{t("profileUpdate")}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <label>{t("email")}</label>
        <input type="text" name="email" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.email} onChange={handleChange} placeholder="Email" />
        <label>{t("phone")}</label>
        <input type="text" name="phone"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <label>{t("username")}</label>
        <input type="text" name="username"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.username} onChange={handleChange} placeholder="Username" />
        <label>{t("fullname")}</label>
        <input type="text" name="fullName"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
        <label>{t("address")}</label>
        <input type="text" name="streetAddress" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.streetAddress} onChange={handleChange} placeholder="Street Address" />
        <label>{t("city")}</label>
        <input type="text" name="city" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.city} onChange={handleChange} placeholder="City" />
        <label>{t("country")}</label>
        <input type="text" name="country" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.country} onChange={handleChange} placeholder="Country" />
        <label>{t("zip")}</label>
        <input type="text" name="postCode" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.postCode} onChange={handleChange} placeholder="Post Code" />
        <label>{t("role")}</label>
        <input type="text" name="role" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.role} onChange={handleChange} placeholder="Role" />
        <label>{t("qualifications")}</label>
        <input type="text" name="qualifications" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.qualifications.join(', ')} onChange={handleChange} placeholder="Qualifications" />
        <button type="submit" className="text-foreground p-2 rounded border-solid border-foreground border-2 w-auto">Save</button>
      </form>
    </div>
  );
};

export default ProfileMain;