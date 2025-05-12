import { Avatar, Box, Button, Card, Typography } from "@mui/material";
import React, { useState } from "react";
import background from "../../assets/images/background.png";
import { theme } from "../../assets/themes/theme";
// import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import vendors from "../../assets/images/vendors.png";
import { Icon } from "@iconify/react";
// import { BiUpload } from "react-icons/bi";
// import { PageProps } from "../../utils/myUtils";
// import { setCurrentPage, setP2PEscrowDetails, setShouldRedirectEscrow } from "../../redux/reducers/pay";
// import { setCurrentPage } from "../../redux/reducers/pay";

export default function AwaitingVendorConfirmation({
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

  const { fullStarsCount, emptyStarsCount } = getRatingCounts(p2pEscrowDetails?.seller?.rating);

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

  return (
    <>
      <Box display={"flex"} flexDirection="column" alignItems="center" width="100%" gap={2}>
        <Card
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.1)",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            position: "relative",
            mt: 1,
            //   flex: 1,
            height: "45%",
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
            <Icon icon="lets-icons:chat-fill" fontSize={16} color={theme.palette.primary.main} />
            Chat
          </Button>
          <Box
            display={"flex"}
            flexDirection="column"
            alignItems={"center"}
            width="100%"
            pb={2}
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
            <Box pb={0.5} zIndex={5} display="flex" flexDirection="column" alignItems="center">
              <div style={{ marginBottom: "10px" }}>{ratingImages}</div>
              <Typography variant="caption">
                {`${fullStarsCount}/5`} ({p2pEscrowDetails?.seller?.rating}%)
              </Typography>{" "}
            </Box>
          </Box>
        </Card>
        {/* Awaiting vendor confirmation */}
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box display="flex" alignItems="center" position={"relative"}>
            <img src={vendors} alt="" style={{ width: "100%", height: "auto" }} />
            <Box
              width={35}
              height={35}
              display="flex"
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={"#FFE79E"}
              border={"20px solid #FFFAEB"}
              borderRadius={"50%"}
              position={"absolute"}
              right={-30}
              bottom={-10}
            >
              <Icon icon="eos-icons:loading" fontSize={30} color="#b95c01" />
            </Box>
          </Box>
          <Box textAlign="center" width="100%">
            <Typography variant="h6" fontWeight={700} textAlign="center">
              Awaiting Vendor's Confirmation
            </Typography>
            <Typography variant="body2" fontSize={12} textAlign="center" width={"92%"}>
              This payment is in progress, once the vendor confirms your payment the page will be
              automatically updated
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
