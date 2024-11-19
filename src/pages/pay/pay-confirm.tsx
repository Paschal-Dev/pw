import { Box, Grid } from "@mui/material";
import React from "react";
import VideoThumb from "../../components/pay/video-thumb";

export default function PayConfirm(): React.JSX.Element {
  return (
    <Box pt={1}>
      <Grid container>
        <Grid item sm={12} md={4} lg={4}>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <Box>OTP</Box>
            <VideoThumb/>
          </Box>
        </Grid>
        <Grid item sm={12} md={8} lg={8}>
          <Box></Box>
        </Grid>
      </Grid>
    </Box>
  );
}
