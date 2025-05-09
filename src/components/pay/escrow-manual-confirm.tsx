import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import background from "../../assets/images/background.png";
import { theme } from "../../assets/themes/theme";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Notch from "../../assets/images/notch.svg";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import { t } from "i18next";
import { Icon } from "@iconify/react";
// import { BiUpload } from "react-icons/bi";
// import { PageProps } from "../../utils/myUtils";
// import { setCurrentPage, setP2PEscrowDetails, setShouldRedirectEscrow } from "../../redux/reducers/pay";
// import { setCurrentPage } from "../../redux/reducers/pay";
import EscrowManualModal from "./escrow-manual-modal";
import EscrowConfirmPaymentModal from "./escrow-confirm-payment-modal";

export default function EscrowManualConfirm({ onChatToggle }: { onChatToggle: (isChatOpen: boolean) => void }): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { p2pEscrowDetails, } = useSelector(
    (state: RootState) => state.pay
  );
  // const resp = await APIService.sendOTP(sendOtpPayload);
  // const { payId } = useSelector((state: RootState) => state.pay);
  const currency_sign = p2pEscrowDetails?.data?.currency_sign;
  // const dispatch = useDispatch();
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
    p2pEscrowDetails?.seller?.rating
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
  // const [copyText, setCopyText] = useState("Copy");

  // const handleCopy = async () => {
  //   const address = "0xc7061A......6F53c655";
  //   try {
  //     await navigator.clipboard.writeText(address);
  //     setCopyText("Copied!");
  //     setTimeout(() => setCopyText("Copy"), 2000); // Reset after 2 seconds
  //   } catch (err) {
  //     console.error("Failed to copy: ", err);
  //     setCopyText("Error");
  //   }
  // };

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    const newChatState = !isChatOpen;
    setIsChatOpen(newChatState);
    onChatToggle(newChatState); // Notify parent of state change
  };

  // ... existing code until the Chat function

  const Chat = async () => {
    handleChatToggle();
    console.log('Display Chat');
  };

  const [manualConfirmOpen, setPaymentClickOpen] = useState(false);

  const openPaymentClick = () => setPaymentClickOpen(true);
  const closePaymentClick = () => setPaymentClickOpen(false);

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
        borderRadius={"50%"}
        width={20}
        height={20}
        fontSize={11}
        // p={0.1}
        bgcolor={"red"}
        color={"#fff"}
        fontWeight={600}
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        position={"absolute"}
        zIndex={10}
        right={13}
      >
        2
      </Box>
      <Button
        variant="outlined"
        sx={{
          width: "25%",
          paddingY: 0.5,
          borderRadius: 2,
          ":hover": { background: "transparent" },
          fontSize: 14,
          fontWeight: 600,
          display: "flex",
          gap: 0.3,
          color: "primary.main",
          border: "1px solid",
          position: "absolute",
          top: "1.5%",
          right: 14,
          zIndex: 9,
        }}
        onClick={Chat}
      >
        <IconButton
          sx={{
            color: "primary.main",
            // backgroundColor: 'primary.main',
            padding: 0,
            "&:hover": { backgroundColor: "primary.main" },
          }}
        >
          <Icon
            icon="lets-icons:chat-fill"
            fontSize={16}
            color={theme.palette.primary.main}
          />
        </IconButton>
        Chat
      </Button>
      <Box
        display={"flex"}
        flexDirection="column"
        justifyContent={"space-between"}
        alignItems={"center"}
        width="100%"
        pb={2}
        flex={1}
        mt={1}
        // position={'relative'}
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
              <img
                src={p2pEscrowDetails?.seller?.ranking}
                alt=""
                style={{ width: 30 }}
              />
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
            {`${fullStarsCount}/5`} ({p2pEscrowDetails?.seller?.rating}%)
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
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              gap={4}
              alignItems="center"
            >
              <Typography
                color={"#28304E"}
                variant="body2"
                fontSize={"10px"}
                fontWeight={700}
              >
                Vendor’s Instructions
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: "8px",
                  padding: "4px 4px",
                  fontWeight: 600,
                }}
                onClick={handleOpen}
              >
                Read Vendor’s Terms
              </Button>
              <EscrowManualModal open={open} onClose={handleClose} />
            </Box>
            {/* <Box
              bgcolor={theme.palette.secondary.light}
              borderRadius={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: 10,
                  px: 1,
                }}
              >
                Account Number : 2773777383
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                bgcolor={"primary.main"}
                color={"#fff"}
                px={1}
                py={0.5}
                borderRadius={2}
                gap={0.5}
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    padding: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Icon icon="clarity:paste-solid" fontSize={16} color="#fff" />
                </IconButton>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    fontSize: 10,
                  }}
                >
                  {copyText}
                </Typography>
              </Box>
            </Box>
            <Box
              bgcolor={theme.palette.secondary.light}
              borderRadius={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: 9,
                  px: 1,
                }}
              >
                Account Name : John Joseph Abel
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                bgcolor={"primary.main"}
                color={"#fff"}
                px={1}
                py={0.5}
                borderRadius={2}
                gap={0.5}
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    padding: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Icon icon="clarity:paste-solid" fontSize={16} color="#fff" />
                </IconButton>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    fontSize: 10,
                  }}
                >
                  {copyText}
                </Typography>
              </Box>
            </Box>
            <Box
              bgcolor={theme.palette.secondary.light}
              borderRadius={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: 10,
                  px: 1,
                }}
              >
                Bank Name : Providus
              </Typography>
              <Box
                display={"flex"}
                alignItems={"center"}
                bgcolor={"primary.main"}
                color={"#fff"}
                px={1}
                py={0.5}
                borderRadius={2}
                gap={0.5}
              >
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    padding: 0,
                    "&:hover": { backgroundColor: "transparent" },
                  }}
                >
                  <Icon icon="clarity:paste-solid" fontSize={16} color="#fff" />
                </IconButton>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    fontSize: 10,
                  }}
                >
                  {copyText}
                </Typography>
              </Box>
            </Box> */}
            <Box
              bgcolor={theme.palette.secondary.light}
              borderRadius={2}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  fontSize: 12,
                  px: 1,
                }}
              >
                Please send the exact amount you see in this invoice to my
                Paypal email at{" "}
                <span style={{ textDecoration: "underline" }}>
                  frank@peerwallet.com
                </span>{" "}
                as Friends & family only! Payment as goods and services would be
                returned.
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            width: "80%",
            paddingY: 1,
            borderRadius: 2,
            ":hover": { background: theme.palette.primary.main },
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            gap: 1,
          }}
          onClick={openPaymentClick}
          
        >
          <IconButton
            sx={{
              color: "primary.main",
              // backgroundColor: 'primary.main',
              padding: 0,
              "&:hover": { backgroundColor: "primary.main" },
            }}
            
          >
            <Icon
              icon="ph:hand-deposit-fill"
              fontSize={16}
              color={theme.palette.primary.main}
            />
          </IconButton>
          I Have Paid
        </Button>
        <EscrowConfirmPaymentModal open={manualConfirmOpen} onClose={closePaymentClick} />
      </Box>
    </Card>
  );
}
