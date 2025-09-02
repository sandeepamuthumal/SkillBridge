import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const ArrayInputField = ({ values = [], onChange, placeholder = "Type and press Enter" }) => {
  const [inputValue, setInputValue] = useState("");

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }

    setInputValue("");
  };

  const removeItem = (index) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="space-y-2">
      {/* Input Field */}
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {/* Display added items as badges below */}
      <div className="flex flex-wrap gap-2 mt-2">
        {values.map((item, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1 rounded-sm"
          >
            {item}
            <X
              size={16}
              className="cursor-pointer hover:text-red-500"
              onClick={() => removeItem(idx)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ArrayInputField;
