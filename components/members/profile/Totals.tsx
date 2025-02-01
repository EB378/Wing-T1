"use client";

import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getProfileTotals } from "@/app/actions";

interface ProfileData {
  flight_hours_per_resource?: Record<string, number>;
}

const formatHours = (decimalHours: number) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

const ProfileTotals = () => {
  const t = useTranslations("Profile");

  const {
    data,
    mutate: server_getProfile,
    isPending,
    isError,
  } = useMutation<ProfileData[]>({
    mutationFn: async () => {
      const result = await getProfileTotals();
      console.log("Fetched profile totals:", result);
      return result as ProfileData[];
    },
    onSuccess: (data) => {
      console.log("Mutation success, data received:", data);
    },
    onError: (error) => {
      console.error("Error fetching profile totals:", error);
    },
  });

  useEffect(() => {
    server_getProfile();
  }, [server_getProfile]);

  // Extract the first object from the array
  const profileData = data?.[0] || {};

  return (
    <div className="bg-background p-4 rounded-lg shadow-md border-solid border-foreground border-2">
      <h2 className="font-bold text-2xl mb-4">{t("Total Hours on Plane")}</h2>

      {isPending ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : isError ? (
        <p className="text-sm text-red-500">Error loading data</p>
      ) : profileData.flight_hours_per_resource &&
        Object.keys(profileData.flight_hours_per_resource).length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Aircraft</th>
              <th className="border border-gray-300 p-2">Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(profileData.flight_hours_per_resource).map(
              ([aircraft, hours]) => (
                <tr key={aircraft}>
                  <td className="border border-gray-300 p-2">{aircraft}</td>
                  <td className="border border-gray-300 p-2">{formatHours(hours)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-500">No data available...</p>
      )}
    </div>
  );
};

export default ProfileTotals;
