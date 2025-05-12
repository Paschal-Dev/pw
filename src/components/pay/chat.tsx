// components/chat/chat.tsx
import React, { useEffect, useRef } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import menu from "../../assets/images/menu.svg";
import { MediaProps } from "../../utils/myUtils";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Icon } from "@iconify/react";
import ChatItem, { ChatItemProps } from "./chat-item";
import pic from "../../assets/images/profile.jpg";

interface ChatProps extends MediaProps {
  onClose: () => void;
}

const dummyMessages: ChatItemProps[] = [
  {
    senderType: "admin",
    name: "Peerwallet Admin",
    profilePic: pic,
    status: "Away",
    localTime: "8:00 AM",
    timeAgo: "10 Minutes ago",
    message:
      "To Make this process faster, please Upload all evidence that might be needed to resolve this. Thanks for your patience",
  },
  {
    senderType: "self",
    name: "Ejiro Malcolm",
    profilePic: pic,
    status: "Online",
    localTime: "9:15 AM",
    timeAgo: "5 Minutes ago",
    message: "Are you active, I am about to pay.",
  },
  {
    senderType: "other",
    name: "SDS Resources",
    profilePic: pic,
    status: "Offline",
    localTime: "7:30 AM",
    timeAgo: "1 Hour ago",
    message: "I am yet to receive your payment.",
  },
];

export default function Chat({ deviceType, onClose }: ChatProps): React.JSX.Element {
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <Grid item sm={12} md={8} display="flex">
      <Box flex={1} display="flex" flexDirection="column" gap={2}>
        {/* Chat Header */}
        <Box
          bgcolor={theme.palette.primary.dark}
          p={1}
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={deviceType === "mobile" ? 1 : 4}
        >
          <Box
            display="flex"
            alignItems="center"
            color="#fff"
            gap={1}
            px={1}
            textAlign={deviceType === "mobile" ? "center" : "start"}
          >
            {deviceType !== "mobile" && (
              <Box
                borderRadius="50%"
                bgcolor="white"
                p={1}
                height={20}
                display="flex"
                alignItems="center"
              >
                <img
                  src={menu}
                  width="18px"
                  height="14px"
                  style={{ backgroundColor: "#009FDD", padding: "2px" }}
                />
              </Box>
            )}
            <Typography fontSize={deviceType === "mobile" ? 16 : "4vh"} fontWeight={700}>
              Chat For #{p2pEscrowDetails?.pay?.unique_id}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{ border: "1px solid #fff", color: "#fff", p: 1 }}
            onClick={onClose}
          >
            Close
          </Button>
        </Box>

        <Box>
          {/* Chat Messages */}
          <Box
            flex={1}
            bgcolor="#F5FBFE"
            p={3}
            sx={{
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              maxHeight: "400px", // or any fixed height you want
              overflowY: "auto", // enables vertical scroll
            }}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              {dummyMessages.map((msg, index) => {
                const justifyContent: "center" | "flex-end" | "flex-start" =
                  msg.senderType === "admin"
                    ? "center"
                    : msg.senderType === "self"
                    ? "flex-end"
                    : "flex-start";

                return (
                  <Box key={index} display="flex" justifyContent={justifyContent}>
                    <ChatItem {...msg} />
                  </Box>
                );
              })}
              <div ref={messagesEndRef} />
            </Box>
          </Box>

          {/* Input Area */}
          <Box display="flex" flexDirection="row" alignItems="center" gap={4} bgcolor="#fff" p={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              border="1px solid #D8DADC"
              py={1}
              borderRadius={3}
              flex={1}
            >
              <IconButton>
                <Icon icon="humbleicons:image" fontSize={26} color="#A7A7A7" />
              </IconButton>
              <Box flex={1}>
                <input
                  type="text"
                  placeholder="Type something"
                  style={{
                    padding: 4,
                    border: "none",
                    outline: "none",
                    fontSize: "12px",
                    background: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                fontSize: "14px",
                padding: "13px",
                fontWeight: 600,
                bgcolor: "primary.main",
                "&:hover": { backgroundColor: "primary.main" },
                whiteSpace: "nowrap",
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}
