import {
  Avatar,
  Box,
  Button,
  Card,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import background from "../../assets/images/background.png";
import { theme } from "../../assets/themes/theme";
import { useDispatch, useSelector } from "react-redux";
import Notch from "../../assets/images/notch.svg";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import { t } from "i18next";
import { Icon } from "@iconify/react";
import EscrowManualModal from "./escrow-manual-modal";
import EscrowConfirmPaymentModal from "./escrow-confirm-payment-modal";
import APIService from "../../services/api-service";
import { setChatDetails } from "../../redux/reducers/pay";

interface ManualEscrowProps {
  onChatToggle: (isChatOpen: boolean) => void;
  onPaid: () => void;
  onChatOpen?: () => void;
}

export default function ManualEscrow({
  onChatToggle,
  onPaid,
  onChatOpen,
}: ManualEscrowProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [manualConfirmOpen, setManualConfirmOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [readMessageIds, setReadMessageIds] = useState<string[]>([]);
  const dispatch = useDispatch();

  const { p2pEscrowDetails, payId, chatDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const vendor_currency_sign = p2pEscrowDetails?.pay?.total_to_pay_currency;

  const unreadCount = useMemo(() => {
    return (
      chatDetails?.data?.filter(
        (msg: { sender_type: string; date_sent: string }) =>
          msg.sender_type !== "buyer" &&
          !readMessageIds.includes(msg.date_sent)
      ).length || 0
    );
  }, [chatDetails, readMessageIds]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChatToggle = () => {
    const newChatState = !isChatOpen;
    setIsChatOpen(newChatState);
    onChatToggle(newChatState);
    if (newChatState) {
      handleChatOpen();
      onChatOpen?.();
    }
  };

  const handleChatOpen = () => {
    if (chatDetails?.data) {
      const newReadMessageIds = chatDetails.data
        .filter((msg: { sender_type: string; date_sent: string }) => msg.sender_type !== "buyer")
        .map((msg: { sender_type: string; date_sent: string }) => msg.date_sent);
      setReadMessageIds((prev) => [
        ...new Set([...prev, ...newReadMessageIds]),
      ]);
    }
  };

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

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const userIP = await fetchUserIP();
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }

      const p2pChatPayload = {
        call_type: "p2p_chat",
        ip: userIP,
        lang: "en",
        pay_id: payId,
      };

      try {
        const resp = await APIService.p2pChat(p2pChatPayload);
        dispatch(setChatDetails(resp.data));
      } catch (error) {
        console.error("Error during Chat Payload:", error);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [dispatch, payId]);

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

  const Chat = () => {
    handleChatToggle();
  };

  const openPaymentClick = () => setManualConfirmOpen(true);
  const closePaymentClick = () => setManualConfirmOpen(false);

  const handlePaid = () => {
    setManualConfirmOpen(false);
    onPaid();
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
      {unreadCount > 0 && (
        <Box
          borderRadius={"50%"}
          minWidth={20}
          height={20}
          fontSize={11}
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
          px={unreadCount > 9 ? 1 : 0}
          aria-label={`${unreadCount} unread messages`}
        >
          {unreadCount}
        </Box>
      )}
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
          </Typography>
        </Box>

        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          p={1}
          boxShadow={"0px 2px 10px 0px rgba(0,0,0,0.15)"}
          bgcolor={"#ffffff"}
          width={"80%"}
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
              <span dangerouslySetInnerHTML={{ __html: vendor_currency_sign }} />
              {`${p2pEscrowDetails?.pay?.total_to_pay_amount} ${p2pEscrowDetails?.pay?.toa_currency}`}
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"column"} gap={1}>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography
                color={"#28304E"}
                variant="body2"
                fontSize={"10px"}
                fontWeight={700}
              >
                Payment Instructions
              </Typography>
              <Button
                variant="contained"
                sx={{
                  whiteSpace: "nowrap",
                  fontSize: "8px",
                  padding: "6px 6px",
                  fontWeight: 600,
                  bgcolor: "#D92D20",
                  color: "#fff",
                }}
                onClick={handleOpen}
              >
                Vendor’s Terms
              </Button>
              <EscrowManualModal open={open} onClose={handleClose} />
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
                  fontSize: 14,
                  px: 1,
                  py: 1,
                }}
              >
              <div dangerouslySetInnerHTML={{ __html: p2pEscrowDetails?.vendor?.description }} />
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
          <Icon icon="ph:hand-deposit-fill" fontSize={20} color={"#fff"} />
          I Have Paid
        </Button>
        <EscrowConfirmPaymentModal
          open={manualConfirmOpen}
          onClose={closePaymentClick}
          onPaid={handlePaid}
        />
      </Box>
    </Card>
  );
}