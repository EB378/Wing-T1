"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs, saveLogUpdate } from "@/app/actions";

interface ProfileFormData {
  userId: string;
  resource: string;
  date: Date;
  pic: string;
  pax: number;
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

const UpdateLog = () => {
  const t = useTranslations("Profile");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    userId: "",
    resource: "",
    date: new Date(),
    pic: "",
    pax: 0,
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
        resource: data.resource || "",
        date: data.date || new Date(),
        pic: data.pic || "",
        pax: data.pax || 0,
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <label>Aircraft</label>
        <input
          type="text"
          name="email"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.resource}
          onChange={handleChange}
          placeholder="aircraft"
        />
        <label>Date</label>
        <input
          type="text"
          name="date"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.date.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder="Date"
        />
        <label>PIC</label>
        <input
          type="text"
          name="username"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.pic}
          onChange={handleChange}
          placeholder="PIC"
        />
        <label>Full Name</label>
        <input
          type="text"
          name="fullname"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.pax}
          onChange={handleChange}
          placeholder="Full Name"
        />
        <label>Departure i.e. EFNU</label>
        <input
          type="text"
          name="departure"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.departure}
          onChange={handleChange}
          placeholder="eg. EFNU"
        />
        <label>Arrival i.e. EFTU</label>
        <input
          type="text"
          name="arrival"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.arrival}
          onChange={handleChange}
          placeholder="eg. EFTU"
        />
        <label>Off Block</label>
        <input
          type="text"
          name="offblock"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.offblock.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder=""
        />
        <label>TakeOff</label>
        <input
          type="text"
          name="takeoff"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.takeoff.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder=""
        />
        <label>Landing</label>
        <input
          type="text"
          name="landing"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landing.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder=""
        />
        <label>On Block</label>
        <input
          type="text"
          name="onblock"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.onblock.toISOString().split(', ')[0]}
          onChange={handleChange}
          placeholder=""
        />
        <label>Landings</label>
        <input
          type="text"
          name="landings"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landings}
          onChange={handleChange}
          placeholder=""
        />
        <label>Flight Rules</label>
        <input
          type="text"
          name="flightrules"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.flightrules}
          onChange={handleChange}
          placeholder="eg. VFR"
        />
        <label>Night flight time</label>
        <div className="inline">
          <input
            type="checkbox"
            name="NF"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            checked={formData.night = "true" || false}
            onChange={handleChange}
          />
          <input
            type="text"
            name="night"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            value={formData.night}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <label>IR flight time</label>
        <div className="inline">
          <input
            type="checkbox"
            name="NF"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            checked={formData.ir = true || false}
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
        </div>
        <label>Fuel Left(l)</label>
        <input
          type="text"
          name="fuel"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.fuel}
          onChange={handleChange}
          placeholder="fuel(l)"
        />
        <label>flight Type</label>
        <input
          type="text"
          name="flight_type"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.flight_type}
          onChange={handleChange}
          placeholder="eg. Local"
        />
        <label>Details</label>
        <input
          type="text"
          name="details"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.details}
          onChange={handleChange}
          placeholder="Details"
        />
        <label>Billing Details</label>
        <input
          type="text"
          name="billing_details"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.billing_details}
          onChange={handleChange}
          placeholder="Billing details"
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

export default UpdateLog;
