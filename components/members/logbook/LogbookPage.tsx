"use client";

import React, { useState } from "react";
import NewLog from "@/components/members/logbook/NewLog";
import Logbook from "@/components/members/logbook/Logbook";
import ToggleNew from "@/components/members/logbook/ToggleNew";
import { useTranslations } from "next-intl";



interface LogProps {
  currentUser: { UserId: string };
}

const LogbookPage: React.FC<LogProps> = ({ currentUser }) => {
  const [activeComponent, setActiveComponent] = useState<string>("logbook");
  const t = useTranslations("Logbook");

  const renderComponent = () => {
    switch (activeComponent) {
      case "newLog":
        return (
          <>
            <NewLog currentUser={{
              UserId: currentUser.UserId
            }} />
          </>
        );
      default:
        return;
    }
  };

  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <h2 className="font-bold text-2xl m-4">{t("logbook")}</h2>
      <ToggleNew activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="flex flex-col gap-4">
        {renderComponent()}
      </div>
      <Logbook currentUser={currentUser} logid={0}/>
    </div>
  );
};

export default LogbookPage;
