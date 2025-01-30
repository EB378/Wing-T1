import React, { useEffect, useState } from "react";
import { getLogs } from "@/app/actions";

interface ResourcesOption {
  id: number;
  name: string;
}

const PicSelect: React.FC<{ name: string; value: string; onChange: (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void; }> = ({ name, value, onChange }) => {
  const [options, setOptions] = useState<ResourcesOption[]>([]);
  const [customOption, setCustomOption] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const logs = await getLogs();
        console.log("Retrieval of logs:", logs);
        
        // Remove duplicates by converting to a Map and back to an array
        const uniqueOptions = Array.from(
          new Map(logs.map((ac: any) => [ac.pic, { id: ac.id, name: ac.pic }])).values()
        );
        
        setOptions([...uniqueOptions, { id: -1, name: "Other" }]);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };
    fetchResources();
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

export default PicSelect;
