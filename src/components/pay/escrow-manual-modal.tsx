"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface EscrowModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EscrowManualModal({ open, onClose }: EscrowModalProps) {
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 6,
          width: { xs: "90%", sm: "80%", md: "68vh" },
          maxWidth: "100%",
          border: "3px solid",
          borderColor: "primary.main",
        },
      }}
    >
      <Box
        p={{ xs: 2, sm: 3, md: 4 }}
        display="flex"
        flexDirection="column"
        height={{ xs: "85vh", sm: "78vh" }}
      >
        {/* Header */}
        <DialogTitle sx={{ p: 0, mb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              fontWeight={700}
              fontSize={{ xs: 18, sm: 20, md: 23 }}
              marginLeft={1}
            >
              Vendor’s Terms
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{
                backgroundColor: "#DD00041A",
                padding: 1,
              }}
            >
              <Icon
                icon="icon-park-solid:error"
                color="#DD0004"
                fontSize={12}
              />
            </IconButton>
          </Box>
          <Box mt={1} borderTop="3px solid #009fdd" />
        </DialogTitle>

        {/* Warning Box */}
        <Box
          bgcolor="secondary.main"
          py={2}
          px={2}
          borderRadius={5}
          textAlign="center"
          mb={2}
        >
          <Typography
            variant="body1"
            fontSize={{ xs: 12, sm: 14 }}
            fontWeight={700}
          >
            Make sure you Read, Understand & Accept the Vendor’s terms
          </Typography>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            flex: 1,
            overflowY: "auto",
            mb: 2,
            // Custom scrollbar styling for Webkit (Chrome, Safari, Edge)
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#009FDD",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-button:start:decrement, &::-webkit-scrollbar-button:end:increment":
              {
                display: "none",
                height: 0,
                background: "transparent",
              },
            // For Firefox
            scrollbarWidth: "thin",
            scrollbarColor: "#009FDD transparent", // Hardcoded color for Firefox
          }}
        >
          <Typography
            variant="body2"
            fontSize={{ xs: 12, sm: 14 }}
            color="text.primary"
            lineHeight={1.6}
          >
            {p2pEscrowDetails?.vendor?.terms}
          </Typography>
        </DialogContent>

        <Box display="flex" flexDirection="column">
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              fontSize: "12px",
              padding: "4px 12px",
              fontWeight: 600,
              borderRadius: "12px",
              p: 2,
              "&:hover": {
                backgroundColor: "primary.main",
              },
            }}
          >
            I Accept
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
