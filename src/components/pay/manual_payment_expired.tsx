import {
  Avatar,
  Box,
  Button,
  Card,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import rating from "../../assets/images/rating.png";
import emptyRating from "../../assets/images/empty-rating.svg";
import { Icon } from "@iconify/react";
import { theme } from "../../assets/themes/theme";
import background from "../../assets/images/background.png";

export default function ManualPaymentExpired(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
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
  // const { t } = useTranslation();
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
      flex={1}
      bgcolor={"#FFF"}
      alignItems={"center"}
      p={2}
      borderRadius={3}
      display={"flex"}
      flexDirection={"column"}
      gap={1}
    >
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
          // pt: 2,
          //   flex: 1,
          height: "70%",
        }}
        component={Box}
        borderRadius={2}
      >
        <Box
          display={"flex"}
          flexDirection="column"
          // justifyContent={"space-between"}
          alignItems={"center"}
          width="100%"
          pb={2}
          // flex={1}
          mt={2}
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
        </Box>
      </Card>
      <Card
        sx={{
          width: "95%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.1)",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          position: "relative",
          gap: 1,
          pt: 4,
          pb: 2,
          px: 1,
          height: "100%",
        }}
        component={Box}
        borderRadius={2}
      >
        <Box
          width={120}
          height={120}
          bgcolor={"#FEE4E2"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          border={"20px solid #FEF3F2"}
          borderRadius={"50%"}
        >
          <Icon
            icon="icomoon-free:cancel-circle"
            fontSize={60}
            color="#D92D20"
          />
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          color={"#fff"}
          gap={deviceType === "mobile" ? 2 : 1}
        >
          <Typography
            variant="h6"
            color={"#D92D20"}
            fontWeight={800}
            fontSize={deviceType === "mobile" ? 14 : 24}
          >
            Payment Expired
          </Typography>
          <Typography variant="body2" fontSize={12} color={"#000"}>
            The Transaction Has Timed Out
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#D92D20",
            color: "#fff",
            p: 1,
            width: "80%",
            borderRadius: 4,
          }}
          // onClick={onClose}
        >
          Go Back
        </Button>
      </Card>
    </Box>
  );
}
