import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { theme } from "../../assets/themes/theme";
import { Icon } from "@iconify/react/dist/iconify.js";
export default function ManualPaymentExpired(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
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
      justifyContent={"start"}
      p={2}
      borderRadius={3}
      display={"flex"}
      flexDirection={"column"}
      gap={1}
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
        <Icon icon="icomoon-free:cancel-circle" fontSize={60} color="#D92D20" />
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
    </Box>
  );
}
