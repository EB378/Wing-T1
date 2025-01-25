"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs, saveLogUpdate } from "@/app/actions";

interface ProfileFormData {
  userId: string;
  aircraft: string;
  date: Date;
  PIC: string;
  peopleonboard: number;
  departure: string;
  arrival: string;
  offblock: Date;
  takeoff: Date;
  landing: Date;
  onblock: Date;
  landings: number;
  flightrules: string;
  night: string;
  ir: string;
  fuel: number;
  flight_type: string;
  details: string;
  billing_details: string;
}

const NewLog = () => {
  const t = useTranslations("Profile");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    userId: "",
    aircraft: "",
    date: new Date(),
    PIC: "",
    peopleonboard: 0,
    departure: "",
    arrival: "",
    offblock: new Date(),
    takeoff: new Date(),
    landing: new Date(),
    onblock: new Date(),
    landings: 0,
    flightrules: "",
    night: "",
    ir: "",
    fuel: 0,
    flight_type: "",
    details: "",
    billing_details: "",
  });

  const {
    data,
    mutate: server_getLogs,
  } = useMutation({
    mutationFn: getLogs,
    onSuccess: (data) => {
      setFormData({
        userId: data.userId || "",
        aircraft: data.aircraft || "",
        date: data.date || new Date(),
        PIC: data.PIC || "",
        peopleonboard: data.peopleonboard || 0,
        departure: data.departure || "",
        arrival: data.arrival || "",
        offblock: data.offblock || new Date(),
        takeoff: data.takeoff || new Date(),
        landing: data.landing || new Date(),
        onblock: data.onblock || new Date(),
        landings: data.landings || 0,
        flightrules: data.flightrules || "",
        night: data.night || "",
        ir: data.ir || "",
        fuel: data.fuel || 0,
        flight_type: data.flight_type || "",
        details: data.details || "",
        billing_details: data.billing_details || "",
      });
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getLogs();
  }, [server_getLogs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveLogUpdate(new FormData(e.target as HTMLFormElement));
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="bg-background p-4 rounded-lg shadow-md border-solid border-foreground border-2">
      <h2 className="font-bold text-2xl mb-4">{t("profileUpdate")}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <label>{t("email")}</label>
        <input
          type="text"
          name="email"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.aircraft}
          onChange={handleChange}
          placeholder="aircraft"
        />
        <label>{t("phone")}</label>
        <input
          type="text"
          name="phone"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.date.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Phone"
        />
        <label>{t("username")}</label>
        <input
          type="text"
          name="username"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.PIC}
          onChange={handleChange}
          placeholder="Username"
        />
        <label>{t("fullname")}</label>
        <input
          type="text"
          name="fullname"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.peopleonboard}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <label>{t("address")}</label>
        <input
          type="text"
          name="streetaddress"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.departure}
          onChange={handleChange}
          placeholder="Street Address"
        />
        <label>{t("city")}</label>
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.arrival}
          onChange={handleChange}
          placeholder="City"
        />
        <label>{t("country")}</label>
        <input
          type="text"
          name="country"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.offblock.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Country"
        />
        <label>{t("zip")}</label>
        <input
          type="text"
          name="zip"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.takeoff.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Post Code"
        />
        <label>{t("role")}</label>
        <input
          type="text"
          name="role"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landing.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Role"
        />
        <input
          type="text"
          name="role"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.onblock.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Role"
        />
        <label>{t("city")}</label>
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landings}
          onChange={handleChange}
          placeholder="City"
        />
        <label>{t("city")}</label>
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.flightrules}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.night}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="checkbox"
          name="NF"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          checked={true || false}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.ir}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="checkbox"
          name="NF"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          checked={true || false}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.fuel}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.flight_type}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.details}
          onChange={handleChange}
          placeholder="City"
        />
        <input
          type="text"
          name="city"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.billing_details}
          onChange={handleChange}
          placeholder="City"
        />
        <button
          type="submit"
          className="text-foreground p-2 rounded border-solid border-foreground border-2 w-auto"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default NewLog;