import React from 'react';

interface ToggleButtonsProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
}

const ToggleNew: React.FC<ToggleButtonsProps> = ({ activeComponent, setActiveComponent }) => {
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
    </div>
  );
};

export default ToggleNew;
