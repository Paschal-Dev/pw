import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import menu from "../../assets/images/menu.svg";
import { MediaProps } from "../../utils/myUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ChatProps extends MediaProps {
  onClose: () => void; // Callback to close the chat
}

export default function Chat({ deviceType, onClose }: ChatProps): React.JSX.Element {
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
  return (
    <Grid item sm={12} md={8} display={"flex"}>
      <Box flex={1} display={"flex"} flexDirection={"column"} gap={2}>
        <Box
          bgcolor={theme.palette.primary.dark}
          p={1}
          borderRadius={2}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={deviceType === "mobile" ? 1 : 4}
          // flex={1}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={deviceType === "mobile" ? "center" : "none"}
            color={"#fff"}
            gap={1}
            px={1}
            textAlign={deviceType === "mobile" ? "center" : "start"}
          >
            <Box
              borderRadius={"50%"}
              bgcolor={"white"}
              p={1}
              justifyContent="center"
              alignContent="center"
              textAlign="center"
              height={deviceType === "mobile" ? 16 : 20}
              display={deviceType === "mobile" ? "none" : "block"}
            >
              <img
                src={menu}
                width={deviceType === "mobile" ? "16px" : "18px"}
                height={deviceType === "mobile" ? "12px" : "14px"}
                style={{ backgroundColor: "#009FDD", padding: "2px" }}
              />
            </Box>
            <Typography fontSize={deviceType === "mobile" ? 16 : "4vh"} fontWeight={700}>
              Chat For #{p2pEscrowDetails?.pay?.unique_id}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{
              border: "1px solid #fff",
              color: "#fff",
              p: 1,
            }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>

        <Box>
          <Box flex={1} bgcolor={"#F5FBFE"} borderRadius={3}>
            <Typography>Box for Chat!!</Typography>
          </Box>
          <Box></Box>
        </Box>
      </Box>
    </Grid>
  );
}
