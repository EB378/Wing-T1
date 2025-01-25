import React from "react";
import Navbar from "@/components/members/nav/mNav";
import HeaderAuth from "@/components/Home/Nav/header-auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {

    const supabase = await createClient();
    const { locale } = await params;
    
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) {
        return redirect(`/${locale}/sign-in`);
      }
    return (
        <div className="w-screen flex flex-col gap-1 items-start">
            <Navbar locale={""}>
                <HeaderAuth
                    params={{
                        locale: "",
                    }}
                />
            </Navbar>
            {children}
        </div>
    );
}
