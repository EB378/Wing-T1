"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs, saveLogUpdate } from "@/app/actions";
import RescoucesSelect from "@/components/ui/rescouces-select";
import PicSelect from "@/components/ui/pic-select";

interface ProfileFormData {
  logid: number;
  id: string;
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

interface LogProps {
  currentUser: { UserId: string };
  log_id: number;
}

const Logbook: React.FC<LogProps> = ({ currentUser, log_id }) => {
  const t = useTranslations("Logbook");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [logs, setLogs] = useState<ProfileFormData[]>([]);
  const [editFormData, setEditFormData] = useState<ProfileFormData | null>(null);

  const {
    data,
    mutate: server_getLogs,
  } = useMutation({
    mutationFn: getLogs,
    onSuccess: (data) => {
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

  const handleEditClick = (index: number) => {
    setEditingRow(index);
    setEditFormData({ ...logs[index] });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async (index: number) => {
    const updatedLogs = [...logs];
    updatedLogs[index] = editFormData!;
    setLogs(updatedLogs);
    setEditingRow(null);
  
    try {
      if (editFormData) {
        const formData = new FormData();
        Object.entries(editFormData).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });
        await saveLogUpdate(formData);
      }
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="bg-background px-4 pb-4 rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="max-w-full bg-foreground rounded text-background text-sm">
          <thead>
            <tr>
              {[
                "date",
                "resource",
                "PIC",
                "peopleonboard",
                "departure",
                "arrival",
                "offblock",
                "takeoff",
                "landing",
                "onblock",
                "landings",
                "flightrules",
                "night",
                "ir",
                "fuel",
                "flight_type",
                "details",
                "billing_details",
                "options",
              ].map((header, i) => (
                <th key={i} className="py-2 px-4 border-b-2 border-grey">
                  {t(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                {editingRow === index ? (
                  <>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="date"
                        name="date"
                        value={editFormData?.date.toString().slice(0, 10) || ""}
                        onChange={handleChange}
                        className="w-full bg-white text-ellipsis"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey ">
                    <RescoucesSelect
                        name="resource"
                        value={editFormData?.resource || ""}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <PicSelect name={""} value={""} onChange={function (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void {
                        throw new Error("Function not implemented.");
                      } }/>
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="pax"
                        value={editFormData?.pax || ""}
                        onChange={handleChange}
                        className="w-full bg-white text-ellipsis"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="departure"
                        value={editFormData?.departure || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="arrival"
                        value={editFormData?.arrival || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="datetime-local"
                        name="offblock"
                        value={editFormData?.offblock.toString() || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="datetime-local"
                        name="takeoff"
                        value={editFormData?.takeoff.toString() || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="datetime-local"
                        name="landing"
                        value={editFormData?.landing.toString() || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="datetime-local"
                        name="onblock"
                        value={editFormData?.onblock.toString() || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="landings"
                        value={editFormData?.landings || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="flightrules"
                        value={editFormData?.flightrules || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="night"
                        value={editFormData?.night || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="ir"
                        value={editFormData?.ir || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="fuel"
                        value={editFormData?.fuel || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="flight_type"
                        value={editFormData?.flight_type || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text"
                        name="details"
                        value={editFormData?.details || ""}
                        onChange={handleChange}
                        className="w-full bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <input
                        type="text-box"
                        name="billing_details"
                        value={editFormData?.billing_details || ""}
                        onChange={handleChange}
                        className="w-full bg-white "
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-grey">
                      <button onClick={() => handleSave(index)} className="bg-green-500 text-white px-2 py-1 rounded">
                        Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
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
                    <td className="py-2 px-4 border-b border-grey">
                      <button onClick={() => handleEditClick(index)} className="bg-blue-500 text-white px-2 py-1 rounded">
                        Edit
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logbook;
