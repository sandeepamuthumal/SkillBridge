import React, { useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const StatusFilter = ({ onFilterChange }) => {
  const statusOptions = ["All", "Draft", "Published", "Paused", "Closed", "Expired"];
  const [selectedStatus, setSelectedStatus] = useState("All");

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (onFilterChange) onFilterChange(value); // send value to parent
  };

  return (
    <div className="w-44">
      <Select value={selectedStatus} onValueChange={handleStatusChange}>
        <SelectTrigger>{selectedStatus}</SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
