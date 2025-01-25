"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs, saveLogUpdate } from "@/app/actions";
import { formatISO, parseISO } from "date-fns";

interface ProfileFormData {
  userId: string;
  resource: string;
  date: string;
  pic: string;
  pax: number;
  departure: string;
  arrival: string;
  offblock: string;
  takeoff: string;
  landing: string;
  onblock: string;
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
    resource: "",
    date: formatISO(new Date()),
    pic: "",
    pax: 0,
    departure: "",
    arrival: "",
    offblock: formatISO(new Date()),
    takeoff: formatISO(new Date()),
    landing: formatISO(new Date()),
    onblock: formatISO(new Date()),
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
    onSuccess: () => {
      // Handle success
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
          name="resource"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.resource}
          onChange={handleChange}
          placeholder="aircraft"
        />
        <label>Date</label>
        <input
          type="datetime-local"
          name="date"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.date.slice(0, -1)}
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
          type="datetime-local"
          name="offblock"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.offblock.slice(0, -1)}
          onChange={handleChange}
          placeholder=""
        />
        <label>TakeOff</label>
        <input
          type="datetime-local"
          name="takeoff"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.takeoff.slice(0, -1)}
          onChange={handleChange}
          placeholder=""
        />
        <label>Landing</label>
        <input
          type="datetime-local"
          name="landing"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landing.slice(0, -1)}
          onChange={handleChange}
          placeholder=""
        />
        <label>On Block</label>
        <input
          type="datetime-local"
          name="onblock"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.onblock.slice(0, -1)}
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
        <div className="inline flex gap-2">
          <input
            type="checkbox"
            name="NF"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            checked={true || false}
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
        <div className="inline flex gap-2">
          <input
            type="checkbox"
            name="IR"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            checked={true || false}
            onChange={handleChange}
          />
          <input
            type="text"
            name="instrument"
            className="bg-foreground text-background p-2 rounded border-solid border-grey"
            onChange={handleChange}
            placeholder=""
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

export default NewLog;
