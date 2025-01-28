import React from 'react';

interface ToggleButtonsProps {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
  id: number;
}

const ToggleUpdate: React.FC<ToggleButtonsProps> = ({ id, activeComponent, setActiveComponent }) => {
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

        Edit
      </button>
    </div>
  );
};

export default ToggleUpdate;
