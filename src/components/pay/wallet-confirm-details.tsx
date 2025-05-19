import { useMediaQuery, Box, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function WalletConfirmDetails() {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const { walletSendPaymentDetails } = useSelector((state: RootState) => state.pay);
  const currency_sign = walletSendPaymentDetails?.data?.currency_sign;
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

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
            {walletSendPaymentDetails?.data?.payee_email}
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
              {walletSendPaymentDetails?.data?.amount}
          </Typography>
        </Box>
        <Box
          display="flex"
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
              {walletSendPaymentDetails?.data?.amount}
          </Typography>
        </Box>
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
             {walletSendPaymentDetails?.data?.order_name}
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
              {walletSendPaymentDetails?.data?.amount}
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
              {t("blc_pw_50")}
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
              {walletSendPaymentDetails?.data?.unique_id}
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
              {/* {walletSendPaymentDetails?.pay?.payment_method} */}
              {t("blc_pw_30")}
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
              {t("blc_pw_31")}
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
             {t("peerwallet-fee")}
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
               <span dangerouslySetInnerHTML={{ __html: currency_sign }} />0
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
               <span dangerouslySetInnerHTML={{ __html: currency_sign }} />0
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
              {walletSendPaymentDetails?.data?.amount}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
