import React from "react";
import ResourceBookingCal from "@/components/members/calendarviews/ResourceBookingCal";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ResourceBookingCalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams; // Resolve and extract locale
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  const userForCal = {
    UserId: user.id,
    email: user.email || "", // Fallback to empty string if email is undefined
  };

  return (
    <div className="w-screen flex flex-col text-sm items-center">
      <h2 className="text-xl">Booking Calendar</h2>
      {/* Pass only data */}
      <ResourceBookingCal currentUser={userForCal} />
    </div>
  );
}
