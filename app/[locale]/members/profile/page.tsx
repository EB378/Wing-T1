import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import ProfileMain from "@/components/members/profile/Profile";
import ProfileTotals from "@/components/members/profile/Totals";

export default async function ProtectedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale  = (await params).locale
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  return (
    <div className="w-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <ProfileMain/>
        <div>
          <ProfileTotals/>
        </div>
      </div>
    </div>
  );
}
