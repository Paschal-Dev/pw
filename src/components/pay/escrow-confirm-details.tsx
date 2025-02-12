import { useMediaQuery, Box, Typography, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../../assets/themes/theme";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import APIService from "../../services/api-service";
// import { setHeaderKey } from "../../redux/reducers/auth";
import close from "../../assets/images/close-icon.svg";
import { setConfirmButtonBackdrop, setCurrentPage, setP2PVendorsDetails } from "../../redux/reducers/pay";
// import background from "../../assets/images/background.png";




export default function EscrowConfirmDetails() {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const { p2pEscrowDetails, payId } = useSelector(
    (state: RootState) => state.pay
  );
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  const [open, setOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState("");

  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const shouldDisplayBox2 = p2pEscrowDetails?.escrow_status === 1;
  const shouldDisplayBox1 = p2pEscrowDetails?.escrow_status === 0;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  React.useEffect(() => {
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

  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    setOpen(true);
    dispatch(setConfirmButtonBackdrop(true));
    localStorage.removeItem('checkout_link');
    try {
      // const formData = new FormData();
      // formData.append("call_type", "get_key");

      // const response1 = await APIService.getToken(formData);
      // console.log(
      //   "API RESPONSE FROM CANCEL ESCROW GET TOKEN =>>> ",
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
      //   "API RESPONSE FROM CANCEL ESCROW ENCODE KEY =>>> ",
      //   response3.data
      // );

      // dispatch(setHeaderKey(response3.data?.data?.header_key));
      // localStorage.setItem("headerKey", response3.data?.data?.header_key);

      const cancelPayload = {
        call_type: "cancel_escrow",
        ip: "192.168.0.0",
        pay_id: payId,
      };

      const respo = await APIService.p2pCancelEscrow(cancelPayload);
      console.log("API RESPONSE FROM CANCEL ESCROW=>>> ", respo.data);
      
      // // send-otp request
      // const sendOtpPayload = {
      //   call_type: "pay",
      //   ip: "192.168.0.0",
      //   lang: "en",
      //   pay_id: payId,
      // };

      // eslint-disable-next-line prefer-const
      // let intervalId: number | undefined;
      // const checkPaymentStatusAndRun = async (sendOtpPayload: unknown) => {
      //   try {
      //     const resp = await APIService.sendOTP(sendOtpPayload);
      //     console.log(
      //       "API RESPONSE FROM PAGE_RELOAD SEND OTP =>>> ",
      //       resp.data
      //     );

      //     if (resp.data?.escrow_status === 1) {
      //       // Do nothing, let the interval continue
      //     } else {
            const p2pPayload = {
              call_type: "p2p_vendors",
              ip: "192.168.0.0",
              pay_id: payId,
            };
            const respo2 = await APIService.p2pVendors(p2pPayload);
            console.log(
              "API RESPONSE FROM P2P VENDORS FETCH =>>> ",
              respo2.data
            );
            dispatch(setP2PVendorsDetails(respo2.data));
            // clearInterval(intervalId);
            dispatch(setConfirmButtonBackdrop(false));
            dispatch(setCurrentPage("p2p"));
    //       }
    //     } catch (error) {
    //       console.log("ERROR ::::::: ", error);
    //     }
    //   };
    //   intervalId = setInterval(
    //     () => checkPaymentStatusAndRun(sendOtpPayload),
    //     3000
    //   );
    } catch (error) {
      console.error("Error Cancelling Escrow:", error);
    }
  };

  const calculateCountdown = () => {
    const now = Math.floor(Date.now() / 1000);
    let secondsLeft = p2pEscrowDetails?.pay?.escrow_exp - now;

    if (secondsLeft < 0) {
      setCountdown("Expired");
      handleConfirm();
      return;
    }

    const hours = Math.floor(secondsLeft / 3600);
    secondsLeft -= hours * 3600;
    const minutes = Math.floor(secondsLeft / 60);
    secondsLeft -= minutes * 60;

    setCountdown(`${hours}h ${minutes}m ${secondsLeft}s Left`);
  };

  useEffect(() => {
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p2pEscrowDetails?.pay?.escrow_exp]);

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 3,
  };
  return (
    <Box>
      <Box
        borderRadius={2}
        bgcolor={theme.palette.primary.dark}
        p={2}
        mt={1}
        height={"100%"}
      >
        <Box
          display="flex"
          flexDirection="row"
          borderBottom={"1px  solid #D3D3D3"}
          justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#fff"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            style={{ flex: 1 }}
          >
            {t("user-email")}
          </Typography>

          <Typography
            color="#fff"
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {p2pEscrowDetails?.data?.payee_email}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          borderBottom={"1px  solid #D3D3D3"}
          justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#fff"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            style={{ flex: 1 }}
          >
            {t("blc_pw_8")}
          </Typography>

          <Typography
            color="#fff"
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
            {p2pEscrowDetails?.data?.amount}
          </Typography>
        </Box>
        <Box
          display={
            deviceType === "mobile" || deviceType === "tablet" ? "none" : "flex"
          }
          flexDirection="row"
          justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#fff"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            style={{ flex: 1 }}
          >
            {t("amount-to-pay")}
          </Typography>

          <Typography
            color="#fff"
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
            {p2pEscrowDetails?.pay?.total_original_amount}
          </Typography>
        </Box>
        <Box
          display={
            deviceType === "mobile" || deviceType === "tablet" ? "flex" : "none"
          }
          // flexDirection="row"
          // justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#fff"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            style={{ flex: 1 }}
          >
            {t("blc_pw_9")}
          </Typography>

          <Typography
            flex={2}
            variant="caption"
            fontSize={deviceType === "mobile" ? 16 : 14}
            fontWeight={600}
            textAlign="center"
            alignItems={"center"}
            color={"#fff"}
          >
            {countdown}
          </Typography>

          <Button
            variant="contained"
            onClick={handleCancel}
            sx={{
              width: "10%",
              p: 0.5,
              borderRadius: 2,
              ":hover": { bgcolor: "#D92D20" },
              bgcolor: theme.palette.primary.dark,
              border: "2px solid #D92D20",
            }}
          >
            {t("cancel")}
          </Button>
        </Box>
        {!isConfirming && (
          <Modal
            open={open}
            // onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box></Box>
                {!isConfirming && (
                  <Box onClick={handleClose}>
                    <img src={close} alt="" width={50} />
                  </Box>
                )}
              </Box>
              <Box
                bgcolor="#FBFBFB"
                borderRadius={4}
                p={1}
                mb={deviceType === "mobile" ? 2 : 0}
              >
                <Box display="flex" justifyContent="center">
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    fontSize={35}
                    textTransform="capitalize"
                  >
                    {t("escrow-status")}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    bgcolor="#FEF3F2"
                    borderRadius={2}
                    width={"100%"}
                    p={1}
                    pb={deviceType === "mobile" ? 2 : 0}
                  >
                    <Typography
                      variant="caption"
                      color="#F04438"
                      textAlign="center"
                    >
                      {t("need-to-cancel")}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#F04438"
                      textAlign="center"
                    >
                      {t("escrow-need-to")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  py={0.5}
                  px={3}
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
                  px={3}
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
                  px={3}
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
                  px={3}
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
              </Box>
              <Typography
                id="modal-modal-title"
                variant="h6"
                fontWeight={600}
                marginTop={1}
                fontSize={15}
              >
               {t("blc_pw_13")}
              </Typography>
              <Typography
                variant="body2"
                id="modal-modal-description"
                sx={{ mt: 1 }}
                alignItems={"center"}
                textAlign={"center"}
              >
                {t("blc_pw_14")}
              </Typography>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                pt={1}
                gap={2}
              >
                <Button
                  variant="contained"
                  onClick={handleClose}
                  disabled={isConfirming}
                  sx={{
                    width: "50%",
                    p: 2,
                    borderRadius: 2,
                    ":hover": { background: "#D92D20" },
                    bgcolor: "#D92D20",
                  }}
                >
                  {t("blc_pw_15")}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  sx={{
                    width: "50%",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #667085",
                    ":hover": { background: "none" },
                  }}
                >
                  {t("blc_pw_16")}
                </Button>
              </Box>
            </Box>
          </Modal>
        )}

      </Box>
      <Box borderRadius={2} bgcolor={theme.palette.primary.light} mt={1}>
        <Box p={2}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("order-name")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              {p2pEscrowDetails?.data?.order_name}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("product-amount")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
              {p2pEscrowDetails?.data?.amount}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("blc_pw_17")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >

              {p2pEscrowDetails?.vendor?.use_name}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("payment-method")}
            </Typography>
            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              {p2pEscrowDetails?.pay?.payment_method}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("window-time")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              {p2pEscrowDetails?.vendor?.window_time} {t("blc_pw_18")}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              Pay ID
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              #{p2pEscrowDetails?.pay?.unique_id}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            borderBottom={"1px  solid #D3D3D3"}
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("blc_pw_20")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
              {p2pEscrowDetails?.vendor?.fee}
              +
              <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
              {p2pEscrowDetails?.vendor?.fee_fixed}
            </Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            p={0.5}
          >
            <Typography
              color="#000"
              flex={1}
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              style={{ flex: 1 }}
            >
              {t("blc_pw_21")}
            </Typography>

            <Typography
              color="#000"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 14}
              fontWeight={400}
              borderRadius={1}
              textAlign="center"
              justifyContent={"end"}
            >
              P2P
            </Typography>
          </Box>
        </Box>
        <Box bgcolor={"#000"} style={{ borderRadius: "0 0 5px 5px" }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            p={1}
          >
            <Typography
              color="#FFF"
              flex={1}
              variant="body2"
              fontSize={deviceType === "mobile" ? 16 : 15}
              fontWeight={800}
              style={{ flex: 1 }}
            >
              {t("total-pay-to")}
            </Typography>

            <Typography
              color="#FFF"
              variant="caption"
              fontSize={deviceType === "mobile" ? 16 : 15}
              fontWeight={700}
              textAlign="center"
              justifyContent={"end"}
            >
              <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
              {p2pEscrowDetails?.pay?.total_original_amount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}