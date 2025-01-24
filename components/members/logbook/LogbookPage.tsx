"use client";

import React, { useState } from "react";
import NewLog from "@/components/members/logbook/NewLog";
import Logbook from "@/components/members/logbook/Logbook";
import UpdateLog from "@/components/members/logbook/UpdateLog";
import ToggleButtons from "@/components/members/logbook/ToggleButtons";
import { useTranslations } from "next-intl";

const LogbookPage = () => {
  const [activeComponent, setActiveComponent] = useState<string>("logbook");
  const t = useTranslations("Logbook");

  const renderComponent = () => {
    switch (activeComponent) {
      case "newLog":
        return (
          <>
            <NewLog />
            <Logbook />
          </>
        );
      case "updateLog":
        return (
          <>
            <UpdateLog />
            <Logbook />
          </>
      );
      default:
        return <Logbook />;
    }
  };

  return (
    <div className="flex-1 w-screen flex flex-col gap-12">
      <h2 className="font-bold text-2xl m-4">{t("logbook")}</h2>
      <ToggleButtons activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
      <div className="flex flex-col gap-4">
        {renderComponent()}
      </div>
    </div>
  );
};

export default LogbookPage;