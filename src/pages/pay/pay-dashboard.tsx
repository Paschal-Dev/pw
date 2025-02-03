import React from "react";
import {
  Avatar,
  Backdrop,
  Box,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { theme } from "../../assets/themes/theme";
import Otp from "../../components/pay/otp";
import WalletCard from "../../components/pay/wallet-card";
import P2pCard from "../../components/pay/p2p-card";
import useMediaQuery from "@mui/material/useMediaQuery";
import Gif from "../../components/pay/gif";
// import { PageProps } from "../../utils/myUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import loader from "../../assets/images/loader.gif";

export default function PayDashboard(): React.JSX.Element{
  const [deviceType, setDeviceType] = React.useState("mobile");
  const [isloading, setIsLoading] = React.useState(true);
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));

  const { t } = useTranslation();

  const { paymentDetails } = useSelector((state: RootState) => state.pay);

  const currency_sign = paymentDetails?.data?.currency_sign;
  const { isButtonBackdrop } = useSelector((state: RootState) => state.button);

  React.useEffect(() => {
    if (paymentDetails) {
      setIsLoading(false);
    }
  }, [paymentDetails]);

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
    <>
      {isloading ? (
        <Backdrop open={isloading}>
          {/* <CircularProgress size={80} color="primary" /> */}
          <img src={loader} alt="Loader" />
        </Backdrop>
      ) : (
        <Box flex={1}>
          <Grid container spacing={2} height={"100%"}>
            <Grid item xs={12} sm={12} md={4} lg={4} display={"flex"}>
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={deviceType === "mobile" ? 2 : 1.5}
              >
                {isloading ? (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: deviceType === "mobile" || deviceType === "tablet" ? "fixed" : "block",
                    }}
                    zIndex={2}
                  >
                    <Otp deviceType={deviceType}/>
                  </Box>
                )}
                {isloading ? (
                  <Skeleton
                    variant="rectangular"
                    animation="wave"
                    sx={{ width: "100%", height: "100%", borderRadius: 2 }}
                  />
                ) : (
                  <Box>
                    {deviceType !== "mobile" && deviceType !== "tablet" && (
                      <Gif />
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} display={"flex"}>
              <Box
                flex={1}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                gap={deviceType === "mobile" ? 3 : 1}
              >
                <Box
                  bgcolor={theme.palette.primary.dark}
                  p={1}
                  borderRadius={3}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  flex={1}
                >
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    color={"#fff"}
                  >
                    {isloading ? (
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        sx={{ width: 48, height: 48 }}
                      />
                    ) : (
                      <Avatar variant="circular">
                        <img src={paymentDetails?.seller?.image} width={40} />
                      </Avatar>
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{ width: "70%", height: 34 }}
                      />
                    ) : (
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        fontSize={"4vh"}
                        textAlign={"center"}
                      >
                        {" "}
                        {t("blc_pw_4")}{" "}
                        <span
                          dangerouslySetInnerHTML={{ __html: currency_sign }}
                        />
                        {`${paymentDetails?.data?.amount} to ${paymentDetails?.seller?.name}`}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection={deviceType === "mobile" ? 'column' : 'row'} gap={1}>
                  <Box
                    bgcolor={theme.palette.primary.dark}
                    p={1}
                    borderRadius={3}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    flex={1}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      color={"#fff"}
                    >

                      {isloading ? (
                        <Skeleton
                          variant="text"
                          animation="wave"
                          sx={{ width: "50%", height: 28 }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color={'#fff'}
                          fontSize={"2vh"}
                        >
                          {paymentDetails?.data?.payee_email}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    bgcolor={theme.palette.primary.dark}
                    p={1}
                    borderRadius={3}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    flex={1}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      color={"#fff"}
                    >

                      {isloading ? (
                        <Skeleton
                          variant="text"
                          animation="wave"
                          sx={{ width: "50%", height: 28 }}
                        />
                      ) : (
                        <Typography
                          variant="caption"
                          color={'#fff'}
                          fontSize={"2vh"}
                        >
                          {paymentDetails?.data?.order_name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Box
                  boxShadow={"0px 2px 10px 0px rgba(0,0,0,0.15)"}
                  borderRadius={3}
                  flex={1}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"space-between"}
                >
                  {isloading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ width: "60%", height: 24, margin: "auto" }}
                    />
                  ) : (
                    <Typography
                      variant="h6"
                      textAlign={"center"}
                      fontWeight={600}
                    >
                      {t("how-to-pay")}
                    </Typography>
                  )}
                  <Box
                    display={"flex"}
                    flexDirection={deviceType === "mobile" ? "column" : "row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    gap={2}
                  >
                    {isloading ? (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: "50%", height: 300, borderRadius: 2 }}
                      />
                    ) : (
                      <WalletCard
                      />
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="text"
                        animation="wave"
                        sx={{ width: "6%", height: 40 }}
                      />
                    ) : (
                      <Typography
                        variant="h5"
                        color={theme.palette.primary.main}
                        fontWeight={700}
                      >
                        {t("or")}
                      </Typography>
                    )}
                    {isloading ? (
                      <Skeleton
                        variant="rectangular"
                        animation="wave"
                        sx={{ width: "50%", height: 300, borderRadius: 2 }}
                      />
                    ) : (
                      <P2pCard
                        otpVerified={false}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      {isButtonBackdrop && (
        <Backdrop open={isButtonBackdrop} sx={{ zIndex: 1000 }}>
          <img src={loader} alt="Loader" />
        </Backdrop>
      )}
    </>
  );
}
