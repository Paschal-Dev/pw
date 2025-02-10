import { useMediaQuery, Box, Typography} from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
export default function WalletProcessingDetails() {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { walletPaymentDetails } = useSelector((state: RootState) => state.pay);
  const shouldDisplayBox2 = walletPaymentDetails?.pay?.payment_status === 2;
  const currency_sign = walletPaymentDetails?.data?.currency_sign;
  // Function to format Unix timestamp to a human-readable date string
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    
    console.log("Options:", options);
    
    console.log("Current Date:", date);
  
  };
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
      <Box borderRadius={2} bgcolor={theme.palette.primary.light}>
        <Box
          bgcolor={theme.palette.secondary.light}
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            textAlign={"center"}
            p={1}
          >
            <Typography
              color="#fff"
              flex={1}
              variant="h6"
              fontSize={deviceType === "mobile" ? 19 : 18}
              fontWeight={800}
              style={{ flex: 1 }}
            >
             {t("payment-details")}
            </Typography>
          </Box>
        </Box>
        <Box p={2}>
        <Box
          display="flex"
          flexDirection="row"
          borderBottom={"1px  solid #D3D3D3"}
          justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("order-name")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.data?.order_name}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("payment-method")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.pay?.payment_method}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("amount")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
            {walletPaymentDetails?.data?.amount}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("pwat-value")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.others?.pwat_value}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("rate-in-usd")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.others?.pwat_rate}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("address-transaction")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.pay?.mode}
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
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("date-started")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
            {walletPaymentDetails?.pay?.date_processed &&
              formatDate(walletPaymentDetails.pay.date_processed)}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          py={0.5}
        >
          <Typography
            color="#000"
            flex={1}
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            style={{ flex: 1 }}
            textTransform={"uppercase"}
          >
            {t("payment-date")}
          </Typography>
          <Typography
            color="#000"
            variant="caption"
            fontSize={deviceType === "mobile" ? 12 : 14}
            fontWeight={400}
            borderRadius={1}
            textAlign="center"
            justifyContent={"end"}
          >
             {shouldDisplayBox2 && (
              <Box bgcolor={"#FEC84B"} borderRadius={3.5} p={0.5} px={2}>
                <Typography
                  variant="caption"
                  textAlign={"center"}
                  color={"#fff"}
                >
                  {t("blc_pw_39")}
                </Typography>
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
      </Box>
    </Box>
  );
}






