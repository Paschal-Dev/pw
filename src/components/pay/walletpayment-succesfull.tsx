import { Box, Button, Typography, Link, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import success from "../../assets/images/check.svg";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export default function WalletPaymentSuccesfull(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { walletPaymentDetails } = useSelector((state: RootState) => state.pay);
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
    <Box
      boxShadow={
        "0px 1.3486182689666748px 5.394473075866699px  0px  rgba(0, 0, 0, 0.15)"
      }
      alignItems={"center"}
      p={4}
      borderRadius={3}
      display={"flex"}
      flexDirection={"column"}
      position={"relative"}
      width={"100%"}
    >
      <Box
        top={0}
        borderRadius={"50%"}
        bgcolor={"#d1fadf63"}
        width={80}
        p={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box borderRadius={"50%"} bgcolor={"#d1fadfda"} width={60} p={2}>
          <Box display={"flex"} justifyContent={"center"}>
            <img src={success} alt="" width={50} />
          </Box>
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        color={"#fff"}
        gap={deviceType === "mobile" ? 2 : 1}
        mt={3}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          color={theme.palette.success.main}
          fontWeight={800}
          fontSize={deviceType === "mobile" ? 14 : 16}
        >
         {t("payment-successful")}
        </Typography>
        <Typography
          variant="caption"
          color={"black"}
          pb={deviceType === "mobile" ? 2 : 3}
        >
          {t("payment-received")}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        flexDirection={"column"}
        alignItems={"center"}
        gap={deviceType === "mobile" ? 1 : 3}
      >
        


        {!walletPaymentDetails?.others?.seller_receipt && (
        <Button
          variant="contained"
          sx={{
            width: '116%',
            paddingY: 0.6,
            borderRadius: 2,
            ':hover': { background: theme.palette.primary.main },
          }}
        >
          <Link
            href="#"
            style={{ width: '100%', textDecoration: 'none', color: '#FFF' }}
          >
            {t('load-receipt')}
          </Link>
        </Button>
      )}

      {!walletPaymentDetails?.others?.vendor_receipt && (
        <Button
          variant="outlined"
          sx={{
            width: '116%',
            paddingY: 0.6,
            borderRadius: 2,
            ':hover': { background: 'none' },
          }}
        >
          <Link
            href={walletPaymentDetails?.others?.seller_receipt}
            style={{ width: '100%', textDecoration: 'none', color: '#009FDD' }}
          >
            {t('loading')}
          </Link>
        </Button>
      )}
      </Box>
    </Box>
  );
}