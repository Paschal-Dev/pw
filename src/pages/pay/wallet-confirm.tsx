import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import React from "react";
import VideoThumb from "../../components/pay/video-thumb";
import { theme } from "../../assets/themes/theme";
// import Otp from "../../components/pay/otp";
import menu from "../../assets/images/menu.svg";
import { Icon } from "@iconify/react/dist/iconify.js";
import WalletConfirmCard from "../../components/pay/wallet-confirm-card";
import WalletConfirmDetails from "../../components/pay/wallet-confirm-details";
// import { PageProps } from "../../utils/myUtils";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import WalletOtp from "../../components/pay/wallet-otp";
import { setButtonClicked, setCurrentPage} from "../../redux/reducers/pay";

import { useTranslation } from "react-i18next";

export default function WalletConfirm(): React.JSX.Element{
  const [deviceType, setDeviceType] = React.useState("mobile");
  const { paymentDetails } = useSelector((state: RootState) => state.pay);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // const [, setOtpVerified] = useState(false);

  // const handleOtpVerification = (isVerified: boolean) => {
  //   setOtpVerified(isVerified);
  // };

  const backButtonClicked = () => {
    dispatch(setButtonClicked(false));
    dispatch(setCurrentPage("pay"));
  }

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
    <Box flex={1}>
      <Grid container height={"100%"} spacing={2}>
        <Grid item xs={12} sm={12} md={4} lg={4} display={"flex"}>
          <Box
            flex={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            gap={2}
          >
            {deviceType !== "mobile" && deviceType !== "tablet" && (
              <WalletOtp
                // onOtpVerification={handleOtpVerification}
                deviceType={deviceType}
              />
            )}
            {deviceType !== "mobile" && deviceType !== "tablet" && (
              <VideoThumb />
            )}
          </Box>
        </Grid>
        <Grid item sm={12} md={8} lg={8} display={"flex"}>
          <Box flex={1} display={"flex"} flexDirection={"column"}>
            <Box
              bgcolor={theme.palette.primary.dark}
              p={1}
              borderRadius={2}
              display={"flex"}
              gap={deviceType === "mobile" ? 1 : 4}
              flex={1}
            >
              <IconButton onClick={backButtonClicked}>
                <Icon
                  icon="ion:arrow-back"
                  fontSize={deviceType === "mobile" ? 28 : 30}
                  color="#fff"
                />
              </IconButton>
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={deviceType === "mobile" ? "center" : "none"}
                color={"#fff"}
                gap={1}
                px={1}
                textAlign={deviceType === "mobile" ? "center" : "start"}
              >
                <Box
                  borderRadius={"50%"}
                  bgcolor={"white"}
                  p={1}
                  justifyContent="center"
                  alignContent="center"
                  textAlign="center"
                  height={deviceType === "mobile" ? 16 : 20}
                  display={deviceType === "mobile" ? "none" : "block"}
                >
                  <img
                    src={menu}
                    width={deviceType === "mobile" ? "16px" : "18px"}
                    height={deviceType === "mobile" ? "12px" : "14px"}
                    style={{ backgroundColor: "#009FDD", padding: "2px" }}
                  />
                </Box>
                <Typography
                  fontSize={deviceType === "mobile" ? 18 : "4vh"}
                  fontWeight={700}
                >
                  {t("confirm-order")} #{paymentDetails?.data?.unique_id}
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={5} lg={5} md={5} display={"flex"}>
                <WalletConfirmCard
                  deviceType={deviceType}
                />
              </Grid>
              <Grid item xs={12} sm={7} lg={7} md={7}>
                <WalletConfirmDetails />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
