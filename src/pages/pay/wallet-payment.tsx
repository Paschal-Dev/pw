import {
  Box,
  Grid,
  // IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import VideoThumb from "../../components/pay/video-thumb";
import { theme } from "../../assets/themes/theme";
// import { Icon } from "@iconify/react/dist/iconify.js";
import WalletProcessingDetails from "../../components/pay/wallet-payment-processing-details";
import PaymentProcessingLoader from "../../components/pay/payment-processing-loader";
import PaymentSuccessful from "../../components/pay/wallet-payment-successful";
import WalletPaymentDetails from "../../components/pay/walletpayment-details";
// import { PageProps } from "../../utils/myUtils";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import PaymentFailed from "../../components/pay/payment-failed";
import WrongPayment from "../../components/pay/wrong-payment";
import WalletPaymentWrongDetails from "../../components/pay/wallet-payment-wrong-details";
import WalletPaymentFailedDetails from "../../components/pay/walletpayment-failed-details";
import NotYetPaidLoader from "../../components/pay/payment-not-yet-paid-loader";
import NotYetPaidDetails from "../../components/pay/wallet-payment-not-yet-paid-details";
import Gif from "../../components/pay/gif";

export default function WalletPayment(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<number>();
  const { walletPaymentDetails } = useSelector((state: RootState) => state.pay);
  

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

    if (walletPaymentDetails) {
      setPaymentStatus(walletPaymentDetails?.wallet_pay?.payment_status);
    }
   
  }, [walletPaymentDetails]);

  useEffect(() => {
    const preloaderTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(preloaderTimeout);
  }, []);

  useEffect(() => {
    // Check the payment status and start/stop loading accordingly
    if (paymentStatus === 0) {
      setIsLoading(true);
    } 

    if (paymentStatus === 1) {
      setIsLoading(false);
    } 

     // Check the payment status and start/stop loading accordingly
     if (paymentStatus === 2) {
      setIsLoading(true);
    } 

    // Check the payment status and start/stop loading accordingly
    if (paymentStatus === 3) {
      setIsLoading(false);
    } 

     // Check the payment status and start/stop loading accordingly
     if (paymentStatus === 5) {
      setIsLoading(false);
    } 

  }, [paymentStatus]);
 

  return (
    <Box pt={1} flex={1}>
      <Grid container spacing={2} height={"100%"}>
        <Grid item xs={12} sm={12} md={4} lg={4} display={"flex"}>
          {isLoading ? (
            <Box
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              {deviceType !== "mobile" && deviceType !== "tablet" && <VideoThumb/>}
              {deviceType !== "mobile" && deviceType !== "tablet" && <Gif/>}
            </Box>
          ) : (
            <Box
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              {deviceType !== "mobile" && deviceType !== "tablet" && <VideoThumb/>}
              {deviceType !== "mobile" && deviceType !== "tablet" && <Gif/>}
            </Box>
          )}
        </Grid>
        <Grid item sm={12} md={8} lg={8} display={"flex"}>
          <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              bgcolor={theme.palette.primary.dark}
              p={1}
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              {/* <IconButton onClick={() => setCurrentPage("wallet-confirm")}>
                <Icon
                  icon="ion:arrow-back"
                  fontSize={deviceType === "mobile" ? 28 : 30}
                  color="#fff"
                />
              </IconButton> */}
              <Box
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
                color={"#fff"}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  fontSize={deviceType === "mobile" ? 18 : 20}
                  textAlign={"center"}
                  textTransform={"uppercase"}
                >
                  {t("payment-status")}
                </Typography>
                <Typography
                  variant={deviceType === "mobile" ? "caption" : "h6"}
                  color={theme.palette.secondary.light}
                  border={"1px solid white"}
                  borderRadius={2}
                  px={2}
                >
                  #{walletPaymentDetails?.data?.unique_id}
                </Typography>
              </Box>
            </Box>
            <Box
              bgcolor={"#fff"}
              style={{ borderRadius: "0 0 8px 8px" }}
              display={"flex"}
              flexDirection={"row"}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} md={5} lg={5} display={"flex"}>
                  {isLoading || paymentStatus === 0 ? (
                    <NotYetPaidLoader />
                  ) : paymentStatus === 1 ? (  <PaymentSuccessful />  ) : paymentStatus === 2 ? (  <PaymentProcessingLoader />  ) : paymentStatus === 3 ? ( <WrongPayment /> ) :  paymentStatus === 5 ? (  <PaymentFailed /> ) : (<Box />) }
                </Grid>

                <Grid item xs={12} md={7} lg={7}>
                  {isLoading || paymentStatus === 0 ? (
                    <NotYetPaidDetails />
                  ) :   paymentStatus === 1 ? (<WalletPaymentDetails /> ) : paymentStatus === 2 ? (  <WalletProcessingDetails />  ) : paymentStatus === 3 ? ( <WalletPaymentWrongDetails /> ) :  paymentStatus === 5 ? ( <WalletPaymentFailedDetails /> ) : (<Box/>)}
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
