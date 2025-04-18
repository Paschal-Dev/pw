import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import error from "../../assets/images/error.svg";
export default function PaymentFailed(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  React.useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);
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
      width={"100%"}
      height={"auto"}
    >
      <Box
        top={0}
        borderRadius={"50%"}
        bgcolor={"#ff000023"}
        width={80}
        p={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box borderRadius={"50%"} bgcolor={"#ff00005b"} width={60} p={2}>
          <Box display={"flex"} justifyContent={"center"}>
            <img src={error} alt="" width={50} />
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        color={"#fff"}
        gap={deviceType === "mobile" ? 2 : 1}
        mt={3}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          color={"#ff0000"}
          fontWeight={800}
          fontSize={deviceType === "mobile" ? 14 : 16}
        >
         {t("payment-failed")}
        </Typography>
        <Typography
          variant="caption"
          color={"#ff0000"}
          pb={deviceType === "mobile" ? 2 : 3}
        >
          {t("has-failed")}
        </Typography>
      </Box>
      
    </Box>
  );
}