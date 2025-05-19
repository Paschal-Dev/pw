/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import Footer from "../../layouts/footers/pay/footer";
import Disclaimer from "../../layouts/sections/pay/disclaimer";
import background from "../../assets/images/bg.png";
import Topbar from "../../layouts/navbars/pay/topbar";
import PayDashboard from "./pay-dashboard";
import PayP2P from "./pay-p2p";
import WalletConfirm from "./wallet-confirm";
import WalletPayment from "./wallet-payment";
// import APIService from "../../services/api-service";
import { useDispatch, useSelector } from "react-redux";
import {
  setPayId,
  setErrorPage,
  // setLang,
  // setP2PVendorsDetails,
} from "../../redux/reducers/pay";
import ErrorPage, { ErrorProps } from "./error_page";
import EscrowPage from "./escrow-page";
import { RootState } from "../../redux/store";
import { Helmet } from "react-helmet";
// import { setCurrentPage, setApiResponse } from "../../redux/reducers/pay";
// import { setHeaderKey } from "../../redux/reducers/auth";
import P2PPayment from "./p2p-payment";
import APIService from "../../services/api-service";

export default function Pay({ errorResponse }: ErrorProps): React.JSX.Element {
  // const [errorPage, setErrorPage] = useState(false);
  const [isRedirecting] = useState(false);
  // const [hasCheckedEscrow, setHasCheckedEscrow] = useState(false); // Ensure only one check
  const { paymentDetails, currentPage, errorPage, lang } = useSelector(
    (state: RootState) => state.pay
  );

  const dispatch = useDispatch();

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

   useEffect(() => {
    const url = new URL(window.location.href);
    // Extract "v" parameter from URL
    const payId = url.searchParams.get("v") || "";
 
    const checkVerifyStatus = async () => {
      const userIP = await fetchUserIP();
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
 
      const verifyStatus = {
        call_type: "pay_verify_status",
        ip: userIP,
        lang: lang,
        pay_id: payId,
      };
 
      try {
        const resp = await APIService.verifyStatus(verifyStatus);
        console.log("Verify Status Check:", resp.data);
        // if (resp?.data?.message === "Successful") {
        //   // Escrow is not active, transition to P2P page
        //   const resendOtpPayload = {
        //     call_type: "resend_pay_otp",
        //     ip: userIP,
        //     lang: lang,
        //     pay_id: payId,
        //   };
        //   const respo2 = await APIService.resendOTP(resendOtpPayload);
        //   console.log("API RESPONSE FROM RESEND OTP =>>> ", respo2.data);
        // }
      } catch (error) {
        console.error("Error during Escrow Payload:", error);
      }
    };
 
    const initializePayment = async () => {
      if (!payId) {
        console.log("Invalid or missing Pay ID");
        setErrorPage(true);
        return;
      } else {
        dispatch(setPayId(payId));
      }
      
 
      // const sendOtpPayload = {
      //   call_type: "pay",
      //   ip: "192.168.0.0",
      //   lang: "en",
      //   pay_id: payId,
      // };
 
      // try {
      //   const resp = await APIService.sendOTP(sendOtpPayload);
      //   console.log("API Response from Send OTP:", resp.data);
      //   // handleNonEscrowResponse(resp.data);
      //   //   if (resp.data?.escrow_status === 1) {
      //   //     // console.log("Already redirected, displaying escrow page.");
      //   //     dispatch(setButtonClicked(true));
      //   //     dispatch(setCurrentPage("escrow-page"));
      //   //     dispatch(setP2PEscrowDetails(resp.data));
 
      //   //   } else {
      //   //     console.log("No checkout link or escrow status not 1.");
      //   //   }
      // } catch (error) {
      //   console.error("Error during Send OTP:", error);
      //   setErrorPage(true);
      // }
      // finally {
      //   setHasCheckedEscrow(true);
      // }
    };
 
    const runInit = async () => {
      await checkVerifyStatus();
      await initializePayment();
    };
 
    runInit();
  }, []);
 

  // const handleNonEscrowResponse = (data: any) => {
  //   if (data?.message?.toLowerCase()?.includes("verified")) {
  //     console.log("Message >>>", data?.message);
  //     dispatch(setOTPVerified(true));
  //   }

  //   if (data?.error_code === 400) {
  //     setErrorPage(true);
  //     setErrorResponse(data);
  //   } else {
  //     dispatch(setApiResponse(data));
  //     dispatch(setPaymentDetails(data));

  //     if (data?.otp_modal === 0 || !data?.otp_modal) {
  //       dispatch(setOTPVerified(true));
  //       const body = {
  //         call_type: "pay",
  //         ip: "192.168.0.0",
  //         lang: "en",
  //         pay_id: data?.pay_id,
  //       };
  //       APIService.sendOTP(body)
  //         .then(() => {
  //           console.log("Wallet Payment Status >>>", data?.wallet_pay?.payment_status);
  //           console.log("P2P Payment Status >>>", data?.pay?.payment_status);
  //           if ([0, 1, 2, 3, 5].includes(data?.wallet_pay?.payment_status)) {
  //             dispatch(setWalletPaymentDetails(data));
  //             dispatch(setCurrentPage("wallet-payment"));
  //           } else if (data?.pay?.payment_status === 1) {

  //             const url = `https://pay.peerwallet.com/?v=${data.data.unique_id}`;

  //             const RedirectUrl = data.data.redirect_url;

  //             if (data?.data.redirect_url === url) {
  //               // console.log("Message >>>", RedirectUrl);
  //               dispatch(setP2PEscrowDetails(data));
  //               dispatch(setCurrentPage("p2p-payment"));
  //             } else {
  //               console.log("Rendering success page", RedirectUrl);
  //               window.location.assign(RedirectUrl);
  //             }

  //           }
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     } else {
  //       dispatch(setOTPVerified(false));
  //     }
  //   }
  // };

  const renderActivePage = () => {
    if (isRedirecting) {
      return <div>Redirecting...</div>; // Placeholder while redirecting
    }

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
            ? `Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
        <meta
          property="og:description"
          content={
            paymentDetails?.data
              ? `Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
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
          justifyContent: "end",
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
