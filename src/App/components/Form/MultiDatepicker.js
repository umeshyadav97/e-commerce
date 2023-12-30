import React, { useState } from "react";
import { Button } from "@material-ui/core";

import MultipleDatesPicker from "@randex/material-ui-multiple-dates-picker";

const MultiDatepicker = ({ value = [], onSelect = () => {} }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(!open)}>
        Select Dates
      </Button>
      <MultipleDatesPicker
        open={open}
        selectedDates={value}
        onCancel={() => setOpen(false)}
        onSubmit={(dates) => {
          setOpen(false);
          onSelect(dates);
        }}
      />
    </div>
  );
};

export default MultiDatepicker;
