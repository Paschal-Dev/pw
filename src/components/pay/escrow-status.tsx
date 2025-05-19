import { Box, Button, Modal, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { setHeaderKey } from "../../redux/reducers/auth";
import { useTranslation } from "react-i18next";
import APIService from "../../services/api-service";
import danger from "../../assets/images/danger.svg";
import close from "../../assets/images/close-icon.svg";
import { theme } from "../../assets/themes/theme";
import {
  setConfirmButtonBackdrop,
  setCurrentPage,
  setP2PVendorsDetails,
  clearConfirmPaymentDetails,
  clearChatDetails,
} from "../../redux/reducers/pay";

export default function EscrowStatus() {
  const [deviceType, setDeviceType] = useState("mobile");
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { p2pEscrowDetails, confirmPaymentDetails, chatDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  const shouldDisplayBox2 = p2pEscrowDetails?.escrow_status === 1;
  const shouldDisplayBox1 = p2pEscrowDetails?.escrow_status === 0;
  const { payId } = useSelector((state: RootState) => state.pay);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [countdown, setCountdown] = React.useState("");
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
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);

  const handleCancel = () => {
    setOpen(true);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    setOpen(true);
    dispatch(setConfirmButtonBackdrop(true));
    localStorage.removeItem("checkout_link");
    localStorage.clear();
    try {
      const userIP = await fetchUserIP();
      console.log("User IP at first", userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      const cancelPayload = {
        call_type: "cancel_escrow",
        ip: userIP,
        pay_id: payId,
      };

      const respo = await APIService.p2pCancelEscrow(cancelPayload);
      console.log("API RESPONSE FROM CANCEL ESCROW=>>> ", respo.data);
      dispatch(clearConfirmPaymentDetails());
      dispatch(clearChatDetails());
      // // send-otp request
      // const sendOtpPayload = {
      //   call_type: "pay",
      //   ip: userIP,
      //   lang: "en",
      //   pay_id: payId,
      // };

      // // eslint-disable-next-line prefer-const
      // let intervalId: number | undefined;
      // const checkPaymentStatusAndRun = async (sendOtpPayload: unknown) => {
      //   try {
      //     const resp = await APIService.sendOTP(sendOtpPayload);
      //     console.log(
      //       "API RESPONSE FROM PAGE_RELOAD SEND OTP =>>> ",
      //       resp.data
      //     );

      // if (resp.data?.escrow_status === 1) {
      //   // Do nothing, let the interval continue
      // } else {
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
        ip: userIP,
        pay_id: payId,
      };
      const respo2 = await APIService.p2pVendors(p2pPayload);
      console.log("API RESPONSE FROM P2P VENDORS FETCH =>>> ", respo2.data);

      dispatch(setP2PVendorsDetails(respo2.data));
      if (respo.data?.escrow_status === 0) {
        // clearInterval(intervalId);
        dispatch(setConfirmButtonBackdrop(false));
        console.log("Confirm Payment Details", confirmPaymentDetails);
        dispatch(setCurrentPage("p2p"));
      }
      return;
    } catch (error) {
      console.error("Error Cancelling Escrow:", error);
    }
  };

  useEffect(() => {
    console.log("chatDetails updated:", chatDetails);
  }, [chatDetails]);

  const calculateCountdown = () => {
    const now = Math.floor(Date.now() / 1000);
    let secondsLeft = p2pEscrowDetails?.pay?.escrow_exp - now;

    if (secondsLeft < 0) {
      setCountdown("00h 00m 00s Left");

      return;
    }

    const hours = Math.floor(secondsLeft / 3600);
    secondsLeft -= hours * 3600;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= minutes * 60;

    setCountdown(`${hours}h ${minutes}m ${secondsLeft}s Left`);
  };
  useEffect(() => {
    calculateCountdown(); // Call once initially or when dependencies change.
    const interval = setInterval(calculateCountdown, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p2pEscrowDetails?.pay?.escrow_exp]);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box bgcolor="#FBFBFB" borderRadius={4} p={1} mb={deviceType === "mobile" ? 2 : 0}>
      <Box display="flex" justifyContent="center">
        <Typography variant="h6" fontWeight={700} fontSize={35} textTransform="capitalize">
          {t("escrow-status")}
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="center">
        <Box
          bgcolor="#FEF3F2"
          borderRadius={2}
          width={deviceType === "mobile" ? 300 : 350}
          p={1}
          pb={deviceType === "mobile" ? 2 : 0}
          textAlign={"center"}
          alignItems={"center"}
        >
          <Typography variant="caption" color="#F04438" textAlign="center">
            {t("need-to-cancel")}
          </Typography>
          <Typography variant="caption" color="#F04438" textAlign="center">
            {t("escrow-need-to")}
          </Typography>
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        py={0.5}
        px={5}
        borderBottom={"1px  solid #D3D3D3"}
      >
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          flex={1}
        >
          {t("status")}
        </Typography>
        {shouldDisplayBox2 && (
          <Typography
            variant="caption"
            fontSize={deviceType === "mobile" ? 14 : 12}
            fontWeight={600}
            textAlign="center"
            color="#12B76A"
          >
            {t("blc_pw_10")}
          </Typography>
        )}
        {shouldDisplayBox1 && (
          <Typography
            variant="caption"
            fontSize={deviceType === "mobile" ? 14 : 12}
            fontWeight={600}
            textAlign="center"
            color="red"
          >
            {t("blc_pw_11")}
          </Typography>
        )}
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        py={0.5}
        px={5}
        borderBottom={"1px  solid #D3D3D3"}
      >
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          flex={1}
        >
          {t("blc_pw_12")}
        </Typography>
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          textAlign="center"
        >
          ({p2pEscrowDetails?.data?.currency})
          <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
          {p2pEscrowDetails?.data?.amount}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        py={0.5}
        px={5}
        borderBottom={"1px  solid #D3D3D3"}
      >
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          flex={1}
        >
          {t("vendor")}
        </Typography>
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          textAlign="center"
        >
          {p2pEscrowDetails?.vendor?.use_name}
        </Typography>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        py={0.5}
        px={5}
        borderBottom={"1px  solid #D3D3D3"}
      >
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          flex={1}
        >
          {t("validity")}
        </Typography>
        <Typography
          variant="caption"
          fontSize={deviceType === "mobile" ? 14 : 12}
          fontWeight={600}
          textAlign="center"
        >
          {countdown}
        </Typography>
      </Box>
      {/* Additional rows of information here */}

      <Box display="flex" justifyContent="center" pt={1} pb={1}>
        <Button
          variant="contained"
          onClick={handleCancel}
          sx={{
            width: "30%",
            p: 0.5,
            borderRadius: 2,
            ":hover": { bgcolor: "#D92D20" },
            bgcolor: "#D92D20",
          }}
        >
          {t("cancel")}
        </Button>
        {!isConfirming && (
          <Modal
            open={open}
            // onClose={handleClose}
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
                  <Box borderRadius={"50%"} bgcolor={"#FEE4E2"} width={50} p={2}>
                    <Box display={"flex"} justifyContent={"center"}>
                      <img src={danger} alt="" width={40} />
                    </Box>
                  </Box>
                </Box>
                {!isConfirming && (
                  <Box onClick={handleClose}>
                    <img src={close} alt="" width={50} />
                  </Box>
                )}
              </Box>
              <Typography id="modal-modal-title" variant="h6" fontWeight={600}>
                {t("blc_pw_13")}
              </Typography>
              <Typography
                variant="body2"
                fontSize={14}
                id="modal-modal-description"
                sx={{ mt: 1 }}
                alignItems={"center"}
                textAlign={"center"}
              >
                {t("blc_pw_84")}
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {t("blc_pw_85")}
                </span>{" "}
                {t("blc_pw_86")}
              </Typography>
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pt={1}
                gap={2}
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isConfirming}
                  sx={{
                    width: "50%",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #667085",
                    ":hover": { background: "none" },
                  }}
                >
                  {t("blc_pw_15")}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  sx={{
                    width: "50%",
                    p: 2,
                    borderRadius: 2,
                    ":hover": { background: "#D92D20" },
                    bgcolor: "#D92D20",
                  }}
                >
                  {t("blc_pw_16")}
                </Button>
              </Box>
            </Box>
          </Modal>
        )}
      </Box>
    </Box>
  );
}
