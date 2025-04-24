import { Box, Typography, Link, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import processingHash from "../../assets/images/processing-hash.gif";
import APIService from "../../services/api-service";
import { setP2PEscrowDetails } from "../../redux/reducers/pay";
export default function P2pPaymentDetails(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const { p2pEscrowDetails, payId } = useSelector((state: RootState) => state.pay);
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
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  const shouldDisplayBox1 = p2pEscrowDetails?.data?.payment_status === 1;

  const date = p2pEscrowDetails?.pay?.date_processed;
  const dispatch = useDispatch();

  const formatDate = (timestamp: number) => {
    const formattedDate = new Date(timestamp * 1000).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
    return formattedDate;
  };

  // Function to format Unix timestamp to a human-readable date string with time
  // const formatDate = (timestamp: number) => {
  //   const date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  //   const options = {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //     hour: "numeric",
  //     minute: "numeric",
  //   };

  //   console.log("Options:", options);

  //   console.log("Current Date:", date);

  //   console.log("Successful Details:", p2pEscrowDetails);

  // };
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
    // Function to check for the transaction hash update
    const checkHash = async () => {
      const userIP = await fetchUserIP();
      console.log('User IP at first', userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      const sendOtpPayload = {
        call_type: "pay",
        ip: userIP,
        lang: "en",
        pay_id: payId,
      };

      try {
        const resp = await APIService.sendOTP(sendOtpPayload);
        console.log("API Response from PayDashboard OTP:", resp.data);


        dispatch(setP2PEscrowDetails(resp.data));


        if (resp?.data?.others?.hash) {
          setTransactionHash(p2pEscrowDetails.others.hash);
        }
        console.log("Transaction Hash Check1", resp?.data?.others?.hash);

      } catch (error) {
        console.error("Error during Hash Check:", error);
      }
      


    };

    console.log("Transaction Hash Check", p2pEscrowDetails.others.hash);

    // Check immediately on mount
    checkHash();

    // Set interval to check every 10 seconds
    const interval = setInterval(() => {
      checkHash();
    }, 10000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [dispatch, p2pEscrowDetails, p2pEscrowDetails.others.hash, payId]);

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
            {p2pEscrowDetails?.data?.order_name}
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
            {p2pEscrowDetails?.pay?.mode}
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
            {p2pEscrowDetails?.data?.amount}
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
            {p2pEscrowDetails?.data?.pwat_value}
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
            {p2pEscrowDetails?.data?.pwat_exchange_rate}
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
          {transactionHash ? (
            <Link href={transactionHash} style={{ color: "#12B76A" }}>
              {t("blc_pw_27")}
            </Link>
          ) : (
            <img src={processingHash} width={150} />
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
            {p2pEscrowDetails?.pay?.mode}
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
            {/* {p2pEscrowDetails?.pay?.date_processed &&
              formatDate( */}
            {formatDate(date)}
            {/* // )} */}
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
            {/* {p2pEscrowDetails?.pay?.payment_status} */}
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
