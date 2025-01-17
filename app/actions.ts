"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getLocaleFromHeaders = async () => {
  const referer = (await headers()).get("referer");
  if (!referer) return "/en"; // Default to `/en` if no referer is found

  const url = new URL(referer);
  const segments = url.pathname.split("/").filter(Boolean); // Split the pathname into segments
  const locale = segments[0]; // Assume the first segment is the locale

  return locale || "/en"; // Default to `/en` if no locale is detected
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocaleFromHeaders();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      `/${locale}/sign-up`,
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/${locale}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", `/${locale}/sign-up`, error.message);
  } else {
    return encodedRedirect(
      "success",
      `/${locale}/sign-up`,
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", `/${locale}/sign-in`, error.message);
  }

  return redirect(`/${locale}/protected`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocaleFromHeaders();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Email is required",
    );
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/${locale}/auth/callback?redirect_to=/${locale}/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      `/${locale}/forgot-password`,
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    `/${locale}/forgot-password`,
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      `/${locale}/protected/reset-password`,
      "Password update failed",
    );
  }

  encodedRedirect(
    "success",
    `/${locale}/protected/reset-password`,
    "Password updated",
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();
  await supabase.auth.signOut();
  return redirect(`/${locale}/sign-in`);
};

export const googleAuthAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = await getLocaleFromHeaders();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google Auth Error:", error);
    return encodedRedirect("error", `${locale}/sign-in`, error.message);
  }

  // Redirect user to Google OAuth URL
  if (data?.url) {
    return redirect(data.url);
  }

  return encodedRedirect(
    "error",
    `/${locale}/protected`,
    "Failed to initialize Google authentication.",
  );
};

export const getBookings = async ({
  id,
  title,
  details,
  starttime,
  endtime,
  created_at,
  user,
}: {
  id: number;
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  created_at: string;
  user: string;
}) => {
  const supabase = await createClient();
  let query = supabase.from("bookings").select("*");

  // Add filters based on provided parameters
  if (id) query = query.eq("id", id);
  if (title) query = query.ilike("title", `%${title}%`);
  if (details) query = query.ilike("details", `%${details}%`);
  if (starttime) query = query.gte("starttime", starttime);
  if (endtime) query = query.lte("endtime", endtime);
  if (created_at) query = query.eq("created_at", created_at);
  if (user) query = query.eq("user", user);

  const { data: bookings, error } = await query;

  if (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch bookings");
  }

  return bookings; // Assuming bookings is an array of booking records
};


export const hasOverlappingBookings = async ({
  starttime = new Date().toISOString(), // provide default values if undefined
  endtime = new Date().toISOString(),
  user = 'defaultUser',
  excludeBookingId = null,
}: {
  starttime?: string;
  endtime?: string;
  user?: string;
  excludeBookingId?: number | null;
}) => {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .gte("endtime", starttime)
    .lte("starttime", endtime)
    .eq("user", user);

  if (excludeBookingId) {
    query = query.not("id", 'eq', excludeBookingId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error checking for overlapping bookings:", error);
    throw new Error("Failed to check for overlapping bookings");
  }

  return data.length > 0;
};


export const createBooking = async ({
  title,
  details,
  starttime,
  endtime,
  user,
}: {
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  user: string;
}) => {
  const supabase = await createClient();
  const isOverlapping = await hasOverlappingBookings({ starttime, endtime, user });

  if (isOverlapping) {
    throw new Error("Booking overlaps with existing booking");
  }
  const { data: booking, error } = await supabase.from("bookings").insert([
    {
      title,
      details,
      starttime,
      endtime,
      user,
    },
  ]);

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }

  return booking;
};


export const updateBooking = async ({
  id,
  title,
  details,
  starttime,
  endtime,
  user,
}: {
  id: number;
  title?: string;
  details?: string;
  starttime?: string;
  endtime?: string;
  user?: string;
}) => {
  const supabase = await createClient();
  const isOverlapping = await hasOverlappingBookings({ starttime, endtime, user, excludeBookingId: id });

  if (isOverlapping) {
    throw new Error("Booking overlaps with existing booking");
  }
  const { data: updatedBooking, error } = await supabase
    .from("bookings")
    .update({
      title,
      details,
      starttime,
      endtime,
      user,
    })
    .match({ id });

  if (error) {
    console.error("Error updating booking:", error);
    throw new Error("Failed to update booking");
  }

  return updatedBooking;
};

export const deleteBooking = async ({ id }: { id: number }) => {
  const supabase = await createClient();
  const { data: deletedBooking, error } = await supabase
    .from("bookings")
    .delete()
    .match({ id });

  if (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }

  return deletedBooking; // This will return the details of the deleted booking.
};
