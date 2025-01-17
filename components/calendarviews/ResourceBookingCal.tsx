// components/calendarviews/ResourceBookingCal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "@/app/actions";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { formatISO, parseISO } from "date-fns";
import { EventClickArg } from "@fullcalendar/core";

interface Event {
  id: number;
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  user: string;
}

interface CalProps {
  user: { id: string; email?: string };
}

const ResourceBookingCal: React.FC<CalProps> = ({ user }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("HomePage");
  const [error, setError] = useState("");

  const {
    data,
    mutate: server_getBookings,
  } = useMutation({
    mutationFn: getBookings,
    onSuccess: () => {
      // Success callback
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getBookings({
      id: 0,
      title: "",
      details: "",
      starttime: "",
      endtime: "",
      created_at: "",
      user: "",
    });
  }, [server_getBookings]);

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent({
      id: Number(info.event.id),
      title: info.event.title,
      details: info.event.extendedProps.details,
      starttime: info.event.startStr,
      endtime: info.event.endStr,
      user: user.id,
    });
    setModalOpen(true);
  };
  

  const handleDateSelect = (selection: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: 0,
      title: "",
      details: "",
      starttime: formatISO(selection.start),
      endtime: formatISO(selection.end),
      user: user.id,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
    setSelectedEvent(null);
  };

  const deletebooking = async () => {
    if (selectedEvent?.id) {
      await deleteBooking({ id: selectedEvent.id });
      closeModal();
      server_getBookings({
        id: 0,
        title: "",
        details: "",
        starttime: "",
        endtime: "",
        created_at: "",
        user: "",
      });
    }
  };

  const savebooking = async () => {
    if (selectedEvent) {
      try {
        if (selectedEvent.id === 0) {
          // Handle creation of a new booking
          await createBooking({
            title: selectedEvent.title,
            details: selectedEvent.details,
            starttime: selectedEvent.starttime,
            endtime: selectedEvent.endtime,
            user: user.id, // Assuming `user.id` is accessible from your component's props or context
          });
          closeModal();
        } else {
          // Handle updating an existing booking
          await updateBooking({
            id: selectedEvent.id, // Ensure `id` is provided for an update
            title: selectedEvent.title,
            details: selectedEvent.details,
            starttime: selectedEvent.starttime,
            endtime: selectedEvent.endtime,
            user: selectedEvent.user,
          });
          closeModal();
        }
        server_getBookings({
          id: 0,
          title: "",
          details: "",
          starttime: "",
          endtime: "",
          created_at: "",
          user: "",
        }); // Refresh the bookings list
        setError(""); // Reset the error state upon successful operation
      } catch (error) {
        console.error("Booking operation failed:", error);
        if (error instanceof Error) {
          setError(error.message); // Only set the error message if it's an instance of Error
        } else {
          setError("An unexpected error occurred during the booking operation."); // Fallback error message
        }
      }
    }
  };
  

  const events = data?.map((booking: Event) => ({
    id: String(booking.id),
    title: booking.title,
    start: booking.starttime
      ? parseISO(booking.starttime).toISOString()
      : undefined,
    end: booking.endtime ? parseISO(booking.endtime).toISOString() : undefined,
    extendedProps: {
      details: booking.details,
      user: booking.user,
    },
  }));

  return (
    <>
      <div className="m-10">
        <FullCalendar
          timeZone="UTC"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          events={events || []}
          height="auto"
        />
      </div>
      {modalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedEvent.id === 0 ? "New Booking" : "Edit Booking"}
            </h2>        
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
              value={selectedEvent.title}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, title: e.target.value })
              }
            />
            <textarea
              placeholder="Details"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
              value={selectedEvent.details}
              onChange={(e) =>
                setSelectedEvent({ ...selectedEvent, details: e.target.value })
              }
            />
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
              value={parseISO(selectedEvent.starttime)
                .toISOString()
                .slice(0, -8)} // Formatting to fit datetime-local input
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  starttime: e.target.value + ":00Z",
                })
              }
            />
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
              value={parseISO(selectedEvent.endtime).toISOString().slice(0, -8)} // Formatting to fit datetime-local input
              onChange={(e) =>
                setSelectedEvent({
                  ...selectedEvent,
                  endtime: e.target.value + ":00Z",
                })
              }
            />
            {error && (
              <div className="p-3 text-red-700 text-center">
                Error: {error}
              </div>
            )}
            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={savebooking}
              >
                Save
              </button>
              {selectedEvent.id !== 0 && (
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={deletebooking}
                >
                  Delete
                </button>
              )}
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceBookingCal;