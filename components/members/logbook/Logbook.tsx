"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs } from "@/app/actions";
import UpdateLog from "@/components/members/logbook/UpdateLog";
import ToggleUpdate from "@/components/members/logbook/ToggleUpdate";

interface ProfileFormData {
  id: number;
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

interface LogProps {
  currentUser: { UserId: string };
  logid: number;
}

const Logbook: React.FC<LogProps> = ({ currentUser, logid}) => {
  const t = useTranslations("Logbook");
  const [activeComponent, setActiveComponent] = useState<string>("logbook");
  const renderComponent = () => {
    switch (activeComponent) {
      case "newLog":
        return (
          <>
            <UpdateLog currentUser={{
              UserId: currentUser.UserId
            }} logid={formData.id} />
          </>
        );
      default:
        return;
    }
  };
  
  const [formData, setFormData] = useState<ProfileFormData>({
    id: 0,
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

  const [logs, setLogs] = useState<ProfileFormData[]>([]);

  const {
    data,
    mutate: server_getLogs,
  } = useMutation({
    mutationFn: getLogs,
    onSuccess: (data) => {
      console.log("Fetched data:", data);
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([data]);
      }
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getLogs();
  }, [server_getLogs]);

  console.log("formdata", formData);
  console.log("getlogs", server_getLogs);
  console.log("Logdata", logs);

  return (
    <div className="bg-background px-4 pb-4 rounded-lg shadow-md">
      <div className="flex flex-col">
        {renderComponent()}
      </div>
      <div className="overflow-x-auto">
        <table className="max-w-full bg-foreground rounded text-background text-sm">
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
              <th className="py-2 px-4 border-b-2 border-grey">{t("options")}</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-grey">
                  <tr className="py-2 px-4 border-b border-grey"><ToggleUpdate id={log.id} activeComponent={activeComponent} setActiveComponent={setActiveComponent} /></tr>
                  <tr className="py-2 px-4 border-b border-grey">{log.billing_details}</tr>
                </td>
                <td className="py-2 px-4 border-b border-grey">{log.date.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.resource}</td>
                <td className="py-2 px-4 border-b border-grey">{log.pic}</td>
                <td className="py-2 px-4 border-b border-grey">{log.pax.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.departure}</td>
                <td className="py-2 px-4 border-b border-grey">{log.arrival}</td>
                <td className="py-2 px-4 border-b border-grey">{log.offblock.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.takeoff.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.landing.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.onblock.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.landings.toString()}</td>
                <td className="py-2 px-4 border-b border-grey">{log.flightrules}</td>
                <td className="py-2 px-4 border-b border-grey">{log.night}</td>
                <td className="py-2 px-4 border-b border-grey">{log.ir}</td>
                <td className="py-2 px-4 border-b border-grey">{log.fuel.toString()}</td>
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
