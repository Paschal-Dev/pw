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
import { setButtonClicked, setCurrentPage, setApiResponse } from "../../redux/reducers/pay";
// import { setHeaderKey } from "../../redux/reducers/auth";
import P2PPayment from "./p2p-payment";

export default function Pay(): React.JSX.Element {
  const [errorResponse, setErrorResponse] = useState(null);
  const [errorPage, setErrorPage] = useState(false);
  const { paymentDetails, shouldRedirectEscrow, currentPage } = useSelector(
      (state: RootState) => state.pay
  );

  const dispatch = useDispatch();
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const renderCount = React.useRef(0);

  useEffect(() => {
      renderCount.current += 1;

      if (renderCount.current === 1) {
          const url = new URL(window.location.href);

          if (!url.searchParams.has("v")) {
              url.searchParams.append("v", "");
          }

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

          if (!shouldRedirectEscrow) {
              intervalRef.current = setInterval(async () => {
                  try {
                      const resp = await APIService.sendOTP(sendOtpPayload);
                      console.log("API Response from Send OTP:", resp.data);

                      if (resp.data?.escrow_status === 1) {
                          const checkoutLink = resp.data?.data?.checkout_link;
                          if (checkoutLink) {
                              console.log("Redirecting to:", checkoutLink);
                              window.location.assign(checkoutLink);

                              dispatch(setButtonClicked(true));
                              dispatch(setP2PEscrowDetails(resp.data));
                              dispatch(setCurrentPage("escrow-page"));
                          } else {
                              console.log("No checkout link found.");
                          }

                          if (intervalRef.current) clearInterval(intervalRef.current);
                      } else {
                          handleNonEscrowResponse(resp.data);
                      }
                  } catch (error) {
                      console.error("Error during Send OTP:", error);
                  }
              }, 3000);
          }
      }

      return () => {
          if (intervalRef.current) {
              clearInterval(intervalRef.current);
          }
      };
  }, [dispatch, shouldRedirectEscrow]);

  const handleNonEscrowResponse = (data: any) => {
      if (data?.message?.toLowerCase()?.includes("verified")) {
          dispatch(setOTPVerified(true));
      }

      if (data?.error_code === 400) {
          setErrorPage(true);
          setErrorResponse(data);
      } else {
          setApiResponse(data);
          dispatch(setPaymentDetails(data));

          if (data?.otp_modal === 0 || !data?.otp_modal) {
              const body = {
                  call_type: "pay",
                  ip: "192.168.0.0",
                  lang: "en",
                  pay_id: data?.pay_id,
              };
              APIService.sendOTP(body)
                  .then((resp) => {
                      if (
                          [0, 1, 2, 3, 5].includes(resp.data?.pay?.payment_status)
                      ) {
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
