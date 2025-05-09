import React, { useEffect, useMemo } from "react";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { theme } from "../../assets/themes/theme";
// import VideoThumb from "../../components/pay/video-thumb";
import Vendors from "../../components/pay/vendors";
import { Vendor } from "../../data/pay/vendors-data";
import { Icon } from "@iconify/react";
// import { PageProps } from "../../utils/myUtils";
// import Gif from "../../components/pay/gif";
import { RootState } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setButtonClicked, setCurrentPage } from "../../redux/reducers/pay";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
export default function PayP2P(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const { p2pVendorsDetails, paymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const dispatch = useDispatch();

  const vendors = p2pVendorsDetails?.p2p;
  const Manualvendors = p2pVendorsDetails?.p2p_manual;
  const currency_sign = p2pVendorsDetails?.data?.currency_sign;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to decode HTML entities
  const decodeHtmlEntity = (entity: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = entity;
    return txt.value;
  };

  // Currency mapping
  const currencyMap: { [key: string]: string } = {
    $: "USD",
    "€": "EUR",
    "£": "GBP",
    "₦": "NGN",
    "₹": "INR",
    "¥": "JPY",
    "₿": "BTC",
    "₩": "KRW",
    "₽": "RUB",
    "₮": "MNT",
    "₴": "UAH",
    "₪": "ILS",
    "₫": "VND",
  };

  // Get the decoded currency symbol
  const currencySign = useMemo(
    () => decodeHtmlEntity(paymentDetails?.data?.currency_sign || ""),
    [paymentDetails]
  );

  // Convert symbol to currency code if available
  const displayCurrency = currencyMap[currencySign] || currencySign;

  const backButtonClicked = () => {
    dispatch(setButtonClicked(false));
    dispatch(setCurrentPage("pay"));
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
    <>
      <Helmet>
        <title>
          {paymentDetails?.data
            ? `Vendors || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
        <meta
          property="og:description"
          content={
            paymentDetails?.data
              ? `Vendors || Pay ${displayCurrency} ${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
              : "Payment Page"
          }
        />
        <meta
          property="og:image"
          content={paymentDetails?.seller?.image || ""}
        />
      </Helmet>
      <Box flex={1}>
        <Grid container spacing={3} height={"60%"}>
          <Grid item xs={12} sm={12} md={12} display={"flex"}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
              gap={1}
            >
              <Box display={"flex"} justifyContent={"start"}>
                <IconButton onClick={backButtonClicked}>
                  <Icon
                    icon="cil:arrow-left"
                    fontSize={30}
                    color={theme.palette.primary.main}
                  />
                </IconButton>
              </Box>
              <Box
                bgcolor={theme.palette.background.default}
                borderRadius={3}
                py={1}
              >
                <Box
                  display={"flex"}
                  justifyContent={"start"}
                  alignItems={"center"}
                  gap={2}
                >
                  <Typography
                    variant="body1"
                    textTransform={"uppercase"}
                    bgcolor={"#CCECF8"}
                    color={theme.palette.primary.main}
                    fontWeight={800}
                    borderRadius={1}
                    px={1}
                  >
                    {t("blc_pw_4")}
                  </Typography>
                  <Avatar variant="circular">
                    <img
                      src={p2pVendorsDetails?.seller?.image}
                      alt=""
                      width={40}
                    />
                  </Avatar>

                  <Box display="flex" flexDirection="column">
                    <Box>
                      <Typography
                        variant={deviceType === "mobile" ? "body1" : "h5"}
                        fontWeight={800}
                      >
                        {p2pVendorsDetails?.seller?.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500}>
                      {p2pVendorsDetails?.data?.payee_email}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant={deviceType === "mobile" ? "body1" : "h4"}
                  color={theme.palette.success.main}
                  bgcolor={theme.palette.success.light}
                  fontWeight={800}
                  mx={10}
                  my={1}
                  px={3}
                  borderRadius={3}
                  display={"inline-block"}
                >
                  <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
                  {`${p2pVendorsDetails?.data?.amount} ${p2pVendorsDetails?.data?.currency}`}
                </Typography>
              </Box>

              {/* <Box
                bgcolor={theme.palette.primary.dark}
                color={"#fff"}
                p={2}
                borderRadius={3}
                display={"flex"}
                flex={1}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Box textAlign={"left"}>
                  <Typography variant="h5" fontWeight={700}>
                    {t("blc_pw_5")}
                  </Typography>
                  <Typography variant="body2">
                    {t("blc_pw_6")} {p2pVendorsDetails?.seller?.name}{" "}
                    {t("blc_pw_7")}
                  </Typography>
                </Box>
              </Box> */}
              <Box
                display={"flex"}
                flexDirection={deviceType === "mobile" ? "column" : "row"}
                gap={deviceType === "mobile" ? 4 : 3}
              >
                <Box flexDirection={"column"} display={"flex"}>
                  <Box
                    flexDirection={"row"}
                    display={"flex"}
                    mt={deviceType === "mobile" ? 2 : 0}
                    width={"100%"}
                    minHeight={80}
                    alignItems={"stretch"}
                  >
                    <Box
                      bgcolor={"primary.main"}
                      color={"#fff"}
                      display={"flex"}
                      justifyContent={"center"}
                      width={"30%"}
                      sx={{
                        borderTopLeftRadius: 15,
                        p: deviceType === "mobile" ? 1 : 1.5,
                      }}
                      textAlign={"center"}
                      alignItems={"center"}
                      height={"100%"}
                    >
                      <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{
                          fontSize: deviceType === "mobile" ? 14 : 16,
                        }}
                      >
                        Auto
                      </Typography>
                    </Box>
                    <Box
                      bgcolor={theme.palette.secondary.light}
                      color={"#000"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      width={"70%"}
                      sx={{
                        borderTopRightRadius: 15,
                        p: deviceType === "mobile" ? 1 : 1.5,
                      }}
                      height={"100%"}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        mb={1}
                        sx={{
                          fontSize: deviceType === "mobile" ? 12 : 14,
                        }}
                      >
                        These payment options are confirmed instantly
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    // flex={1}
                    bgcolor={theme.palette.primary.light}
                    alignItems={"center"}
                    display="grid"
                    gridTemplateColumns={
                      deviceType === "tablet"
                        ? "repeat(2, 1fr)"
                        : deviceType === "mobile"
                        ? "repeat(2, 1fr)"
                        : "repeat(3, 1fr)"
                    }
                    gap={1}
                    p={1}
                    overflow={"auto"}
                    sx={{
                      borderBottomRightRadius: 15,
                      borderBottomLeftRadius: 15,
                    }}
                  >
                    {vendors?.map((item: Vendor, index: number) => (
                      <Vendors item={item} key={index} />
                    ))}
                  </Box>
                </Box>

                <Box display={"flex"} flexDirection={"column"}>
                  <Box
                    flexDirection={"row"}
                    display={"flex"}
                    mt={deviceType === "mobile" ? 2 : 0}
                    width={"100%"}
                    minHeight={80}
                    alignItems={"stretch"}
                  >
                    <Box
                      bgcolor={"primary.main"}
                      color={"#fff"}
                      display={"flex"}
                      justifyContent={"center"}
                      width={"30%"}
                      sx={{
                        borderTopLeftRadius: 15,
                        p: deviceType === "mobile" ? 1 : 1.5,
                      }}
                      textAlign={"center"}
                      alignItems={"center"}
                      height={"100%"}
                    >
                      <Typography
                        variant="h2"
                        fontWeight={800}
                        sx={{
                          fontSize: deviceType === "mobile" ? 14 : 16,
                        }}
                      >
                        Manual
                      </Typography>
                    </Box>
                    <Box
                      bgcolor={theme.palette.secondary.light}
                      color={"#000"}
                      display={"flex"}
                      flexDirection={"column"}
                      justifyContent={"center"}
                      width={"70%"}
                      sx={{
                        borderTopRightRadius: 15,
                        p: deviceType === "mobile" ? 1 : 1.5,
                      }}
                      height={"100%"}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        mb={1}
                        sx={{
                          fontSize: deviceType === "mobile" ? 12 : 14,
                        }}
                      >
                        These payment options require the Vendor's confirmation
                        after you mark payment as paid.
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    bgcolor={theme.palette.primary.light}
                    alignItems={"center"}
                    display="grid"
                    gridTemplateColumns={
                      deviceType === "tablet"
                        ? "repeat(2, 1fr)"
                        : deviceType === "mobile"
                        ? "repeat(2, 1fr)"
                        : "repeat(3, 1fr)"
                    }
                    gap={1}
                    p={1}
                    overflow={"auto"}
                    sx={{
                      borderBottomRightRadius: 15,
                      borderBottomLeftRadius: 15,
                    }}
                  >
                    {Manualvendors?.map((item: Vendor, index: number) => (
                      <Vendors item={item} key={index} />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
