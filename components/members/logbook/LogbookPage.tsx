"use client";

import React from "react";
import Logbook from "@/components/members/logbook/Logbook";
import { useTranslations } from "next-intl";



interface LogProps {
  currentUser: { UserId: string };
}

const LogbookPage: React.FC<LogProps> = ({ currentUser }) => {
  const t = useTranslations("Logbook");

  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <h2 className="font-bold text-2xl m-4">{t("logbook")}</h2>
      <Logbook currentUser={currentUser} log_id={0}/>
    </div>
  );
};

export default LogbookPage;
