import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import { Icon } from "@iconify/react";
import { theme } from "../../assets/themes/theme";
import { useTranslation } from "react-i18next";

// import { BiUpload } from "react-icons/bi";
// import { PageProps } from "../../utils/myUtils";
// import { setCurrentPage, setP2PEscrowDetails, setShouldRedirectEscrow } from "../../redux/reducers/pay";
// import { setCurrentPage } from "../../redux/reducers/pay";

export default function ManualPaymentStatusModal({
  onChatToggle,
}: {
  onChatToggle: (isChatOpen: boolean) => void;
}): React.JSX.Element {
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);

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

  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    const newChatState = !isChatOpen;
    setIsChatOpen(newChatState);
    onChatToggle(newChatState); // Notify parent of state change
  };

  // ... existing code until the Chat function

  const Chat = async () => {
    handleChatToggle();
    console.log("Display Chat");
  };
  const { t } = useTranslation();

  return (
    <>
      <Box
        display={"flex"}
        flexDirection="column"
        alignItems="center"
        width="100%"
        gap={2}
        bgcolor={"#fff"}
      >
        <Box p={{ xs: 2, sm: 3, md: 4 }}>
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Box
              bgcolor={"#FEF3F2"}
              borderRadius={"50%"}
              p={3}
              width={70}
              height={70}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Box
                bgcolor={"#FEE4E2"}
                borderRadius={"50%"}
                width={60}
                height={60}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  icon="tabler:alert-triangle-filled"
                  color="#DD0004"
                  fontSize={40}
                />
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body1"
              fontSize={{ xs: 12, sm: "24px" }}
              fontWeight={800}
              textAlign={"center"}
              color={"#D92D20"}
            >
              {t("blc_pw_68")}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            fontSize={{ xs: 12, sm: "12px" }}
            textAlign={"center"}
          >
            {t("blc_pw_69")}
          </Typography>

          <Box display="flex" flexDirection="column">
            <Box
              borderRadius={"50%"}
              width={20}
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
              right={"49%"}
              zIndex={1}
              mt={1}
            >
              2
            </Box>
            <Box display={"flex"} justifyContent={"center"} mt={2}>
            <Button
              variant="outlined"
              sx={{
                width: "35%",
                paddingY: 1,
                borderRadius: 2,
                ":hover": { background: "transparent" },
                fontSize: 14,
                fontWeight: 800,
                display: "flex",
                gap: 0.3,
                color: "primary.main",
                border: "1px solid",
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
             {t("blc_pw_70")}
            </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
