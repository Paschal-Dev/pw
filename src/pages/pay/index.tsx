/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container } from "@mui/material";
import React, { useState, useEffect } from "react";
import Footer from "../../layouts/footers/pay/footer";
import Disclaimer from "../../layouts/sections/pay/disclaimer";
import background from "../../assets/images/bg.png";
import Topbar from "../../layouts/navbars/pay/topbar";
import PayDashboard from "./pay-dashboard";
import PayP2P from "./pay-p2p";
import WalletConfirm from "./wallet-confirm";
import WalletPayment from "./wallet-payment";
import APIService from "../../services/api-service";
import { useDispatch, useSelector } from "react-redux";
import {
  setOTPVerified,
  setPayId,
  setPaymentDetails,
  setWalletPaymentDetails,
  setP2PEscrowDetails,
} from "../../redux/reducers/pay";
import ErrorPage from "./error_page";
import EscrowPage from "./escrow-page";
import { RootState } from "../../redux/store";
import { Helmet } from "react-helmet";
import { setButtonClicked, setCurrentPage, setApiResponse } from "../../redux/reducers/pay";
import P2PPayment from "./p2p-payment";

export default function Pay(): React.JSX.Element {
  const [errorResponse, setErrorResponse] = useState(null);
  const [errorPage, setErrorPage] = useState(false);
  const { paymentDetails, currentPage } = useSelector(
    (state: RootState) => state.pay
  );

  const dispatch = useDispatch();

  const checkEscrowStatus = async () => {
    const url = new URL(window.location.href);
    const payId = url.searchParams.get("v") || "";
    dispatch(setPayId(payId));
    if (!payId) {
      console.log("Invalid or missing Pay ID");
      setErrorPage(true);
      return;
    }

    const sendOtpPayload = {
      call_type: "pay",
      ip: "192.168.0.0",
      lang: "en",
      pay_id: payId,
    };

    try {
      const resp = await APIService.sendOTP(sendOtpPayload);
      console.log("Escrow Status Check Response:", resp.data);

      if (resp.data?.escrow_status === 1) {
        const checkoutLink = resp.data?.data?.checkout_link;

        if (checkoutLink) {
          if (!localStorage.getItem("redirectHandled")) {
            console.log("Redirecting to checkout link:", checkoutLink);
            localStorage.setItem("redirectHandled", "true");
            window.location.assign(checkoutLink);
            return;
          } else {
            console.log("Already redirected, displaying escrow page.");
            dispatch(setButtonClicked(true));
            dispatch(setCurrentPage("escrow-page"));
            dispatch(setP2PEscrowDetails(resp.data));
          }
        } else {
          console.log("No checkout link available.");
        }
      } else {
        handleNonEscrowResponse(resp.data);
      }
    } catch (error) {
      console.error("Error during escrow status check:", error);
      setErrorPage(true);
    }
  };

  const handleNonEscrowResponse = (data: any) => {
    if (data?.message?.toLowerCase()?.includes("verified")) {
      console.log("Message >>>", data?.message);
      dispatch(setOTPVerified(true));
    }

    if (data?.error_code === 400) {
      setErrorPage(true);
      setErrorResponse(data);
    } else {
      dispatch(setApiResponse(data));
      dispatch(setPaymentDetails(data));

      if (data?.otp_modal === 0 || !data?.otp_modal) {
        dispatch(setOTPVerified(true));
        const body = {
          call_type: "pay",
          ip: "192.168.0.0",
          lang: "en",
          pay_id: data?.pay_id,
        };
        APIService.sendOTP(body)
          .then((resp) => {
            if ([0, 1, 2, 3, 5].includes(resp.data?.pay?.payment_status)) {
              dispatch(setWalletPaymentDetails(resp.data));
              dispatch(setCurrentPage("wallet-payment"));
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        dispatch(setOTPVerified(false));
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkEscrowStatus();
    }, 10000); // Check escrow status every 10 seconds

    // Initial check on component mount
    checkEscrowStatus();

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const renderActivePage = () => {
    switch (currentPage) {
      case "pay/v":
        return <PayDashboard />;
      case "p2p":
        return <PayP2P />;
      case "p2p-payment":
        return <P2PPayment />;
      case "escrow-page":
        return <EscrowPage />;
      case "wallet-confirm":
        return <WalletConfirm />;
      case "wallet-payment":
        return <WalletPayment />;
      default:
        return <PayDashboard />;
    }
  };

  return (
    <Box
      height="100vh"
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
      zIndex={-2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Helmet>
        <title>
          {paymentDetails?.data
            ? `Pay ${paymentDetails.data.currency_sign}${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
        <meta
          property="og:description"
          content={
            paymentDetails?.data
              ? `Pay ${paymentDetails.data.currency_sign}${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
              : "Payment Page"
          }
        />
        <meta
          property="og:image"
          content={paymentDetails?.seller?.image || ""}
        />
      </Helmet>
      <Topbar />
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          py: 1,
        }}
      >
        {errorPage ? (
          <ErrorPage errorResponse={errorResponse} />
        ) : (
          renderActivePage()
        )}
        <Disclaimer />
        <Footer />
      </Container>
    </Box>
  );
}
