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
  currentUser: { id: string; email?: string };
}

const ResourceBookingCal: React.FC<CalProps> = ({ currentUser }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const t = useTranslations("HomePage");
  const [error, setError] = useState("");
  const [isEditable, setIsEditable] = useState(false);

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

  

  const handleDateSelect = (selection: { start: Date; end: Date }) => {
    setSelectedEvent({
      id: 0,
      title: "",
      details: "",
      starttime: formatISO(selection.start),
      endtime: formatISO(selection.end),
      user: currentUser.id,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
    setSelectedEvent(null);
    setIsEditable(false);
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
            user: currentUser.id, // Assuming `user.id` is accessible from your component's props or context
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

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent({
      id: Number(info.event.id),
      title: info.event.title,
      details: info.event.extendedProps.details,
      starttime: info.event.startStr,
      endtime: info.event.endStr,
      user: info.event.extendedProps.user,
    });
    console.log(info.event.extendedProps.user);
    setIsEditable(String(info.event.extendedProps.user) === String(currentUser.id));
    setModalOpen(true);
  };

  return (
    <>
      <div className="m-10 text-black bg-white rounded p-4">
      <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-hidden">
          {JSON.stringify(selectedEvent?.user, null, 2)}
        </pre>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-hidden">
          {JSON.stringify(currentUser.id, null, 2)}
        </pre>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-hidden">
          {JSON.stringify(isEditable, null, 2)}
        </pre>
        <FullCalendar
          timeZone="UTC"
          nowIndicator={true}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "dayGridMonth,timeGridWeek,timeGridDay",
            right: "prev,next today",
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
{/* ID=0 is new booking */}
          {selectedEvent.id === 0 && (
            <>
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent.id === 0 ? "New Booking" : "Edit Booking"}
                </h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} />
                <textarea
                  placeholder="Details"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.details}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, details: e.target.value })} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.starttime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, starttime: e.target.value + ":00Z" })} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.endtime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, endtime: e.target.value + ":00Z" })} />
                <p>{selectedEvent.user}</p>
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
            </>
          )}
{/* isEditable is true if the user is the owner of the booking */}
          {selectedEvent.id != 0 && isEditable && (
            <>
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent.id === 0 ? "New Booking" : "Edit Booking"}
                </h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })} />
                <textarea
                  placeholder="Details"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.details}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, details: e.target.value })} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.starttime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, starttime: e.target.value + ":00Z" })} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.endtime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, endtime: e.target.value + ":00Z" })} />
                <p>{selectedEvent.user}</p>

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
            </>
          )}
{/* !isEditable is true if the user is not the owner of the booking */}
          {selectedEvent.id != 0 && !isEditable && (
            <>
              <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent.id === 0 ? "New Booking" : "Edit Booking"}
                </h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                  disabled={true} />
                  
                <textarea
                  placeholder="Details"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={selectedEvent.details}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, details: e.target.value })}
                  disabled={true} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.starttime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, starttime: e.target.value + ":00Z" })}
                  disabled={true} />
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md mb-4 bg-white"
                  value={parseISO(selectedEvent.endtime).toISOString().slice(0, -8)}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, endtime: e.target.value + ":00Z" })}
                  disabled={true} />
                <p>{selectedEvent.user}</p>

                <div className="flex justify-between">

                <div className="text-center text-sm text-gray-500 mt-4">
                  You do not have permission to edit this event.
                    <div>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ResourceBookingCal;