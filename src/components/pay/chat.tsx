import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import menu from "../../assets/images/menu.svg";
import { MediaProps } from "../../utils/myUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Icon } from "@iconify/react";
import ChatItem, { ChatItemProps } from "./chat-item";
import APIService from "../../services/api-service";
import { setChatDetails } from "../../redux/reducers/pay";

interface ChatProps extends MediaProps {
  onClose: () => void;
  onChatOpen: () => void; // Notify parent when chat is opened
}

export default function Chat({ deviceType, onClose, onChatOpen }: ChatProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { chatDetails, p2pEscrowDetails, payId, lang } = useSelector(
    (state: RootState) => state.pay
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Scroll to latest message and notify parent on chat open
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isFirstRender && chatDetails?.data) {
      onChatOpen();
      setIsFirstRender(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRender]);

  // Transform chatDetails.data into ChatItemProps
  interface ChatMessage {
    sender_type: string;
    use_name: string;
    use_image: string;
    online_status: number;
    local_time: string;
    date_sent: string;
    translated_message: string;
  }

  const dummyMessages: ChatItemProps[] =
    chatDetails?.data?.map((msg: ChatMessage) => ({
      senderType: msg.sender_type,
      name: msg.use_name,
      profilePic: msg.use_image,
      status: msg.online_status === 0 ? "Offline" : msg.online_status === 1 ? "Online" : "Away",
      localTime: msg.local_time,
      timeAgo: msg.date_sent,
      message: msg.translated_message,
    })) || [];

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
        lang: lang,
        pay_id: payId,
      };

      try {
        const resp = await APIService.p2pChat(p2pChatPayload);
        dispatch(setChatDetails(resp.data));
      } catch (error) {
        console.error("Error during Chat Payload:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [dispatch, lang, payId]);

  const handleSend = async () => {
    try {
      if (!message.trim()) return;
      const userIP = await fetchUserIP();
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      const p2pChatPayload = {
        call_type: "p2p_chat",
        ip: userIP,
        lang: lang,
        pay_id: payId,
        comment: message,
      };

      const resp = await APIService.p2pChat(p2pChatPayload);
      dispatch(setChatDetails(resp.data));
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
              height: "400px",
              overflowY: "auto",
            }}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              {dummyMessages.map((msg, index) => {
                const justifyContent: "center" | "flex-end" | "flex-start" =
                  msg.senderType === "admin"
                    ? "center"
                    : msg.senderType === "buyer"
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
              onClick={handleSend}
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
