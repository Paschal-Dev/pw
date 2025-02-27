import { Avatar, Box, Button, Card, CardMedia, Typography } from "@mui/material";
import React from "react";
import background from "../../assets/images/background.png";
import { theme } from "../../assets/themes/theme";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notch from "../../assets/images/notch.svg";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import { t } from "i18next";
// import { PageProps } from "../../utils/myUtils";
// import { setCurrentPage, setP2PEscrowDetails, setShouldRedirectEscrow } from "../../redux/reducers/pay";
import { setCurrentPage, setP2PEscrowDetails } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";

export default function EscrowConfirm(): React.JSX.Element {
  const { p2pEscrowDetails, payId } = useSelector((state: RootState) => state.pay);
  // const resp = await APIService.sendOTP(sendOtpPayload);
  // const { payId } = useSelector((state: RootState) => state.pay);
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  const dispatch = useDispatch();
  const getRatingCounts = (rating: number) => {
    let fullStarsCount = 0;
    let emptyStarsCount = 0;

    if (rating >= 90) {
      fullStarsCount = 5;
      emptyStarsCount = 0;
    } else if (rating >= 70) {
      fullStarsCount = 4;
      emptyStarsCount = 1;
    } else if (rating >= 50) {
      fullStarsCount = 3;
      emptyStarsCount = 2;
    } else if (rating >= 30) {
      fullStarsCount = 2;
      emptyStarsCount = 3;
    } else {
      fullStarsCount = 1;
      emptyStarsCount = 4;
    }

    return { fullStarsCount, emptyStarsCount };
  };

  const { fullStarsCount, emptyStarsCount } = getRatingCounts(p2pEscrowDetails?.seller?.rating);

  const ratingImages = [];
  for (let i = 0; i < fullStarsCount; i++) {
    ratingImages.push(<img key={`full-${i}`} src={rating} alt="Full star" style={{ width: 30, marginTop: "10px" }} />);
  }
  for (let i = 0; i < emptyStarsCount; i++) {
    ratingImages.push(<img key={`empty-${i}`} src={emptyRating} alt="Empty star" style={{ width: 30, marginTop: "10px" }} />);
  }


  const handlePaymentClick = () => {
    const width = window.innerWidth * 0.5;
    const height = window.innerHeight * 0.6;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const paymentLink = p2pEscrowDetails?.vendor?.payment_link;

    if (!paymentLink) {
      console.log("No payment link provided");
      return;
    }
  
    // Attempt to open the popup
    const popup = window.open(
      paymentLink,
      "PaymentWindow",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  
    if (popup) {
      // Popup was allowed
      popup.focus();
      console.log("Popup opened successfully");
    } else {
      // Popup was blocked, open in a new tab
      window.open(paymentLink, "_blank");
      console.log("Popup was blocked, opening in a new tab");
    }

    dispatch(setCurrentPage("p2p-payment"));
    const checkPaymentStatus = setInterval(() => {



      const body = {
        call_type: "pay",
        ip: "192.168.0.0",
        lang: "en",
        pay_id: payId,
      };
      APIService.sendOTP(body)
        .then((resp) => {
          if ([0, 1, 2, 3, 5].includes(resp.data?.pay?.payment_status)) {
            console.log("Status Check", resp.data?.pay?.payment_status);
            dispatch(setP2PEscrowDetails(resp.data));
            if (resp.data?.pay?.payment_status === 1) {
              // console.log("Status Check", resp.data?.pay?.payment_status);
              // console.log("Payment Successful, rendering success page");
              // if (paymentWindow && !paymentWindow.closed) {
              //   paymentWindow.close();
              // }

              clearInterval(checkPaymentStatus);
              dispatch(setP2PEscrowDetails(resp.data));

              const url = `https://pay.peerwallet.com/?v=${resp.data.data.unique_id}`;

              const RedirectUrl = resp.data.data.redirect_url;

              if (resp.data?.data.redirect_url === url) {
                dispatch(setCurrentPage("p2p-payment"));
              } else {
                console.log("Payment Successful, rendering success page", RedirectUrl);
                window.location.assign(RedirectUrl);
              }
            } else if (resp.data?.pay?.payment_status === 5) {
              console.log("Status Check", resp.data?.pay?.payment_status);
              console.log("Payment failed, rendering error page");
              if (popup && !popup.closed) {
                popup.close();
              }
              clearInterval(checkPaymentStatus);
              dispatch(setP2PEscrowDetails(resp.data));
              dispatch(setCurrentPage("p2p-payment"));
            } else if (resp.data?.pay?.payment_status === 3) {
              console.log("Status Check", resp.data?.pay?.payment_status);
              console.log("Wrong Payment");
              if (popup && !popup.closed) {
                popup.close();
              }
              clearInterval(checkPaymentStatus);
              dispatch(setP2PEscrowDetails(resp.data));
              dispatch(setCurrentPage("p2p-payment"));
            }

          }
        })
        .catch((error) => {
          console.error(error);
        });


      if (popup && popup.closed) {
        console.log("Payment window closed by the user.");
        // dispatch(setCurrentPage("p2p-payment"));
      }
      // if (paymentWindow.close()) {

      //   clearInterval(checkWindowClosed);

      //   setTimeout(() => {
      //     dispatch(setCurrentPage("p2p-payment"));
      //   }, 2000);

      //   console.log("Payment Window Closed =>>> ");
      //   dispatch(setShouldRedirectEscrow(true));

      // }
    }, 5000);
  };


  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.1)",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        position: "relative",
        mt: 1,
        flex: 1,
      }}
      component={Box}
      borderRadius={2}
    >
      <Box
        display={"flex"}
        flexDirection="column"
        justifyContent={"space-between"}
        alignItems={"center"}
        width="100%"
        pb={2}
        flex={1}
        mt={1}
      >
        <Box
          py={2}
          zIndex={5}
          bgcolor={"#bccefb"}
          borderRadius={"50%"}
          px={1}
          paddingY={1}
          paddingBottom={0}
          position="relative"
        >
          <Avatar variant="circular" style={{ width: 100, height: 100 }}>
            <img src={p2pEscrowDetails?.seller?.image} width={100} alt="" />
          </Avatar>
          <Box position="absolute" top={"5%"} right={0} zIndex={10}>
            <Box bgcolor={"white"} borderRadius={"50%"} px={0.5} pt={0.5}>
              <img src={p2pEscrowDetails?.seller?.ranking} alt="" style={{ width: 30 }} />
            </Box>
          </Box>
        </Box>
        <Box
          pb={0.5}
          zIndex={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <div style={{ marginBottom: "10px" }}>
            {ratingImages}
          </div>
          <Typography variant="caption">{`${fullStarsCount}/5`} ({p2pEscrowDetails?.seller?.rating}%)</Typography>{" "}
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          p={1}
          boxShadow={"0px 2px 10px 0px rgba(0,0,0,0.15)"}
          bgcolor={"#ffffff"}
          width={"70%"}
          borderRadius={3}
          position="relative"
          mb={1}
        >
          <Box position="relative" mb={1}>
            <CardMedia
              component={"img"}
              image={Notch}
              style={{ width: 155, marginTop: -8 }}
            />
            <Typography
              variant="h6"
              fontWeight={700}
              color={"#fff"}
              textAlign={"center"}
              position="absolute"
              bottom={0}
              width="100%"
            >
              {t("pay")}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            textAlign={"center"}
            mb={1}
            style={{ width: "100%" }}
          >
            {p2pEscrowDetails?.seller?.name}
          </Typography>
          <Box
            borderRadius={2}
            bgcolor={"#E3EFF5"}
            py={0.6}
            width={"80%"}
            boxShadow={
              "inset 0 4px 4px 0 rgba(0, 0, 0, 0.15), inset 0 -2px 5px 0 rgba(0, 0, 0, 0.15)"
            }
            mb={2}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              color={theme.palette.success.main}
              textAlign={"center"}
            >
              <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
              {`${p2pEscrowDetails?.pay?.total_original_amount} ${p2pEscrowDetails?.data?.currency}`}
            </Typography>
          </Box>
          <img src={p2pEscrowDetails?.vendor?.logo} alt="" width='80%' />
        </Box>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            paddingY: 1.5,
            borderRadius: 2,
            ":hover": { background: theme.palette.primary.main },
            fontSize: 20,
            fontWeight: 700,
          }}
          onClick={handlePaymentClick}
        >
          {t("blc_pw_19")}
        </Button>
      </Box>
    </Card>
  );
}
