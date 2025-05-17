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
  onChatToggle: () => void;
}

export default function Chat({ deviceType, onChatToggle }: ChatProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { chatDetails, p2pEscrowDetails, payId, lang } = useSelector(
    (state: RootState) => state.pay
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Scroll to latest message and notify parent on chat open
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isFirstRender && chatDetails?.data) {
      onChatToggle();
      setIsFirstRender(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRender]);

  // Transform chatDetails.data into ChatItemProps
  interface ChatMessage {
    id: string; // Added unique ID for deduplication
    sender_type: string;
    use_name: string;
    use_image: string;
    online_status: number;
    local_time: string;
    date_sent: string;
    translated_message: string;
    image?: string;
  }

  const messages: ChatItemProps[] =
    chatDetails?.data?.map((msg: ChatMessage) => ({
      id: msg.id,
      senderType: msg.sender_type,
      name: msg.use_name,
      profilePic: msg.use_image,
      status: msg.online_status === 0 ? "Offline" : msg.online_status === 1 ? "Online" : "Away",
      localTime: msg.local_time,
      timeAgo: msg.date_sent,
      message: msg.translated_message,
      image: msg.image,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await handleSend(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (imgContent?: string) => {
    if (isSending) return;
    setIsSending(true);
 
    try {
      const comment = message.trim(); // text message
      const image = imgContent; // base64 image or URL
 
      // Don't send if both are empty
      if (!comment && !image) return;
 
      const userIP = await fetchUserIP();
      if (!userIP) {
        console.error("Unable to retrieve user IP");
        return;
      }
 
      const payload = {
        call_type: "p2p_chat",
        ip: userIP,
        lang: lang,
        pay_id: payId,
        comment,
        image,
      };
 
      const response = await APIService.p2pChat(payload);
      dispatch(setChatDetails(response.data));
      setMessage(""); // Clear input
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
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
            onClick={onChatToggle}
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
              {messages.map((msg) => {
                const justifyContent: "center" | "flex-end" | "flex-start" =
                  msg.senderType === "admin"
                    ? "center"
                    : msg.senderType === "buyer"
                    ? "flex-end"
                    : "flex-start";

                return (
                  <Box key={msg.id} display="flex" justifyContent={justifyContent}>
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
              <IconButton component="label">
                <Icon icon="humbleicons:image" fontSize={26} color="#A7A7A7" />
                <input type="file" accept="image/*" hidden onChange={(e) => handleFileUpload(e)} />
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
              onClick={() => handleSend()}
              variant="contained"
              disabled={isSending}
              sx={{
                fontSize: "14px",
                padding: "13px",
                fontWeight: 600,
                bgcolor: "primary.main",
                "&:hover": { backgroundColor: "primary.main" },
                whiteSpace: "nowrap",
              }}
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
}