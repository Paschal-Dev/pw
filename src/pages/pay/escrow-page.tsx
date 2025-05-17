import { Backdrop, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useState, useEffect } from "react";
import VideoThumb from "../../components/pay/video-thumb";
import { theme } from "../../assets/themes/theme";
import menu from "../../assets/images/menu.svg";
import EscrowConfirmDetails from "../../components/pay/escrow-confirm-details";
import EscrowStatus from "../../components/pay/escrow-status";
import EscrowConfirm from "../../components/pay/escrow-confirm";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import loader from "../../assets/images/loader.gif";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Chat from "../../components/pay/chat";
import ManualEscrow from "../../components/pay/manual-escrow";
import {
  setConfirmButtonBackdrop,
  setCurrentPage,
  setP2PVendorsDetails,
  setPaymentDetails,
  setOTPVerified,
} from "../../redux/reducers/pay";
import APIService from "../../services/api-service";

export default function EscrowPage(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { p2pEscrowDetails, paymentDetails, lang, payId } = useSelector(
    (state: RootState) => state.pay
  );
  const { isConfirmButtonBackdrop } = useSelector(
    (state: RootState) => state.button
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null;
    }
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
  const currencySign = React.useMemo(
    () => decodeHtmlEntity(paymentDetails?.data?.currency_sign || ""),
    [paymentDetails]
  );

  // Convert symbol to currency code if available
  const displayCurrency = currencyMap[currencySign] || currencySign;

  const handleChatToggle = (chatOpen: boolean) => {
    setIsChatOpen(chatOpen);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  // Callback to mark messages as read (passed to Chat)
  const handleChatOpen = () => {
    // This will be called by ManualEscrow when chat is opened
  };

  React.useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);

useEffect(() => {
  const intervalId = setInterval(async () => {
    const userIP = await fetchUserIP();
    if (!userIP) {
      console.error("Could not fetch IP");
      return;
    }

    const continuousEscrowPayload = {
      call_type: "pay",
      ip: userIP,
      lang: lang,
      pay_id: payId,
    };

    try {
      const resp = await APIService.sendOTP(continuousEscrowPayload);
      console.log("Escrow Payload Response:", resp.data);

      if (resp.data?.escrow_status === 0) {
        // Escrow is not active, transition to P2P page
        clearInterval(intervalId);
        const p2pPayload = {
          call_type: "p2p_vendors",
          ip: userIP,
          lang: lang,
          pay_id: payId,
        };
        const respo2 = await APIService.p2pVendors(p2pPayload);
        dispatch(setP2PVendorsDetails(respo2.data));
        dispatch(setConfirmButtonBackdrop(false));
        dispatch(setCurrentPage("p2p"));
      } else {
        // Escrow is active
        dispatch(setPaymentDetails(resp.data));
        if (resp.data?.data?.verify === 0) {
          // Verification pending, go to PayDashboard for OTP verification
          dispatch(setConfirmButtonBackdrop(false));
          dispatch(setOTPVerified(false));
          dispatch(setCurrentPage("pay"));
        } else if (resp.data?.data?.verify === 1) {
          // Verification complete, stay on EscrowPage
          dispatch(setConfirmButtonBackdrop(false));
          dispatch(setOTPVerified(true));
          // Stay on EscrowPage, no need to change page
        }
      }
    } catch (error) {
      console.error("Error during Escrow Payload:", error);
    }
  }, 10000);

  return () => clearInterval(intervalId);
}, [dispatch, lang, payId]);

  return (
    <>
      <Helmet>
        <title>
          {paymentDetails?.data
            ? `Escrow || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
        <meta
          property="og:description"
          content={
            paymentDetails?.data
              ? `Escrow || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
              : "Escrow Page"
          }
        />
        <meta
          property="og:image"
          content={paymentDetails?.seller?.image || ""}
        />
      </Helmet>
      <Box pt={1} flex={1}>
        <Grid container height={"100%"}>
          <Grid item xs={12} sm={12} md={4} lg={4} display={"flex"}>
            <Box
              flex={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              gap={deviceType === "mobile" ? 2 : 2}
              mr={deviceType === "mobile" ? 0 : 4}
            >
              {deviceType !== "mobile" && deviceType !== "tablet" && (
                <EscrowStatus />
              )}
              {deviceType !== "mobile" && deviceType !== "tablet" && (
                <VideoThumb />
              )}
            </Box>
          </Grid>
          {isChatOpen ? (
            <Chat
              deviceType={deviceType}
              onClose={handleChatClose}
              onChatOpen={handleChatOpen}
            />
          ) : (
            <Grid item sm={12} md={8} lg={8} display={"flex"}>
              <Box flex={1} display={"flex"} flexDirection={"column"}>
                <Box
                  bgcolor={theme.palette.primary.dark}
                  p={1}
                  borderRadius={2}
                  display={"flex"}
                  alignItems={"center"}
                  gap={deviceType === "mobile" ? 1 : 4}
                  flex={1}
                >
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
                      fontSize={deviceType === "mobile" ? 16 : "4vh"}
                      fontWeight={700}
                    >
                      {t("blc_pw_3")} #{p2pEscrowDetails?.pay?.unique_id}
                    </Typography>
                  </Box>
                </Box>
                <Grid container spacing={2} height={"100%"}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    lg={5}
                    md={5}
                    sx={{ display: "flex" }}
                  >
                    {p2pEscrowDetails?.p2p_type === "auto" ? (
                      <EscrowConfirm />
                    ) : p2pEscrowDetails?.p2p_type === "manual" ? (
                      <ManualEscrow onChatToggle={handleChatToggle} />
                    ) : null}
                  </Grid>
                  <Grid item xs={12} sm={7} lg={7} md={7} display={"flex"}>
                    <EscrowConfirmDetails />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {isConfirmButtonBackdrop && (
        <Backdrop open={isConfirmButtonBackdrop} sx={{ zIndex: 1000 }}>
          <img src={loader} alt="test" />
        </Backdrop>
      )}
    </>
  );
}
