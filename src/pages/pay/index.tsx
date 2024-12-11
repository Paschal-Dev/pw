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
  // setP2PVendorsDetails,
} from "../../redux/reducers/pay";
import ErrorPage from "./error_page";
import EscrowPage from "./escrow-page";
import { RootState } from "../../redux/store";
import { Helmet } from "react-helmet";
import { setButtonClicked } from "../../redux/reducers/pay";
// import { setHeaderKey } from "../../redux/reducers/auth";
import P2PPayment from "./p2p-payment";

export default function Pay(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState("pay");
  const [apiResponse, setApiResponse] = useState(null);
  const [errorResponse, setErrorResponse] = useState(null);
  const [errorPage, setErrorPage] = useState(false);
  const { paymentDetails, shouldRedirectEscrow } = useSelector((state: RootState) => state.pay);


  // const currency_sign = paymentDetails?.data?.currency_sign;

  const dispatch = useDispatch();
  let count: number = 0;

  useEffect(() => {
    count = count + 1;
    const currentPath = window.location.pathname;

    if (count === 1) {
      console.log("CURR PATH ::: ", currentPath);

      const url = new URL(window.location.href);
      if (!url.searchParams.has("v")) {
        url.searchParams.append("v", "");
      }

      const newUrl = `${url}`;

      if (newUrl.split("=")[1].length === 0) {
        if (currentPath.includes("v")) {
          console.log("CKJSK :: ", newUrl);
        }

        history.pushState({}, "", url.href);

        console.log("PP :: ", currentPath);

        const payId = url.search.split("v=")[1];
        dispatch(setPayId(payId));
        console.log("Pay ID", payId);

        // send-otp request
        // const sendOtpPayload = {
        //   call_type: "pay",
        //   ip: "192.168.0.0",
        //   lang: "en",
        //   pay_id: payId,
        // };

        // setTimeout(async () => {
        //   try {
        //     const resp = await APIService.sendOTP(sendOtpPayload);

        //     // console.log("API RESPONSE FROM SEND OTP =>>> ", resp.data);
        //     console.log("DATA ::: 1 ", resp.data);

        //     // Check if error_code is 400
        //     if (resp.data?.error_code === 400) {
        //       setErrorPage(true);
        //       setErrorResponse(resp.data);
        //     } else {
        //       // Otherwise, set the API response data and dispatch payment details
        //       setApiResponse(resp.data);
        //       dispatch(setPaymentDetails(resp.data));

        //       if (
        //         resp.data?.otp_modal === 0 ||
        //         resp.data?.otp_modal === false
        //       ) {
        //         const body = {
        //           call_type: "wallet_pay",
        //           pay_id: payId,
        //         };
        //         APIService.walletPay(body)
        //           .then((resp) => {
        //             console.log("WALLET OTP RESPONSE :: :: ", resp.data);
        //           })
        //           .catch((error) => {
        //             console.log(error);
        //           });
        //         dispatch(setOTPVerified(true));
        //       } else {
        //         dispatch(setOTPVerified(false));
        //       }
        //     }
        //   } catch (error) {
        //     console.log("ERROR ::::::: ", error);
        //   }
        // }, 3000);

      } else {
        console.log("TRY HERE ::");
        console.log("FSsf :: ", url.search);

        const payId = url.search.split("v=")[1];
        dispatch(setPayId(payId));

        console.log("Pay ID", payId);

        // send-otp request
        const sendOtpPayload = {
          call_type: "pay",
          ip: "192.168.0.0",
          lang: "en",
          pay_id: payId,
        };


        if (!shouldRedirectEscrow) {
          setTimeout(async () => {
            try {

              // Fetch the API data
              const resp = await APIService.sendOTP(sendOtpPayload);
              console.log("API RESPONSE FROM SEND OTP", resp.data);

              const currentUrl = window.location.href;

              // Check if already redirected
              if (sessionStorage.getItem("hasRedirected") === "true") {
                console.log("Already redirected. Skipping further redirection.");
        
                // If we are at the checkout link, set the page state
                if (currentUrl.includes("checkoutLink")) {
                  dispatch(setButtonClicked(true));
                  dispatch(setP2PEscrowDetails(resp.data));
                  setCurrentPage("escrow-page");
                }
                return;
              }



              if (resp?.data?.data?.checkout_link) {
                const checkoutLink = resp.data.data.checkout_link;
                console.log("Redirecting to Checkout Link:", checkoutLink);
        
                // Mark as redirected
                sessionStorage.setItem("hasRedirected", "true");
        
                // Redirect to the checkout link
                window.location.assign(checkoutLink);
                return;
              }



              if (resp.data?.message?.toLowerCase()?.includes("verified")) {
                dispatch(setOTPVerified(true));
              }

              // Check if error_code is 400
              if (resp.data?.error_code === 400) {
                setErrorPage(true);
                setErrorResponse(resp.data);
              } else {
                // Otherwise, set the API response data and dispatch payment details
                setApiResponse(resp.data);
                dispatch(setPaymentDetails(resp.data));
              }

              // new checks

              if (resp.data?.otp_modal === 0 || !resp.data?.otp_modal) {
                dispatch(setOTPVerified(true));
                // setInterval(async () => {
                const body = {
                  call_type: "pay",
                  ip: "192.168.0.0",
                  lang: "en",
                  pay_id: payId,
                };
                APIService.sendOTP(body)
                  .then((resp) => {
                    console.log("PAYMENT STATUS RESPONSE :: :: ", resp.data);

                    if (resp.data?.pay?.payment_status === 0 || resp.data?.data?.payment_status === 1 || resp.data?.data?.payment_status === 2 || resp.data?.data?.payment_status === 3 || resp.data?.data?.payment_status === 5) {
                      dispatch(setWalletPaymentDetails(resp.data));
                      setCurrentPage("wallet-payment");
                    }

                    if (resp?.data?.data?.checkout_link) {
                      dispatch(setButtonClicked(true));
                      dispatch(setP2PEscrowDetails(resp.data));

                      // Update URL and set the page
                      const checkoutLink = resp.data.data.checkout_link;
                      console.log("Redirecting to Checkout Link:", checkoutLink);

                      // Set session storage flag and redirect
                      sessionStorage.setItem("hasRedirected", "true");
                      window.location.assign(checkoutLink);
                      return;
                    }


                    if (resp.data?.escrow_status === 1) {
                      dispatch(setButtonClicked(true));

                      dispatch(setP2PEscrowDetails(resp.data));

                      // Redirect to the checkout link


                      setTimeout(() => {
                        if (resp.data?.data?.payment_status === 0 || resp.data?.data?.payment_status === 1 || resp.data?.data?.payment_status === 2 || resp.data?.data?.payment_status === 3 || resp.data?.data?.payment_status === 5) {
                          dispatch(setP2PEscrowDetails(resp.data));
                          setCurrentPage("p2p-payment");
                        }
                      }, 60000);
                    }
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                // }, 10000);
              } else {
                dispatch(setOTPVerified(false));
              }
            } catch (error) {
              console.log("ERROR :::: ", error);
            }
          }, 10000);

        }
      }
    }
  }, []);

  const renderActivePage = () => {
    switch (currentPage) {
      case "pay/v":
        return (
          <PayDashboard
            setCurrentPage={setCurrentPage}
            apiResponse={apiResponse}
          />
        );
      case "p2p":
        return (
          <PayP2P setCurrentPage={setCurrentPage} apiResponse={undefined} />
        );
      case "p2p-payment":
        return (
          <P2PPayment />
        );
      case "escrow-page":
        return (
          <EscrowPage setCurrentPage={setCurrentPage} apiResponse={undefined} />
        );
      case "wallet-confirm":
        return (
          <WalletConfirm
            setCurrentPage={setCurrentPage}
            apiResponse={apiResponse}
          />
        );
      case "wallet-payment":
        return <WalletPayment />;
      default:
        return (
          <PayDashboard
            setCurrentPage={setCurrentPage}
            apiResponse={apiResponse}
          />
        );
    }
  };

  return (
    <Box
      height={"100vh"}
      sx={{
        backgroundImage: "url(" + background + ")",
        backgroundSize: "cover",
      }}
      zIndex={-2}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"space-between"}
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
      <Topbar setCurrentPage={setCurrentPage} apiResponse={undefined} />
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
