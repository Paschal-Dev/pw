import {
  Box,
  Button,
  Card,
  CardMedia,
  Modal,
  Typography,
  // Link,
  Alert,
  AlertTitle,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Notch from "../../assets/images/notch.svg";
import walleticon from "../../assets/images/wallet-icon.png";
import line from "../../assets/images/line.svg";
import color from "../../assets/images/color.svg";
// import avatar from "../../assets/images/avatar.png";
import React, { useEffect, useState } from "react";
import { theme } from "../../assets/themes/theme";
import danger from "../../assets/images/danger.svg";
import close from "../../assets/images/close-icon.svg";
// import { PageProps } from "../../utils/myUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
// import { setHeaderKey } from "../../redux/reducers/auth";
import APIService from "../../services/api-service";
import {
  setButtonBackdrop,
  setButtonClicked,
  setCurrentPage,
  setWalletSendPaymentDetails,
} from "../../redux/reducers/pay";



// const style = {
//   position: "absolute" as const,
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   borderRadius: 5,
//   boxShadow: 24,
//   p: 4,
// };

export default function WalletCard(): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"error" | null>(null);
  const { isOTPVerified } = useSelector((state: RootState) => state.pay);
  const [isSuccessAlertShown] = useState(false);
  const { payId: payId, paymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const dispatch = useDispatch();
  const { isButtonClicked } = useSelector((state: RootState) => state.button);
  const [deviceType] = React.useState("mobile");
  const { t } = useTranslation();
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
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: deviceType === 'mobile' ? 300 : 400,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };
  useEffect(() => {
    if (alertSeverity === "error") {
      const timeoutId = setTimeout(() => {
        setAlertSeverity(null);
      }, 5000);
      dispatch(setButtonClicked(false));

      return () => clearTimeout(timeoutId);
    }
  }, [alertSeverity, dispatch]);

  const handleContinueClick = async () => {
    if (isButtonClicked) return; // Prevent multiple clicks
    dispatch(setButtonBackdrop(true));
    dispatch(setButtonClicked(true));

    if (!isOTPVerified) {
      dispatch(setButtonBackdrop(false));

      setOpen(true);
      dispatch(setButtonClicked(false));
    } else {
      setOpen(false);
      dispatch(setButtonClicked(true));
      dispatch(setButtonBackdrop(true));

      try {
        const userIP = await fetchUserIP();
        console.log('User IP at first', userIP);
        if (!userIP) {
          console.error("Could not fetch IP");
          return;
        }
        // const formData = new FormData();
        // formData.append("call_type", "get_key");

        // const response1 = await APIService.getToken(formData);
        // console.log(
        //   "API RESPONSE FROM WALLET PAY GET TOKEN =>>> ",
        //   response1.data
        // );

        // const payload = {
        //   call_type: "encode_key",
        //   token: response1.data?.data?.token,
        //   key: response1.data?.data?.key,
        //   timestamp: Math.floor(Date.now() / 1000),
        // };

        // const response2 = await APIService.encodeKey(payload);
        // console.log(
        //   "API RESPONSE FROM WALLET PAY ENCODE KEY =>>> ",
        //   response2.data
        // );

        // dispatch(setHeaderKey(response2.data?.data?.header_key));
        // localStorage.setItem("headerKey", response2.data?.data?.header_key);

        // send-otp request
        const sendOtpPayload = {
          call_type: "pay",
          ip: userIP,
          lang: "en",
          pay_id: payId,
        };

        const resp = await APIService.sendOTP(sendOtpPayload);
        if (resp.data?.escrow_status === 1) {
          console.log(
            "API RESPONSE FROM WALLET SEND OTP CHECK FOR ESCROW =>>> ",
            resp.data?.escrow_status
          );
          dispatch(setCurrentPage("escrow-page"));
        } else {
          // resend-otp request
          const walletPayload = {
            call_type: "wallet_pay",
            ip: userIP,
            pay_id: payId,
          };
          const respo = await APIService.walletPay(walletPayload);
          // Check if error_code is 400
          if (respo.data?.message?.toLowerCase()?.includes("balance")) {
            setAlertMessage(respo.data?.message);
            setAlertSeverity("error");
            // setIsButtonClicked(false);

            console.log(
              "API ERROR RESPONSE FROM WALLET SEND OTP =>>> ",
              respo.data
            );
          } else if (respo.data.seller.seller_status === 0) {
            setAlertMessage(t("blc_pw_46"));
            setAlertSeverity('error');
            console.log('SELLER STATUS =>>> ', respo.data.seller.seller_status);
          } else {
            APIService.walletPay(walletPayload)
              .then((respo) => {
                console.log(
                  "API RESPONSE FROM WALLET SEND OTP =>>> ",
                  respo.data
                );
                dispatch(setWalletSendPaymentDetails(respo.data));

                dispatch(setCurrentPage("wallet-confirm"));
              })
              .catch((error: unknown) => {
                console.log("ERROR ::::::: ", error);
              });
          }
        }
      } catch (error) {
        console.error("Error Sending Wallet OTP:", error);
      }

      dispatch(setButtonBackdrop(false));

    }
    // dispatch(setButtonClicked(true));
  };
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Box flex={1}>
      <Card
        sx={{
          borderRadius: "0px 0px 15px 15px",
          bgcolor: "#F5FBFE",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.1)",
        }}
      >
        <CardMedia component={"img"} image={Notch} />
        <CardMedia
          style={{
            width: "70px",
            marginTop: "-40px",
          }}
          component={"img"}
          image={walleticon}
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
          mx={2}
        >
          <Typography variant="h5" fontWeight={"bold"}>
            {t("wallet")}
          </Typography>
          <Box
            bgcolor={"#fff"}
            borderRadius={3}
            py={1}
            mx={4}
            position={"relative"}
            boxShadow={"0px 1px 10px 0px rgba(0,0,0,0.1)"}
          >
            <Box display={"flex"} justifyContent={"space-between"} px={2}>
              <Typography variant="body2" fontWeight={600}>
                PWAT-USD
              </Typography>
              <Avatar variant="circular">
                <img src={paymentDetails?.data?.user_image} width={50} />
              </Avatar>
            </Box>
            <Box position={"relative"}>
              <img
                src={line}
                alt=""
                width={"100%"}
                style={{ position: "absolute", bottom: "1%" }}
              />
              <img src={color} alt="" width={"100%"} />
            </Box>
            <Typography
              variant="h5"
              fontSize={28}
              fontWeight={600}
              position={"absolute"}
              bottom={"8%"}
              mx={2}
            >
              ${paymentDetails?.data?.pwat_exchange_rate}
            </Typography>
          </Box>
          {alertSeverity === "error" && !isSuccessAlertShown && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                width: deviceType !== "mobile" ? "60%" : "20%"
              }}
            >
              <AlertTitle>{t("blc_pw_44")}</AlertTitle>
              {alertMessage}
            </Alert>
          )}

          <Button
            variant="contained"
            sx={{
              width: "80%",
              paddingY: 0.6,
              borderRadius: 2,
              ":hover": { background: theme.palette.primary.main },
              pointerEvents: isButtonClicked ? "none" : "auto",
            }}
            onClick={handleContinueClick}
            disabled={isButtonClicked}
          >
            <span>{t("continue-payment")}</span>
            {isButtonClicked && (
              <CircularProgress size={24} style={{ marginLeft: "10px" }} />
            )}
          </Button>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box
                  borderRadius={"50%"}
                  bgcolor={"#fee4e259"}
                  width={70}
                  p={1.5}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box
                    borderRadius={"50%"}
                    bgcolor={"#FEE4E2"}
                    width={50}
                    p={2}
                  >
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                    >
                      <img src={danger} alt="" width={"100%"} />
                    </Box>
                  </Box>
                </Box>
                <Box onClick={handleClose}>
                  <img src={close} alt="" width={50} />
                </Box>
              </Box>
              <Typography id="modal-modal-title" variant="h6" fontWeight={600}>
                {t("otp-not-verified")}
              </Typography>
              <Typography
                variant="body2"
                id="modal-modal-description"
                sx={{ mt: 1 }}
              >
                {t("verify")}
              </Typography>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                pt={1}
                gap={2}
              >
                <Button
                  variant="contained"
                  onClick={handleCancel}
                  sx={{
                    width: "100%",
                    p: 1,
                    borderRadius: 2,
                    ":hover": { background: "#D92D20" },
                    bgcolor: "#D92D20",
                  }}
                >
                  {t("cancel")}
                </Button>

                {/* <Button
                  variant="outlined"
                  sx={{
                    width: "50%",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #667085",
                    ":hover": { background: "none" },
                  }}
                >
                  <Link
                    href="#"
                    style={{
                      width: "100%",
                      textDecoration: "none",
                      color: "#000",
                    }}
                  >
                    {t("help")}
                  </Link>
                </Button> */}
              </Box>
            </Box>
          </Modal>
        </Box>
      </Card>
    </Box>
  );
}












