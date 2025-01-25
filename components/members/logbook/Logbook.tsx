"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs } from "@/app/actions";

interface ProfileFormData {
  userId: String,
  resource: String,
  date: Date,
  pic: String,
  pax: Number,
  departure: String,
  arrival: String,
  offblock: Date,
  takeoff: Date,
  landing: Date,
  onblock: Date,
  landings: Number,
  flightrules: String,
  night: String,
  ir: String,
  fuel: Number,
  flight_type: String,
  details: String,
  billing_details: String,
}

const Logbook = () => {
  const t = useTranslations("Logbook");
  
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
      }); // Update form data with fetched profile data
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getLogs();
  }, [server_getLogs]);

  console.log(formData);

  const logs = data ? [data] : [];
  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="max-w-full bg-foreground rounded text-background">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b-2 border-grey">{t("date")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("resource")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("PIC")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("peopleonboard")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("departure")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("arrival")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("offblock")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("takeoff")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("landing")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("onblock")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("landings")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("flightrules")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("night")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("ir")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("fuel")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("flight_type")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("details")}</th>
              <th className="py-2 px-4 border-b-2 border-grey">{t("billing_details")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-grey">{log.date}</td>
                <td className="py-2 px-4 border-b border-grey">{log.resource}</td>
                <td className="py-2 px-4 border-b border-grey">{log.pic}</td>
                <td className="py-2 px-4 border-b border-grey">{log.pax}</td>
                <td className="py-2 px-4 border-b border-grey">{log.departure}</td>
                <td className="py-2 px-4 border-b border-grey">{log.arrival}</td>
                <td className="py-2 px-4 border-b border-grey">{log.offblock}</td>
                <td className="py-2 px-4 border-b border-grey">{log.takeoff}</td>
                <td className="py-2 px-4 border-b border-grey">{log.landing}</td>
                <td className="py-2 px-4 border-b border-grey">{log.onblock}</td>
                <td className="py-2 px-4 border-b border-grey">{log.landings}</td>
                <td className="py-2 px-4 border-b border-grey">{log.flightrules}</td>
                <td className="py-2 px-4 border-b border-grey">{log.night}</td>
                <td className="py-2 px-4 border-b border-grey">{log.ir}</td>
                <td className="py-2 px-4 border-b border-grey">{log.fuel}</td>
                <td className="py-2 px-4 border-b border-grey">{log.flight_type}</td>
                <td className="py-2 px-4 border-b border-grey">{log.details}</td>
                <td className="py-2 px-4 border-b border-grey">{log.billing_details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
    </div>
  );
};

export default Logbook;