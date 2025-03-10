import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  Button,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setCurrentPage, setP2PEscrowDetails } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";

export default function NotYetPaidLoader(): React.JSX.Element {
  const { p2pEscrowDetails, payId } = useSelector((state: RootState) => state.pay);
  const [deviceType, setDeviceType] = useState("mobile");
  const [showPreloader, setShowPreloader] = useState(true);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const dispatch = useDispatch();
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

   const handlePaymentClick = () => {
      const width = window.innerWidth * 0.5;
      const height = window.innerHeight * 0.6;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      const paymentLink = p2pEscrowDetails?.vendor?.payment_link;
  
      if (!paymentLink) {
        console.log("No payment link provided");
        return;
      }
    
      // Attempt to open the popup
      const popup = window.open(
        paymentLink,
        "PaymentWindow",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
    
      if (popup) {
        // Popup was allowed
        popup.focus();
        console.log("Popup opened successfully");
      } else {
        // Popup was blocked, open in a new tab
        window.open(paymentLink, "_blank");
        console.log("Popup was blocked, opening in a new tab");
      }
  
      dispatch(setCurrentPage("p2p-payment"));
      const checkPaymentStatus = setInterval(() => {
        const body = {
          call_type: "pay",
          ip: "192.168.0.0",
          lang: "en",
          pay_id: payId,
        };
        APIService.sendOTP(body)
          .then((resp) => {
            if ([0, 1, 2, 3, 5].includes(resp.data?.pay?.payment_status)) {
              console.log("Status Check", resp.data?.pay?.payment_status);
              dispatch(setP2PEscrowDetails(resp.data));
              if (resp.data?.pay?.payment_status === 1) {
  
                clearInterval(checkPaymentStatus);
                dispatch(setP2PEscrowDetails(resp.data));
  
                const url = `https://pay.peerwallet.com/?v=${resp.data.data.unique_id}`;
  
                const RedirectUrl = resp.data.data.redirect_url;
  
                if (RedirectUrl === url) {
                  dispatch(setCurrentPage("p2p-payment"));
                } else {
                  console.log("Payment Successful, rendering success page", RedirectUrl);
                  window.location.assign(RedirectUrl);
                }
              } else if (resp.data?.pay?.payment_status === 5) {
                console.log("Status Check", resp.data?.pay?.payment_status);
                console.log("Payment failed, rendering error page");
                if (popup && !popup.closed) {
                  popup.close();
                }
                clearInterval(checkPaymentStatus);
                dispatch(setP2PEscrowDetails(resp.data));
                dispatch(setCurrentPage("p2p-payment"));
              } else if (resp.data?.pay?.payment_status === 3) {
                console.log("Status Check", resp.data?.pay?.payment_status);
                console.log("Wrong Payment");
                if (popup && !popup.closed) {
                  popup.close();
                }
                clearInterval(checkPaymentStatus);
                dispatch(setP2PEscrowDetails(resp.data));
                dispatch(setCurrentPage("p2p-payment"));
              }
  
            }
          })
          .catch((error) => {
            console.error(error);
          });
  
  
        if (popup && popup.closed) {
          console.log("Payment window closed by the user.");
          // dispatch(setCurrentPage("p2p-payment"));
        }
        // if (paymentWindow.close()) {
  
        //   clearInterval(checkWindowClosed);
  
        //   setTimeout(() => {
        //     dispatch(setCurrentPage("p2p-payment"));
        //   }, 2000);
  
        //   console.log("Payment Window Closed =>>> ");
        //   dispatch(setShouldRedirectEscrow(true));
  
        // }
      }, 5000);
    };

  return (
    <Box
      boxShadow={
        "0px 1.3486182689666748px 5.394473075866699px  0px  rgba(0, 0, 0, 0.15)"
      }
      alignItems={"center"}
      width={deviceType === "mobile" ? '100%' : 400}
      p={6}
      borderRadius={3}
      display={"flex"}
      flexDirection={"column"}
      position={"relative"}
      height={deviceType === "mobile" ? 'auto' : "34vh"}
    >
      <Box
        marginTop={deviceType === "mobile" ? 0 : 5}
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
        mb={4}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          color={theme.palette.secondary.main}
          fontWeight={700}
          fontSize={18}
        >
          {t("not-yet-paid")}
        </Typography>
        <Typography
          fontSize={deviceType === "mobile" ? 10 : 9}
          fontWeight={deviceType === "mobile" ? 400 : 500}
          color={"black"}
          textAlign={"center"}
        >
          Awaiting Payment
        </Typography>
      </Box>
        <Button
          variant="contained"
          sx={{
            width: "100%",
            paddingY: 1.5,
            borderRadius: 2,
            ":hover": { background: theme.palette.primary.main },
            fontSize: 20,
            fontWeight: 700,
          }}
          onClick={handlePaymentClick}
        >
          {t("blc_pw_19")}
        </Button>
    </Box>
  );
}
