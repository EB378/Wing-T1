"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { use } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  return redirect(`/${locale}/members`);
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
    redirectTo: `${origin}/${locale}/auth/callback?redirect_to=/${locale}/members/reset-password`,
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
      `/${locale}/members/reset-password`,
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      `/${locale}/members/reset-password`,
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      `/${locale}/members/reset-password`,
      "Password update failed",
    );
  }

  encodedRedirect(
    "success",
    `/${locale}/members/reset-password`,
    "Password updated",
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();
  await supabase.auth.signOut();
  return redirect(`/${locale}/sign-in`);
};

export const getBookings = async ({
  cal_id,
  title,
  details,
  starttime,
  endtime,
  created_at,
  id,
}: {
  cal_id: number;
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  created_at: string;
  id: string;
}) => {
  const supabase = await createClient();
  let query = supabase.from("bookings").select("*");

  // Add filters based on provided parameters
  if (cal_id) query = query.eq("id", cal_id);
  if (title) query = query.ilike("title", `%${title}%`);
  if (details) query = query.ilike("details", `%${details}%`);
  if (starttime) query = query.gte("starttime", starttime);
  if (endtime) query = query.lte("endtime", endtime);
  if (created_at) query = query.eq("created_at", created_at);
  if (id) query = query.eq("id", id);

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
  id = 'defultUser',
  excludeBookingId = null,
}: {
  starttime?: string;
  endtime?: string;
  id?: string;
  excludeBookingId?: number | null;
}) => {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*")
    .gte("endtime", starttime)
    .lte("starttime", endtime)
    .eq("id", id);

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
  id,
}: {
  title: string;
  details: string;
  starttime: string;
  endtime: string;
  id: string;
}) => {
  const supabase = await createClient();
  const isOverlapping = await hasOverlappingBookings({ starttime, endtime, id });

  if (isOverlapping) {
    throw new Error("Booking overlaps with existing booking");
  }
  const { data: booking, error } = await supabase.from("bookings").insert([
    {
      title,
      details,
      starttime,
      endtime,
      id,
    },
  ]);

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }

  return booking;
};

export const updateBooking = async ({
  cal_id,
  title,
  details,
  starttime,
  endtime,
  id,
}: {
  cal_id: number;
  title?: string;
  details?: string;
  starttime?: string;
  endtime?: string;
  id?: string;
}) => {
  const supabase = await createClient();
  const isOverlapping = await hasOverlappingBookings({ starttime, endtime, id, excludeBookingId: cal_id });

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
      id,
    })
    .match({ id });

  if (error) {
    console.error("Error updating booking:", error);
    throw new Error("Failed to update booking");
  }

  return updatedBooking;
};

export const deleteBooking = async ({ cal_id }: { cal_id: number }) => {
  const supabase = await createClient();
  const { data: deletedBooking, error } = await supabase
    .from("bookings")
    .delete()
    .match({ cal_id });

  if (error) {
    console.error("Error deleting booking:", error);
    throw new Error("Failed to delete booking");
  }

  return deletedBooking; // This will return the details of the deleted booking.
};

export const getProfile = async () => {
  const supabase = await createClient();


  // Fetch email and userid from the user table in the auth schema
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error("Error fetching user data:", userError);
    throw new Error("Failed to fetch user data");
  }

  const { data: profiles, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user?.id);

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
    }

  const profile = profiles[0];
  const email = user?.email;
  const phone = profile.phone;
  const id = profile.id;
  const fullname = profile.fullname;
  const username = profile.username;
  const streetaddress = profile.streetaddress;
  const city = profile.city;
  const country = profile.country;
  const zip = profile.zip;
  const role = profile.role;
  const NF = profile.NF ?? false;
  const IR = profile.IR ?? false;
  console.log("profile", profiles);

  return {
    id: id,
    email: email,
    phone: phone,
    fullname: fullname,
    username: username,
    streetaddress: streetaddress,
    city: city,
    country: country,
    zip: zip,
    role: role,
    NF: NF,
    IR: IR,
  };
};

export const saveProfileUpdate = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const username = formData.get("username") as string;
  const fullname = formData.get("fullname") as string;
  const streetaddress = formData.get("streetaddress") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const zip = formData.get("zip") as string;
  const role = formData.get("role") as string;
  let NF = formData.get("NF") as string;
  let IR = formData.get("IR") as string;

  if (!NF) {
    NF = "false";
  }
  if (!IR) {
    IR = "false";
  }

  console.log("formData", formData);

  const { data: { user }, error: UserIdError } = await supabase.auth.getUser()

  // Update email and phone in the user table in the auth schema
  const { data, error: userError } = await supabase.auth.updateUser({
    email: email,
  });


  if (userError) {
    console.error("Error updating user data:", userError);
    throw new Error("Failed to update user data");
  }


  // Update the rest of the profile data in the profiles table in the public schema
  const { data: FormData, error: profileError } = await supabase
    .from("profiles")
    .update({
      username: username,
      fullname: fullname,
      streetaddress: streetaddress,
      city: city,
      country: country,
      zip: zip,
      role: role,
      phone: phone,
      NF: NF,
      IR: IR,
    });

  if (profileError) {
    console.error("Error updating profile data:", profileError);
    toast.error("Failed to update profile");
    throw new Error("Failed to update profile data");

  }else {
    toast.success("Profile updated successfully");
  }

  encodedRedirect(
    "success",
    `/${locale}/members/profile`,
    "Profile updated successfully",
  );
};

