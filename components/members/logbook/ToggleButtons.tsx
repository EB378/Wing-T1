import React from 'react';

interface ToggleButtonsProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ activeComponent, setActiveComponent }) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        className={`btn ${activeComponent === "newLog" ? "btn-active" : ""}`}
        onClick={() => setActiveComponent("newLog")}
      >
        New Log
      </button>
      <button
        className={`btn ${activeComponent === "updateLog" ? "btn-active" : ""}`}
        onClick={() => setActiveComponent("updateLog")}
      >
        Update Log
      </button>
    </div>
  );
};

export default ToggleButtons;