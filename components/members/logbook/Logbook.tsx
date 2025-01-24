// components/calendarviews/ResourceBookingCal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getLogs } from "@/app/actions";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatISO, parseISO } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";

interface Event {
  id: number;
  userid: string;
  aircraft: string;
  date: string;
  PIC: string;
  peopleonboard: number;
  departure: string;
  arrival: string;
  offblock: number;
  takeoff: number;
  landing: number;
  onblock: number;
  landings: number;
  flightrules: string;
  night: string;
  ir: string;
  fuel: number;
  flight_type: string;
  details: string;
  billing_details: string;
}

const Logbook = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("HomePage");
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  const {
    data,
    mutate: server_getLogs,
  } = useMutation({
    mutationFn: getLogs,
    onSuccess: () => {
      // Success callback
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getLogs({
      id: 0,
      userid: "",
      aircraft: "",
      date: "",
      PIC: "",
      peopleonboard: 0,
      departure: "",
      arrival: "",
      offblock: 0,
      takeoff: 0,
      landing: 0,
      onblock: 0,
      landings: 0,
      flightrules: "",
      night: "",
      ir: "",
      fuel: 0,
      flight_type: "",
      details: "",
      billing_details: "",
    });
  }, [server_getLogs]);

  



  return (
    <>
      <div className="m-10 text-black bg-white rounded p-4 h-full">
        <FullCalendar
          timeZone="local"
          nowIndicator={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today",
          }}
          editable={true}
          height="auto"
        />
      </div>
    </>
  );
};

export default Logbook;