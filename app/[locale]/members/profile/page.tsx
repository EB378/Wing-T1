import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import ProfileMain from "@/components/members/profile/Profile";

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


  const { data, error } = await supabase.auth.updateUser({
    email: "new@email.com",
    password: "new-password",
    data: { hello: 'world' }
  })


  if (!user) {
    return redirect(`/${locale}/sign-in`);
  }

  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <div className="flex flex-col gap-2 mx-4 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <ProfileMain/>

      


      
    </div>
  );
}
