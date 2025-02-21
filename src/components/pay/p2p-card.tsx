import React, { useEffect, useState } from "react";
import gateway1 from "../../assets/images/gateway-1.png";
import gateway2 from "../../assets/images/gateway-2.png";
import gateway3 from "../../assets/images/gateway-3.png";
import gateway4 from "../../assets/images/gateway-4.png";
import gateway5 from "../../assets/images/gateway-5.png";
import gateway6 from "../../assets/images/gateway-6.png";
import gateway7 from "../../assets/images/gateway-7.png";
import gateway8 from "../../assets/images/gateway-8.png";
import p2p from "../../assets/images/p2p-icon.png";
import Notch from "../../assets/images/notch.svg";
import {
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Modal,
  // Link,
  CircularProgress,
  AlertTitle,
  Alert,
} from "@mui/material";
import { theme } from "../../assets/themes/theme";
import danger from "../../assets/images/danger.svg";
import close from "../../assets/images/close-icon.svg";
// import { PageProps } from "../../utils/myUtils";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
// import { setHeaderKey } from "../../redux/reducers/auth";
import APIService from "../../services/api-service";
import { useDispatch, useSelector } from "react-redux";
import { setButtonBackdrop, setButtonClicked, setCurrentPage, setP2PVendorsDetails } from "../../redux/reducers/pay";



interface P2pCardProps {
  otpVerified: boolean;
}

// eslint-disable-next-line no-empty-pattern
const P2pCard: React.FC<P2pCardProps> = () => {
  const [open, setOpen] = React.useState(false);
  const { isOTPVerified } = useSelector((state: RootState) => state.pay);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  const { isButtonClicked } = useSelector((state: RootState) => state.button);
  const dispatch = useDispatch();
  const { payId: payId } = useSelector((state: RootState) => state.pay);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"error" | null>(null);
  const [isSuccessAlertShown] = useState(false);
  const { paymentDetails } = useSelector((state: RootState) => state.pay);
  const [deviceType] = React.useState("mobile");

  // React.useEffect(() => {
  //   if (mobile) {
  //     setDeviceType("mobile");
  //   } else if (tablet) {
  //     setDeviceType("tablet");
  //   } else {
  //     setDeviceType("pc");
  //   }
  // }, [mobile, tablet]);
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

    dispatch(setButtonClicked(true)); // Set button as clicked
    dispatch(setButtonBackdrop(true));


    if (!isOTPVerified) {
      dispatch(setButtonBackdrop(false));

      setOpen(true);
      dispatch(setButtonClicked(false));
    } else {
      setOpen(false);
      dispatch(setButtonClicked(true));
      dispatch(setButtonBackdrop(true));

      try {
        // const formData = new FormData();
        // formData.append("call_type", "get_key");
        // const response1 = await APIService.getToken(formData);
        // console.log(
        //   "API RESPONSE FROM P2P VENDORS GET TOKEN =>>> ",
        //   response1.data
        // );

        // const payload = {
        //   call_type: "encode_key",
        //   token: response1.data?.data?.token,
        //   key: response1.data?.data?.key,
        //   timestamp: Math.floor(Date.now() / 1000),
        // };
        // const response3 = await APIService.encodeKey(payload);
        // console.log(
        //   "API RESPONSE FROM P2P VENDORS ENCODE KEY =>>> ",
        //   response3.data
        // );
        // dispatch(setHeaderKey(response3.data?.data?.header_key));
        // localStorage.setItem("headerKey", response3.data?.data?.header_key);
        const p2pPayload = {
          call_type: "p2p_vendors",
          ip: "192.168.0.0",
          pay_id: payId,
        };
        const respo = await APIService.p2pVendors(p2pPayload);
        // Check if error_code is 400
        if (respo && respo.data && Array.isArray(respo.data.p2p) && respo.data.p2p.length === 0) {
          setAlertMessage(t("blc_pw_45"));
          setAlertSeverity('error');
          console.log('API RESPONSE FROM P2P VENDORS FETCH =>>> ', respo.data);
        } else if (respo.data.seller.seller_status === 0) {
          setAlertMessage('Selling account is not active, please contact support');
          setAlertSeverity('error');
          console.log('API RESPONSE FROM P2P VENDORS FETCH =>>> ', respo.data.seller.seller_status);
        } else {
          APIService.p2pVendors(p2pPayload)
            .then((respo) => {
              console.log(
                "API RESPONSE FROM P2P VENDORS FETCH =>>> ",
                respo.data
              );
              console.log('SELLER STATUS =>>> ', respo.data.seller.seller_status);

              dispatch(setP2PVendorsDetails(respo.data));
              dispatch(setCurrentPage("p2p"));
            })
            .catch((error: unknown) => {
              console.log("ERROR ::::::: ", error);
            });
        }
      } catch (error) {
        console.error("Error Getting Vendors:", error);
      }
      dispatch(setButtonBackdrop(false));
    }
  };
  const handleCancel = () => {
    handleClose();
  };
  return (
    <Box flex={1}>
      <Card
        sx={{
          bgcolor: "#F5FBFE",
          borderRadius: "0px 0px 15px 15px",
          display: "flex",
          flexDirection: "column",
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
          image={p2p}
        />
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          px={2}
          gap={1.5}
        >
          <Typography
            variant="h5"
            fontWeight={"bold"}
            textTransform={"capitalize"}
          >
            {t("vendors")}
          </Typography>
          <Typography
            variant="body2"
            textAlign={"center"}
            textTransform={"capitalize"}
            fontSize={12}
            fontWeight={500}
          >
            {t("blc_pw_22")} {paymentDetails?.seller?.name} {t("blc_pw_23")}
          </Typography>
          <Box
            display={"flex"}
            justifyContent={"center"}
            p={1}
            boxShadow={"0px 1px 10px 0px rgba(0,0,0,0.1)"}
            width={"70%"}
            borderRadius={3}
          >
            <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
              <img
                src={gateway1}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway2}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway3}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway4}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway5}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway6}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway7}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
              <img
                src={gateway8}
                alt=""
                style={{
                  width: 35,
                  borderRadius: "50%",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
                }}
              />
            </Box>
          </Box>
          {alertSeverity === "error" && !isSuccessAlertShown && (
            <Alert
              severity="error"
              sx={{
                position: "absolute",
                width: deviceType !== "mobile" ? "60%" : "20%"
              }}
            >
              <AlertTitle>Error</AlertTitle>
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
                gap={2}
              >
                <Box
                  top={0}
                  borderRadius={"50%"}
                  bgcolor={"#fee4e259"}
                  width={70}
                  p={2}
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
                    <Box display={"flex"} justifyContent={"center"}>
                      <img src={danger} alt="" width={40} />
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
                  {t("blc_pw_15")}
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
};
export default P2pCard;
