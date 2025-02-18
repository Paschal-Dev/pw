import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";

export default function WalletProcessingLoader(): React.JSX.Element {
  const [deviceType, setDeviceType] = useState("mobile");
  const [showPreloader, setShowPreloader] = useState(true);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);
  useEffect(() => {
    const preloaderTimeout = setTimeout(() => {
      setShowPreloader(true);
    }, 5000);
    return () => clearTimeout(preloaderTimeout);
  }, []);
  return (
    <Box
      boxShadow={
        "0px 1.3486182689666748px 5.394473075866699px  0px  rgba(0, 0, 0, 0.15)"
      }
      alignItems={"center"}
      p={4}
      borderRadius={3}
      display={"flex"}
      flexDirection={"column"}
      position={"relative"}
      height={"22vh"}
    >
      <Box
        top={0}
        borderRadius={25}
        bgcolor={"#FFFAEB"}
        width={30}
        height={30}
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          borderRadius={50}
          bgcolor={"#FEEFC6"}
          width={"20%"}
          height={"20%"}
          p={4}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            display={"flex"}
            justifyContent={"center"}
            width={40}
            height={40}
            p={2}
          >
            {showPreloader && <CircularProgress style={{ color: "#FEC84B" }} />}
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        color={"#fff"}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          color={theme.palette.secondary.main}
          fontWeight={700}
          fontSize={18}
        >
          {t("payment-in-progress")}
        </Typography>
        <Typography
          fontSize={deviceType === "mobile" ? 10 : 9}
          fontWeight={deviceType === "mobile" ? 400 : 500}
          color={"black"}
          textAlign={"center"}
        >
          {t("this-payment")}
        </Typography>
      </Box>
    </Box>
  );
}
