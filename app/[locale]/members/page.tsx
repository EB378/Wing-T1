import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import React from "react";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
 
  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <div className="w-screen">
        <div className="bg-accent text-sm p-3 mx-4 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>
      <div className="flex flex-col gap-2 mx-4 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        {user && (
          <p className="text-sm text-gray-400">
            Logged in as: <strong>{user.email}</strong>
          </p>
        )}
      </div>
    </div>
  );
}
