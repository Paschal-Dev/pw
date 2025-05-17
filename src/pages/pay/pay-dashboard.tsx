import React, { useEffect, useState } from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { theme } from "../../assets/themes/theme";
import Otp from "../../components/pay/otp";
import WalletCard from "../../components/pay/wallet-card";
import P2pCard from "../../components/pay/p2p-card";
import useMediaQuery from "@mui/material/useMediaQuery";
import Gif from "../../components/pay/gif";
// import { PageProps } from "../../utils/myUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import loader from "../../assets/images/loader.gif";
import APIService from "../../services/api-service";
import { setApiResponse, setButtonClicked, setCurrentPage, setOTPVerified, setP2PEscrowDetails, setPaymentDetails, setWalletPaymentDetails } from "../../redux/reducers/pay";
import ErrorPage from "./error_page";

export default function PayDashboard(): React.JSX.Element {
  const { paymentDetails, payId, lang } = useSelector((state: RootState) => state.pay);
  const { isButtonBackdrop } = useSelector((state: RootState) => state.button);
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isloading, setIsLoading] = React.useState(true);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [errorResponse, setErrorResponse] = useState(null);
  const [errorPage, setErrorPage] = useState(false);


  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currency_sign = paymentDetails?.data?.currency_sign;

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

  React.useEffect(() => {
    if (paymentDetails) {
      setIsLoading(false);
    }
  }, [paymentDetails]);

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
  if (!payId) return;

  const Pay = async () => {
    const userIP = await fetchUserIP();
    if (!userIP) {
      console.error("Could not fetch IP");
      setErrorPage(true);
      return;
    }

    const sendOtpPayload = {
      call_type: "pay",
      ip: userIP,
      lang: lang,
      pay_id: payId,
    };

    try {
      const resp = await APIService.sendOTP(sendOtpPayload);
      console.log("API Response from PayDashboard OTP:", resp.data);

      if (resp.data?.escrow_status === 1 && resp.data?.data?.verify === 1) {
        // Escrow active and verified, go to EscrowPage
        dispatch(setButtonClicked(true));
        dispatch(setCurrentPage("escrow-page"));
        dispatch(setP2PEscrowDetails(resp.data));
      } else if (resp.data?.escrow_status === 1 && resp.data?.data?.verify === 0) {
        // Escrow active but not verified, stay on PayDashboard
        dispatch(setButtonClicked(false));
        dispatch(setOTPVerified(false));
        dispatch(setPaymentDetails(resp.data));
      } else {
        // Handle non-escrow cases
        dispatch(setButtonClicked(false));
        console.log("No checkout link or escrow status not 1.");
        handleNonEscrowResponse(resp.data);
      }
    } catch (error) {
      console.error("Error during Send OTP:", error);
      setErrorPage(true);
    }
  };

  Pay();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch, payId, lang]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNonEscrowResponse = async (data: any) => {
    if (data?.message?.toLowerCase()?.includes("verified")) {
      console.log("Message >>>", data?.message);
      dispatch(setOTPVerified(true));
    }

    if (data?.error_code === 400) {
      setIsLoading(false);
      setErrorPage(true);
      setErrorResponse(data);
    } else {
      dispatch(setApiResponse(data));
      dispatch(setPaymentDetails(data));

      const userIP = await fetchUserIP(); 
      console.log('User IP', userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        setErrorPage(true);
        return;
      }

      if (data?.otp_modal === 0 || !data?.otp_modal) {
        dispatch(setOTPVerified(true));
        const body = {
          call_type: "pay",
          ip: userIP,
          lang: lang,
          pay_id: data?.pay_id,
        };
        APIService.sendOTP(body)
          .then(() => {
            console.log("Wallet Payment Status >>>", data?.wallet_pay?.payment_status);
            console.log("P2P Payment Status >>>", data?.pay?.payment_status);
            if (data?.data?.payment_status === 1 && data?.pay?.mode === 'wallet') {
              dispatch(setWalletPaymentDetails(data));
              dispatch(setCurrentPage("wallet-payment"));
            } else  if (data?.data?.payment_status === 5 && data?.pay?.mode === 'wallet') {
              dispatch(setWalletPaymentDetails(data));
              dispatch(setCurrentPage("wallet-payment"));
            } else if (data?.pay?.payment_status === 5) {
              dispatch(setP2PEscrowDetails(data));
              dispatch(setCurrentPage("p2p-payment"));
            } else if (data?.pay?.payment_status === 1) {

              const url = `https://pay.peerwallet.com/?v=${data.data.unique_id}`;

              const RedirectUrl = data.data.redirect_url;

              if (data?.data.redirect_url === url) {
                // console.log("Message >>>", RedirectUrl);
                dispatch(setP2PEscrowDetails(data));
                dispatch(setCurrentPage("p2p-payment"));
              } else {
                console.log("Rendering success page", RedirectUrl);
                window.location.assign(RedirectUrl);
              }

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

  return (
    <>
      {isloading ? (
        <Backdrop open={isloading}>
          {/* <CircularProgress size={80} color="primary" /> */}
          <img src={loader} alt="Loader" />
        </Backdrop>
      ) : !errorPage ? (
        <Box flex={1}>
          <Grid container spacing={2} height={"100%"}>
            <Grid item xs={12} sm={12} md={4} lg={4} display={"flex"}>
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={deviceType === "mobile" ? 2 : 1.5}
              >
                {isloading ? (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: deviceType === "mobile" || deviceType === "tablet" ? "fixed" : "block",
                    }}
                    zIndex={2}
                  >
                    <Otp deviceType={deviceType} />
                  </Box>
                )}
                {isloading ? (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                  />
                ) : (
                  <Box>
                    {deviceType !== "mobile" && deviceType !== "tablet" && (
                      <Gif />
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} display={"flex"}>
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={deviceType === "mobile" ? 3 : 1}
              >
                <Box
                  bgcolor={theme.palette.primary.dark}
                  p={1}
                  borderRadius={3}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  flex={1}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    color={"#fff"}
                  >
                    {isloading ? (
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        sx={{ width: 48, height: 48 }}
                      />
                    ) : (
                      <Avatar variant="circular">
                        <img src={paymentDetails?.seller?.image} width={40} />
                      </Avatar>
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{ width: "70%", height: 34 }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        fontSize={"4vh"}
                        textAlign={"center"}
                      >
                        {" "}
                        {t("blc_pw_4")}{" "}
                        <span
                          dangerouslySetInnerHTML={{ __html: currency_sign }}
                        />
                        {`${paymentDetails?.data?.amount} to ${paymentDetails?.seller?.name}`}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection={deviceType === "mobile" ? 'column' : 'row'} gap={1}>
                  <Box
                    bgcolor={theme.palette.primary.dark}
                    p={1}
                    borderRadius={3}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    flex={1}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      color={"#fff"}
                    >

                      {isloading ? (
                        <Skeleton
                          variant="text"
                          animation="wave"
                          sx={{ width: "50%", height: 28 }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color={'#fff'}
                          fontSize={"2vh"}
                        >
                          {paymentDetails?.data?.payee_email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    bgcolor={theme.palette.primary.dark}
                    p={1}
                    borderRadius={3}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    flex={1}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      color={"#fff"}
                    >

                      {isloading ? (
                        <Skeleton
                          variant="text"
                          animation="wave"
                          sx={{ width: "50%", height: 28 }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color={'#fff'}
                          fontSize={"2vh"}
                        >
                          {paymentDetails?.data?.order_name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  boxShadow={"0px 2px 10px 0px rgba(0,0,0,0.15)"}
                  borderRadius={3}
                  flex={1}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                >
                  {isloading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ width: "60%", height: 24, margin: "auto" }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      textAlign={"center"}
                      fontWeight={600}
                    >
                      {t("how-to-pay")}
                    </Typography>
                  )}
                  <Box
                    display={"flex"}
                    flexDirection={deviceType === "mobile" ? "column" : "row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={2}
                  >
                    {isloading ? (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: "50%", height: 300, borderRadius: 2 }}
                      />
                    ) : (
                      <WalletCard
                      />
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{ width: "6%", height: 40 }}
                      />
                    ) : (
                      <Typography
                        variant="h5"
                        color={theme.palette.primary.main}
                        fontWeight={700}
                      >
                        {t("or")}
                      </Typography>
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: "50%", height: 300, borderRadius: 2 }}
                      />
                    ) : (
                      <P2pCard
                        otpVerified={false}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : <ErrorPage errorResponse={errorResponse} /> }
      {isButtonBackdrop && (
        <Backdrop open={isButtonBackdrop} sx={{ zIndex: 1000 }}>
          <img src={loader} alt="Loader" />
        </Backdrop>
      )}
    </>
  );
}
