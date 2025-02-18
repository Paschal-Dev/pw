import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import VideoThumb from "../../components/pay/video-thumb";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import P2pProcessingDetails from "../../components/pay/p2p-payment-processing-details";
import PaymentProcessingLoader from "../../components/pay/payment-processing-loader";
import Gif from "../../components/pay/gif";
import PaymentSuccessful from "../../components/pay/p2p-payment-successful";
import NotYetPaidLoader from "../../components/pay/payment-not-yet-paid-loader";
import PaymentFailed from "../../components/pay/payment-failed";
import WrongPayment from "../../components/pay/wrong-payment";
import P2pPaymentFailedDetails from "../../components/pay/p2p-payment-failed-details ";
import P2pPaymentWrongDetails from "../../components/pay/p2p-payment-wrong-details";
import P2pPaymentDetails from "../../components/pay/p2ppayment-details";
import { Icon } from "@iconify/react/dist/iconify.js";
// import APIService from "../../services/api-service";
import { setCurrentPage } from "../../redux/reducers/pay";
import { Helmet } from "react-helmet";

export default function P2PPayment(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isLoading, setIsLoading] = useState(true);
  // const [p2pEscrowDetails?.pay?.payment_status, setp2pEscrowDetails?.pay?.payment_status] = useState<number>();
  const { p2pEscrowDetails, paymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const dispatch = useDispatch();

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

  // useEffect(() => {

  //   if (p2pEscrowDetails) {
  //     setp2pEscrowDetails?.pay?.payment_status(p2pEscrowDetails?.pay?.payment_status);
  //   }

  // }, [p2pEscrowDetails]);

  useEffect(() => {
    const preloaderTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 300000);

    return () => clearTimeout(preloaderTimeout);
  }, []);

  useEffect(() => {
    // Check the payment status and start/stop loading accordingly
    if (p2pEscrowDetails?.pay?.payment_status === 0) {
      setIsLoading(true);
    }

    if (p2pEscrowDetails?.pay?.payment_status === 1) {
      setIsLoading(false);
    }

    // Check the payment status and start/stop loading accordingly
    if (p2pEscrowDetails?.pay?.payment_status === 2) {
      setIsLoading(true);
    }

    // Check the payment status and start/stop loading accordingly
    if (p2pEscrowDetails?.pay?.payment_status === 3) {
      setIsLoading(false);
    }

    // Check the payment status and start/stop loading accordingly
    if (p2pEscrowDetails?.pay?.payment_status === 5) {
      setIsLoading(false);
    }
  }, [p2pEscrowDetails?.pay?.payment_status]);

  const backButtonClicked = async () => {
    dispatch(setCurrentPage("escrow-page"));
    // const sendOtpPayload = {
    //   call_type: "pay",
    //   ip: "192.168.0.0",
    //   lang: "en",
    //   pay_id: payId,
    // };

    // try {
    //   const resp = await APIService.sendOTP(sendOtpPayload);
    //   console.log("API Response from Back Button Click:", resp.data);

    //   if (resp.data?.escrow_status === 1) {

    //     // console.log("Already redirected, displaying escrow page.");
    //     dispatch(setButtonClicked(true));
    //     dispatch(setP2PEscrowDetails(resp.data));
    //     dispatch(setCurrentPage("escrow-page"));

    //   } else {
    //     console.log("Escrow status is 0.");
    //     dispatch(setButtonClicked(false));
    //     dispatch(setCurrentPage("pay"));
    //   }
    // } catch (error) {
    //   console.error("Error during Back Button Click:", error);
    // }
  };

  // Function to decode HTML entities
  const decodeHtmlEntity = (entity: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = entity;
    return txt.value;
  };

  // Currency mapping
  const currencyMap: { [key: string]: string } = {
    $: "USD",
    "€": "EUR",
    "£": "GBP",
    "₦": "NGN",
    "₹": "INR",
    "¥": "JPY",
    "₿": "BTC",
    "₩": "KRW",
    "₽": "RUB",
    "₮": "MNT",
    "₴": "UAH",
    "₪": "ILS",
    "₫": "VND",
  };

  // Get the decoded currency symbol
  const currencySign = useMemo(
    () => decodeHtmlEntity(paymentDetails?.data?.currency_sign || ""),
    [paymentDetails]
  );

  // Convert symbol to currency code if available
  const displayCurrency = currencyMap[currencySign] || currencySign;

  return (
    <>
      <Helmet>
        <title>
          {paymentDetails?.data
            ? `Payment || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
        <meta
          property="og:description"
          content={
            paymentDetails?.data
              ? `Payment || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
              : "Payment Page"
          }
        />
        <meta
          property="og:image"
          content={paymentDetails?.seller?.image || ""}
        />
      </Helmet>
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
                {deviceType !== "mobile" && deviceType !== "tablet" && (
                  <VideoThumb />
                )}
                {deviceType !== "mobile" && deviceType !== "tablet" && <Gif />}
              </Box>
            ) : (
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                {deviceType !== "mobile" && deviceType !== "tablet" && (
                  <VideoThumb />
                )}
                {deviceType !== "mobile" && deviceType !== "tablet" && <Gif />}
              </Box>
            )}
          </Grid>
          <Grid item sm={12} md={8} lg={8} display={"flex"}>
            <Box flex={1} display={"flex"} flexDirection={"column"} gap={1}>
              <Box
                bgcolor={theme.palette.primary.dark}
                p={2}
                flex={1}
                style={{ borderRadius: "8px 8px 0 0" }}
              >
                <IconButton onClick={backButtonClicked}>
                  <Icon icon="ion:arrow-back" fontSize={35} color={"#fff"} />
                </IconButton>
                <Box
                  p={1}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  style={{ borderRadius: "8px 8px 0 0" }}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    color={"#fff"}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      fontSize={deviceType === "mobile" ? 18 : 25}
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
                      #{p2pEscrowDetails?.pay?.unique_id}
                    </Typography>
                  </Box>
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
                    {isLoading ||
                    p2pEscrowDetails?.pay?.payment_status === 0 ? (
                      <NotYetPaidLoader />
                    ) : p2pEscrowDetails?.pay?.payment_status === 1 ? (
                      <PaymentSuccessful />
                    ) : p2pEscrowDetails?.pay?.payment_status === 2 ? (
                      <PaymentProcessingLoader />
                    ) : p2pEscrowDetails?.pay?.payment_status === 3 ? (
                      <WrongPayment />
                    ) : p2pEscrowDetails?.pay?.payment_status === 5 ? (
                      <PaymentFailed />
                    ) : (
                      <Box />
                    )}
                  </Grid>

                  <Grid item xs={12} md={7} lg={7}>
                    {isLoading ||
                    p2pEscrowDetails?.pay?.payment_status === 0 ? (
                      <P2pProcessingDetails />
                    ) : p2pEscrowDetails?.pay?.payment_status === 1 ? (
                      <P2pPaymentDetails />
                    ) : p2pEscrowDetails?.pay?.payment_status === 2 ? (
                      <P2pProcessingDetails />
                    ) : p2pEscrowDetails?.pay?.payment_status === 3 ? (
                      <P2pPaymentWrongDetails />
                    ) : p2pEscrowDetails?.pay?.payment_status === 5 ? (
                      <P2pPaymentFailedDetails />
                    ) : (
                      <Box />
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
