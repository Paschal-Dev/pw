import { useMediaQuery, Box, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
export default function P2pProcessingDetails() {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  const shouldDisplayBox = p2pEscrowDetails?.pay?.payment_status === 0;

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
        borderRadius={2} bgcolor={theme.palette.primary.light}
        p={1}
        flex={1}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
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
              {p2pEscrowDetails?.pay?.payment_method}
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
              Total Amount
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
              {p2pEscrowDetails.pay?.total_original_amount}
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
              P2P
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
              {t("blc_pw_25")}
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
              {shouldDisplayBox && (
                <Box bgcolor={"#FEC84B"} borderRadius={3.5} p={0.5} px={2}>
                  <Typography
                    variant="caption"
                    textAlign={"center"}
                    color={"#000"}
                  >
                    {t("blc_pw_25")}
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