export const getLogs = async () => {
  const supabase = await createClient();




  let query = supabase.from("logs").select("*");

  // Add filters based on provided parameters

  const { data: logs, error } = await query;
  console.log("logs", logs);

  if (error) {
    console.error("Error fetching logs:", error);
    throw new Error("Failed to fetch logs");
  }

  const log = logs[0];
  const id = log.id;
  const userId = log.userId;
  const aircraft = log.aircraft;
  const date = log.date;
  const PIC = log.PIC;
  const peopleonboard = log.peopleonboard;
  const departure = log.departure;
  const arrival = log.arrival;
  const offblock = log.offblock;
  const takeoff = log.takeoff;
  const landing = log.landing;
  const onblock = log.onblock;
  const landings = log.landings;
  const flightrules = log.flightrules;
  const night = log.night;
  const ir = log.ir;
  const fuel = log.fuel;
  const flight_type = log.flight_type;
  const details = log.details;
  const billing_details = log.billing_details;

  
  return {
    id: id,
    userId: userId,
    aircraft: aircraft,
    date: date,
    PIC: PIC,
    peopleonboard: peopleonboard,
    departure: departure,
    arrival: arrival,
    offblock: offblock,
    takeoff: takeoff,
    landing: landing,
    onblock: onblock,
    landings: landings,
    flightrules: flightrules,
    night: night,
    ir: ir,
    fuel: fuel,
    flight_type: flight_type,
    details: details,
    billing_details: billing_details,
  }; // Assuming bookings is an array of booking records
};

export const saveLogNew = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const userId = formData.get("userId") as string;
  const aircraft = formData.get("aircraft") as string;
  const date = formData.get("date") as string;
  const PIC = formData.get("PIC") as string;
  const peopleonboard = parseInt(formData.get("peopleonboard") as string);
  const departure = formData.get("departure") as string;
  const arrival = formData.get("arrival") as string;
  const offblock = parseInt(formData.get("offblock") as string);
  const takeoff = parseInt(formData.get("takeoff") as string);
  const landing = parseInt(formData.get("landing") as string);
  const onblock = parseInt(formData.get("onblock") as string);
  const landings = parseInt(formData.get("landings") as string);
  const flightrules = formData.get("flightrules") as string;
  const night = formData.get("night") as string;
  const ir = formData.get("ir") as string;
  const fuel = parseInt(formData.get("fuel") as string);
  const flight_type = formData.get("flight_type") as string;
  const details = formData.get("details") as string;
  const billing_details = formData.get("billing_details") as string;


  console.log("formData", formData);

  const { data: logs, error } = await supabase.from("logs").insert([
    {
      userId: userId,
      aircraft: aircraft,
      date: date,
      PIC: PIC,
      peopleonboard: peopleonboard,
      departure: departure,
      arrival: arrival,
      offblock: offblock,
      takeoff: takeoff,
      landing: landing,
      onblock: onblock,
      landings: landings,
      flightrules: flightrules,
      night: night,
      ir: ir,
      fuel: fuel,
      flight_type: flight_type,
      details: details,
      billing_details: billing_details,
    },
  ]);

  if (error) {
    console.error("Error creating booking:", error);
    throw new Error("Failed to create booking");
  }

  encodedRedirect(
    "success",
    `/${locale}/members/logbook`,
    "Profile updated successfully",
  );
};

export const saveLogUpdate = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const username = formData.get("username") as string;
  const fullname = formData.get("fullname") as string;
  const streetaddress = formData.get("streetaddress") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const zip = formData.get("zip") as string;
  const role = formData.get("role") as string;
  const NF = formData.get("NF") as string;

  console.log("formData", formData);



  // Update email and phone in the user table in the auth schema
  const { data, error: userError } = await supabase.auth.updateUser({
    email: email,
  });


  if (userError) {
    console.error("Error updating user data:", userError);
    throw new Error("Failed to update user data");
  }

  // Fetch the user's profile id
  const { data: profileData, error: profileFetchError } = await supabase
    .from("profiles")
    .select("id")

  if (!profileData || profileData.length === 0) {
    throw new Error("Profile data not found");
  }
  const id = profileData[0].id;

  // Update the rest of the profile data in the profiles table in the public schema
  const { data: FormData, error: profileError } = await supabase
    .from("profiles")
    .update({
      username: username,
      fullname: fullname,
      streetaddress: streetaddress,
      city: city,
      country: country,
      zip: zip,
      role: role,
      phone: phone,
      NF: NF,
    }).match({ id });

  if (profileError) {
    console.error("Error updating profile data:", profileError);
    throw new Error("Failed to update profile data");
  }

  encodedRedirect(
    "success",
    `/${locale}/members`,
    "Profile updated successfully",
  );
};

export const getAircaft = async () => {
  const supabase = await createClient();


  const { data: resources, error } = await supabase
  .from("resources")
  .select("*")

  if (error) {
    console.error("Error fetching Aircraft:", error);
    throw new Error("Failed to fetch Aircraft");
    }

  const resources1 = resources[0];
  const resource_id = resources1.id; 
  const resource = resources1.aircraft;
  const model = resources1.model;
  const description = resources1.description;
  const active = resources1.active ?? false;

  return {
    resource_id: resource_id,
    resource: resource,
    model: model,
    description: description,
    active: active,
  };
};