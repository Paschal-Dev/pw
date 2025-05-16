// components/chat/chat-item.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

type SenderType = "admin" | "buyer" | "vendor";

export interface ChatItemProps {
  name: string;
  profilePic: string;
  status: "Online" | "Offline" | "Away";
  localTime: string;
  timeAgo: string;
  message: string;
  senderType: SenderType;
}

export default function ChatItem({
  name,
  profilePic,
  status,
  localTime,
  timeAgo,
  message,
  senderType,
}: ChatItemProps): React.JSX.Element {
  const statusColorMap = {
    Online: "#4CAF50",
    Offline: "#F44336",
    Away: "#FCC82B",
  };

  const chatBgColorMap = {
    admin: "#D6FED6",
    buyer: "#FFE5E5",
    vendor: "#E3F2FD",
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="start" maxWidth="60%" mb={2}>
      <Box display="flex" alignItems="center">
        <Box
          borderRadius="50%"
          bgcolor="#fff"
          width={40}
          height={40}
          overflow="hidden"
          p="5px"
          boxShadow="0px 4px 4px rgba(0, 0, 0, 0.15)"
        >
          <img
            src={profilePic}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        </Box>
        <Box display="flex" flexDirection="column" ml={1}>
          <Box display="flex" alignItems="center">
            <Typography variant="body1" fontWeight={700} fontSize="14px" mr={0.5}>
              {name}
            </Typography>
            {senderType === "admin" && (
              <Icon icon="solar:verified-check-bold" fontSize={20} color="#009fdd" />
            )}
          </Box>
          <Box display="flex" alignItems="center">
            <Box
              bgcolor={statusColorMap[status]}
              border="1px solid #fff"
              borderRadius="50%"
              width={12}
              height={12}
            />
            <Typography variant="body2" fontSize="12px" ml={1}>
              {status}
            </Typography>
            <Typography variant="body2" fontSize="12px" color="#8E97A4" ml={0.5}>
              | Local Time: {localTime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box p={2} bgcolor={chatBgColorMap[senderType]} mt={1} borderRadius="8px">
        <Typography variant="body2" fontSize="12px">
          {message}
        </Typography>
      </Box>

      <Typography variant="body2" color="#8E97A4" mt={0.5}>
        {timeAgo}
      </Typography>
    </Box>
  );
}
