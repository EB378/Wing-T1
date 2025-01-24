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

export const getProfile = async () => {
  const supabase = await createClient();


  const { data: profiles, error } = await supabase
  .from("profiles")
  .select("id, fullname, username, streetaddress, city, country, postcode, role, NF, phone, email")




  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
    }

  // Fetch email and phone from the user table in the auth schema
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error("Error fetching user data:", userError);
    throw new Error("Failed to fetch user data");
  }

  const email = user?.email;
  const phone = profiles?.[0]?.phone; 
  const id = profiles?.[0]?.id;
  const fullname = profiles?.[0]?.fullname;
  const username = profiles?.[0]?.username;
  const streetaddress = profiles?.[0]?.streetaddress;
  const city = profiles?.[0]?.city;
  const country = profiles?.[0]?.country;
  const postcode = profiles?.[0]?.postcode;
  const role = profiles?.[0]?.role;
  const NF = profiles?.[0]?.NF ?? false;

  return {
    id: id,
    email: email,
    phone: phone,
    fullname: fullname,
    username: username,
    streetaddress: streetaddress,
    city: city,
    country: country,
    postcode: postcode,
    role: role,
    NF: NF,
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
  const postcode = formData.get("postcode") as string;
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
      postcode: postcode,
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

export const getLogs = async () => {
  const supabase = await createClient();


  const { data: logs, error } = await supabase
  .from("logs")
  .select("userId, aircraft, date, PIC, peopleonboard, departure, arrival, offblock, takeoff, landing, onblock, landings, flightrules, night, ir, fuel, flight_type, details, billing_details")

  if (error) {
    console.error("Error fetching logs:", error);
    throw new Error("Failed to fetch logs");
    }


  const userId = logs?.[0]?.userId; 
  const aircraft = logs?.[0]?.aircraft;
  const date = logs?.[0]?.date;
  const PIC = logs?.[0]?.PIC;
  const peopleonboard = logs?.[0]?.peopleonboard;
  const departure = logs?.[0]?.departure;
  const arrival = logs?.[0]?.arrival;
  const offblock = logs?.[0]?.offblock;
  const takeoff = logs?.[0]?.takeoff;
  const landing = logs?.[0]?.landing;
  const onblock = logs?.[0]?.onblock;
  const landings = logs?.[0]?.landings;
  const flightrules = logs?.[0]?.flightrules;
  const night = logs?.[0]?.night;
  const ir = logs?.[0]?.ir;
  const fuel = logs?.[0]?.fuel;
  const flight_type = logs?.[0]?.flight_type;
  const details = logs?.[0]?.details;
  const billing_details = logs?.[0]?.billing_details;

  return {
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
  };
};

export const saveLogNew = async (formData: FormData) => {
  const supabase = await createClient();
  const locale = await getLocaleFromHeaders();

  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const username = formData.get("username") as string;
  const fullname = formData.get("fullname") as string;
  const streetaddress = formData.get("streetaddress") as string;
  const city = formData.get("city") as string;
  const country = formData.get("country") as string;
  const postcode = formData.get("postcode") as string;
  const role = formData.get("role") as string;
  const NF = formData.get("NF") as string;

  console.log("formData", formData);

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
      postcode: postcode,
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
  const postcode = formData.get("postcode") as string;
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
      postcode: postcode,
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


  const { data: aircrafts, error } = await supabase
  .from("aircraft")
  .select("id, aircraft, model")

  if (error) {
    console.error("Error fetching Aircraft:", error);
    throw new Error("Failed to fetch Aircraft");
    }


  const id = aircrafts?.[0]?.id; 
  const aircraft = aircrafts?.[0]?.aircraft;
  const model = aircrafts?.[0]?.model;

  return {
    id: id,
    aircraft: aircraft,
    model: model,
  };
};