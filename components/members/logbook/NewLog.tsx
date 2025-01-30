"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs, saveLogNew } from "@/app/actions";
import { formatISO } from "date-fns";
import RescoucesSelect from "@/components/ui/rescouces-select";
import PicSelect from "@/components/ui/pic-select";

interface ProfileFormData {
  id: string;
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

interface LogProps {
  currentUser: { UserId: string };
}

const NewLog: React.FC<LogProps> = ({ currentUser }) => {
  const t = useTranslations("Profile");
  const now = new Date();
  const [formData, setFormData] = useState<ProfileFormData>({
    id: currentUser.UserId,
    resource: "",
    date: formatISO(now).slice(0, 10),
    pic: "",
    pax: 0,
    departure: "",
    arrival: "",
    offblock: formatISO(now),
    takeoff: formatISO(now).slice(0, 10),
    landing: formatISO(now).slice(0, 10),
    onblock: formatISO(now).slice(0, 10),
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
  
    if (!formData.takeoff || !formData.offblock || !formData.landing || !formData.onblock) {
      alert('All fields are required.');
      return;
    }
  
    const form = new FormData(e.target as HTMLFormElement);
    form.append('id', currentUser.UserId);
  
    try {
      await saveLogNew(form);
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="bg-background p-4 mx-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <label>Aircraft</label>
        <RescoucesSelect
          name="resource"
          value={formData.resource || ""}
          onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
        />
        <label>Date</label>
        <input
          type="date"
          name="date"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <label>PIC</label>
        <PicSelect
          name="pic"
          value={formData.pic || "PIC"}
          onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
        />
        <label>PAX</label>
        <input
          type="text"
          name="pax"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.pax}
          onChange={handleChange}
          placeholder="Pax"
        />
        <label>Departure</label>
        <input
          type="text"
          name="departure"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.departure}
          onChange={handleChange}
          placeholder="eg. EFNU"
        />
        <label>Arrival</label>
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
          value={formData.offblock}
          onChange={(e) => setFormData({ ...formData, offblock: e.target.value })}
          placeholder=""
        />
        <label>TakeOff</label>
        <input
          type="datetime-local"
          name="takeoff"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.takeoff}
          onChange={(e) => setFormData({ ...formData, takeoff: e.target.value })}
          placeholder=""
        />
        <label>Landing</label>
        <input
          type="datetime-local"
          name="landing"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.landing}
          onChange={(e) => setFormData({ ...formData, landing: e.target.value })}
          placeholder={now.toISOString()}
        />
        <label>On Block</label>
        <input
          type="datetime-local"
          name="onblock"
          className="bg-foreground text-background p-2 rounded border-solid border-grey"
          value={formData.onblock}
          onChange={(e) => setFormData({ ...formData, onblock: e.target.value })}
          placeholder={now.toISOString()}
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
