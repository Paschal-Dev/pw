import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import questionmark from "../../assets/images/questionmark.svg";
export default function WrongPayment(): React.JSX.Element {
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
      height={deviceType === "mobile" ? '22vh' : "37vh"}
    >
      <Box
        marginTop={deviceType === "mobile" ? 0 : 5}
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
            <img src={questionmark} alt="" width={50} />
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
         {t("wrong-payment")}
        </Typography>
        <Typography
          variant="caption"
          color={"#ff0000"}
          pb={deviceType === "mobile" ? 2 : 3}
        >
          {t("wrong")}
        </Typography>
      </Box>
      
    </Box>
  );
}