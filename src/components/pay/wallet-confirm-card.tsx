import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import Notch from "../../assets/images/notch.svg";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { theme } from "../../assets/themes/theme";
import background from "../../assets/images/background.png";
import WalletOtp from "./wallet-otp";

interface MediaProps {
  deviceType: string;
}

export default function WalletConfirmCard({
  deviceType,
}: MediaProps): React.JSX.Element {
  const { t } = useTranslation();
  const { walletSendPaymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const currency_sign = walletSendPaymentDetails?.data?.currency_sign;
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

  const { fullStarsCount, emptyStarsCount } = getRatingCounts(
    walletSendPaymentDetails?.seller?.rating
  );

  const ratingImages = [];
  for (let i = 0; i < fullStarsCount; i++) {
    ratingImages.push(
      <img
        key={`full-${i}`}
        src={rating}
        alt="Full star"
        style={{ width: 30, marginTop: "10px" }}
      />
    );
  }
  for (let i = 0; i < emptyStarsCount; i++) {
    ratingImages.push(
      <img
        key={`empty-${i}`}
        src={emptyRating}
        alt="Empty star"
        style={{ width: 30, marginTop: "10px" }}
      />
    );
  }
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (deviceType === "mobile" || deviceType === "tablet") {
      const timer = setTimeout(() => {
        handleOpen();
        console.log("Button Clicked");
      }, 5000);

      // Cleanup the timer if the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [deviceType]);

  return (
    <>
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
            position="relative"
            border={"4px solid white"}
            borderRadius={"50%"}
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
                <img
                  src={walletSendPaymentDetails?.seller?.image}
                  width={100}
                />
              </Avatar>
              <Box position="absolute" top={"5%"} right={0} zIndex={10}>
                <Box bgcolor={"white"} borderRadius={"50%"} px={0.5} pt={0.5}>
                  <img
                    src={walletSendPaymentDetails?.seller?.ranking}
                    alt=""
                    style={{ width: 30 }}
                  />
                </Box>
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
            <div style={{ marginBottom: "10px" }}>{ratingImages}</div>
            <Typography variant="caption">
              {`${fullStarsCount}/5`} (
              {walletSendPaymentDetails?.seller?.rating}
              %)
            </Typography>{" "}
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
              {walletSendPaymentDetails?.seller?.name}
            </Typography>
            <Box
              borderRadius={2}
              bgcolor={"#E3EFF5"}
              py={0.6}
              width={"80%"}
              boxShadow={
                "inset 0 4px 4px 0 rgba(0, 0, 0, 0.15), inset 0 -2px 5px 0 rgba(0, 0, 0, 0.15)"
              }
              mb={3}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color={theme.palette.success.main}
                textAlign={"center"}
              >
                <span dangerouslySetInnerHTML={{ __html: currency_sign }} />
                {walletSendPaymentDetails?.data?.amount}
              </Typography>
            </Box>
          </Box>

          {(deviceType === "mobile" || deviceType === "tablet") && (
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                width: "auto",
                paddingY: 1,
                px: 5,
                borderRadius: 2,
                ":hover": { background: theme.palette.primary.main },
              }}
            >
              {t("blc_pw_29")}
            </Button>
          )}
        </Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <WalletOtp
            // onOtpVerification={handleOtpVerification}
            deviceType={deviceType}
          />
        </Modal>
      </Card>
    </>
  );
}
