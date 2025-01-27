import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import LogbookPage from "@/components/members/logbook/LogbookPage";

export default async function ProtectedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  const userForLog = {
    UserId: user.id,
  };

  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <LogbookPage currentUser={userForLog} />
    </div>
  );
}
