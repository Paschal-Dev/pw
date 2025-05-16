"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  // useMediaQuery,
  // useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import APIService from "../../services/api-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { useState, useEffect } from "react";
import {
  setConfirmPaymentDetails,
  // setPaidClicked,
} from "../../redux/reducers/pay";

interface EscrowConfirmPaymentProps {
  open: boolean;
  onClose: () => void;
  // onPaidToggle: () => void;
}

export default function EscrowConfirmPaymentModal({
  open,
  onClose,
}: // onPaidToggle,
EscrowConfirmPaymentProps) {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  // Simplify device type detection
  // const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "pc";
  const { payId, lang } = useSelector((state: RootState) => state.pay);
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

  const handleConfirm = async () => {
    // dispatch(setPaidClicked(true));
    try {
      const userIP = await fetchUserIP();
      console.log("User IP at first", userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      const confirmPaymentPayload = {
        call_type: "p2p_manual_payment_confirm",
        ip: userIP,
        lang: lang,
        pay_id: payId,
      };

      const respo = await APIService.manualPayment(confirmPaymentPayload);
      if (respo.data.status === "success") {
        dispatch(setConfirmPaymentDetails(respo.data));
        console.log("API RESPONSE FROM CONFIRM PAYMEMT=>>> ", respo.data);
        // onPaidToggle();

        // console.log("Check", isPaidClicked);
      }
      onClose();
    } catch (error) {
      console.error("Error Confirming:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          width: { xs: "90%", sm: "80%", md: "60vh" },
          maxWidth: "100%",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <DialogTitle sx={{ p: 0, mb: { xs: 1, sm: 2 } }}>
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
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box>
            <Typography
              variant="body1"
              fontSize={{ xs: 12, sm: "24px" }}
              fontWeight={800}
              textAlign={"center"}
            >
              Confirm You have Made payment{" "}
            </Typography>
          </Box>

          <Box mt={2} mb={2} bgcolor={"#FEF3F2"} px={3} py={2}>
            <Typography
              variant="body2"
              fontSize={{ xs: 12, sm: "15px" }}
              fontWeight={700}
              color="#F04438"
            >
              Be sure you have paid. You can be banned for clicking “i have
              paid” when you have not paid.{" "}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column">
            <Button
              variant="contained"
              onClick={handleConfirm}
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
              Yes, I have paid
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
