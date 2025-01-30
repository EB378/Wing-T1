import React, { useEffect, useState } from "react";
import { getResources } from "@/app/actions";

interface RescoucesOption {
  id: number;
  name: string;
}

const RescoucesSelect: React.FC<{ name: string; value: string; onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void; }> = ({ name, value, onChange }) => {
  const [options, setOptions] = useState<RescoucesOption[]>([]);
  const [customOption, setCustomOption] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    const fetchRescouces = async () => {
      try {
        const rescouces = await getResources();
        console.log("Retivala ooff rescouces:", rescouces)
        setOptions([...rescouces.map((ac: any) => ({ id: ac.resource_id, name: ac.resource })), { id: -1, name: "Other" }]);
      } catch (error) {
        console.error("Error fetching rescouces:", error);
      }
    };
    fetchRescouces();
  }, []);

  return (
    <div>
      <select
        name={name}
        value={isCustom ? "Other" : value}
        onChange={(e) => {
          if (e.target.value === "Other") {
            setIsCustom(true);
          } else {
            setIsCustom(false);
            onChange(e);
          }
        }}
        className="border rounded p-2 w-full bg-white text-black"
      >
        {options.map((option) => (
          <option key={option.id} value={option.name}>{option.name}</option>
        ))}
      </select>
      {isCustom && (
        <input
          type="text"
          name={name}
          className="border rounded p-2 w-full mt-2"
          placeholder="Enter Aircraft Registration"
          value={customOption}
          onChange={(e) => {
            setCustomOption(e.target.value);
            onChange(e);
          }}
        />
      )}
    </div>
  );
};

export default RescoucesSelect;
