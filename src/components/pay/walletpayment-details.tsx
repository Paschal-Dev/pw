import { Box, Typography, Link, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import processingHash from '../../assets/images/processing-hash.gif';
export default function WalletPaymentDetails(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const { walletPaymentDetails } = useSelector((state: RootState) => state.pay);
  const currency_sign = walletPaymentDetails?.data?.currency_sign;
  const shouldDisplayBox1 = walletPaymentDetails?.pay?.payment_status === 1;

  // Function to format Unix timestamp to a human-readable date string with time
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
        className="gradient-background"
        p={1}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          color={"#fff"}
        >
          <Typography
            variant="h6"
            fontWeight={800}
            fontSize={20}
            textAlign={"center"}
            textTransform={"capitalize"}
          >
            {t("payment-details")}
          </Typography>
        </Box>
      </Box>
      <Box bgcolor={"#FBFBFB"} display={"flex"} flexDirection={"column"} px={2}>
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
            {t("transaction-hash")}
          </Typography>
          {walletPaymentDetails?.others?.hash && (
          <Link href={walletPaymentDetails?.others?.hash} style={{ color: "#12B76A" }}>
            view hash
          </Link>
        )}
          {!walletPaymentDetails?.others?.hash && (
          <img src={processingHash} width={150}/>
          )}
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
            {/* {walletPaymentDetails?.pay?.payment_status} */}
            {shouldDisplayBox1 && (
              <Box bgcolor={"green"} borderRadius={3.5} p={0.5} px={2}>
                <Typography
                  variant="caption"
                  textAlign={"center"}
                  color={"#fff"}
                >
                  {t("blc_pw_28")}
                </Typography>
              </Box>
            )}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
