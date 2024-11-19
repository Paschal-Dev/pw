import React from "react";
import { Box } from "@mui/material";
import checkoutGif from "../../assets/images/pw-checkout-gif-white.gif";

export default function Gif(): React.JSX.Element {
  return (
    <Box position={"relative"}>
      <img
        src={checkoutGif}
        width={"100%"}
        style={{
          boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.1)",
          borderRadius: 10,
        }}
      />
    </Box>
  );
}
