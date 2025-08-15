import React from "react";
import Box from "@mui/material/Box";

function ColorBar({ colorBarColors }) {
  return (
    <Box width="100%" display="flex" height={2}>
      {colorBarColors.map((color, idx) => (
        <Box
          key={idx}
          sx={{
            height: 2,
            width: `${100 / colorBarColors.length}%`,
            bgcolor: color,
            mr: idx !== colorBarColors.length - 1 ? "0.1%" : 0,
          }}
        />
      ))}
    </Box>
  );
}

export default ColorBar;
