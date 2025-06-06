import { Backdrop, Box, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useState, useEffect } from "react";
import VideoThumb from "../../components/pay/video-thumb";
import { theme } from "../../assets/themes/theme";
import menu from "../../assets/images/menu.svg";
import EscrowConfirmDetails from "../../components/pay/escrow-confirm-details";
import EscrowStatus from "../../components/pay/escrow-status";
import EscrowConfirm from "../../components/pay/escrow-confirm";
import {
  useDispatch,
  // useDispatch,
  useSelector,
} from "react-redux";
import { RootState } from "../../redux/store";
import loader from "../../assets/images/loader.gif";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import Chat from "../../components/pay/chat";
import ManualEscrow from "../../components/pay/manual-escrow";
import { setChatDetails } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";
import { Icon } from "@iconify/react/dist/iconify.js";


export default function EscrowPage(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [manualPaymentStatus, setManualPaymentStatus] = useState(false);

  const [showFirstMessage, setShowFirstMessage] = useState(false);
  const [firstMessageContent, setFirstMessageContent] = useState("");

  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const {
    p2pEscrowDetails,
    paymentDetails,
    confirmPaymentDetails,
    lang,
    payId,
    chatDetails,
  } = useSelector((state: RootState) => state.pay);
  const { isConfirmButtonBackdrop } = useSelector(
    (state: RootState) => state.button
  );
  // const dispatch = useDispatch();
  const { t } = useTranslation();

  const [countdown, setCountdown] = useState(30); // Start countdown at 15 on mount
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
  };

  const checkStatus =
    (p2pEscrowDetails?.confirm_manual_payment !== 0 &&
      p2pEscrowDetails?.confirm_manual_payment !== null) ||
    confirmPaymentDetails ||
    manualPaymentStatus;

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

  //   const handleChatToggle = () => {
  //   const newChatState = !isChatOpen;
  //   setIsChatOpen(newChatState);
  //   onChatToggle(newChatState);
  //   if (newChatState) {
  //     handleChatOpen();
  //     onChatOpen?.();
  //   }
  // };

  // const Chat = () => {
  //   handleChatToggle();
  // };

  React.useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (p2pEscrowDetails?.p2p_type !== "manual") return;

    const handleChatCheck = async () => {
      try {
        const userIP = await fetchUserIP();
        if (!userIP) {
          console.error("Unable to retrieve user IP");
          return;
        }

        const payload = {
          call_type: "p2p_chat",
          ip: userIP,
          lang: lang,
          pay_id: payId,
        };

        const response = await APIService.p2pChat(payload);
        dispatch(setChatDetails(response.data));
        console.log("Chat details fetched successfully:", response.data);
        console.log("First Message:", response.data.first_message);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    };

    // Initial call
    handleChatCheck();

    // Set up interval for every 5 seconds
    const intervalId = setInterval(handleChatCheck, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [p2pEscrowDetails?.p2p_type, lang, payId, dispatch]);

   // Countdown effect on mount
    useEffect(() => {
      let timer: ReturnType<typeof setInterval> | null = null;
      if (countdown > 0) {
        timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      }
      return () => {
        if (timer) clearInterval(timer);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatDetails?.first_message) {
        setFirstMessageContent(chatDetails.first_message);
        setShowFirstMessage(true);

        // Auto-hide after 60 seconds
        setTimeout(() => setShowFirstMessage(false), 60000);
      }
    }, 5000); // Wait 5 seconds

    return () => clearTimeout(timeout);
  }, [chatDetails?.first_message]);

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
            <Chat deviceType={deviceType} onChatToggle={handleChatToggle} />
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
                      <ManualEscrow
                      countDown={countdown}
                        onChatToggle={handleChatToggle}
                        checkStatus={checkStatus}
                        setCheckStatus={setManualPaymentStatus}
                      />
                    ) : null}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={7}
                    lg={7}
                    md={7}
                    display={"flex"}
                    position="relative"
                  >
                    {showFirstMessage && (
                      <Box
                        position="absolute"
                        top="5%"
                        right="2%"
                        sx={{
                          bgcolor: "background.paper",
                          boxShadow: 5,
                          p: 2,
                          borderRadius: 3,
                          width: "100%",
                          maxWidth: 400,
                          zIndex: 2000,
                          position: "absolute",
                          cursor: "pointer",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            top: "50%",
                            right: "-10px",
                            transform: "translateY(-50%)",
                            width: 0,
                            height: 0,
                            borderTop: "10px solid transparent",
                            borderBottom: "10px solid transparent",
                            borderLeft: "10px solid #fff",
                          },
                        }}
                        onClick={handleChatToggle}
                      >
                        <Box display="flex" alignItems={"center"} justifyContent={"center"} gap={1}>
                          <Icon icon="material-symbols:mail-rounded" fontSize={24} />
                          <Typography variant="body1" fontWeight={700}>
                           {t("blc_pw_109")} {p2pEscrowDetails?.vendor?.use_name}
                          </Typography>
                        </Box>
                        <hr/>
                        <Typography variant="body1" fontWeight={500}>{firstMessageContent}</Typography>
                      </Box>
                    )}
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
