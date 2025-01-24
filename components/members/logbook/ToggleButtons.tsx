import React from 'react';

interface ToggleButtonsProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const ToggleButtons: React.FC<ToggleButtonsProps> = ({ activeComponent, setActiveComponent }) => {
  const defaultComponent = 'default'; // Define your default component

  const handleToggle = (component: string) => {
    setActiveComponent(activeComponent === component ? defaultComponent : component);
  };

  return (
    <div className="flex justify-center gap-4">
      <button
        className={`btn ${activeComponent === "newLog" ? "btn-active" : ""}`}
        onClick={() => handleToggle("newLog")}
      >
        New Log
      </button>
      <button
        className={`btn ${activeComponent === "updateLog" ? "btn-active" : ""}`}
        onClick={() => handleToggle("updateLog")}
      >
        Update Log
      </button>
    </div>
  );
};

export default ToggleButtons;