"use client";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  // DialogTitle,
  FormControlLabel,
  Typography,
  // useMediaQuery,
  // useTheme,
} from "@mui/material";
import { Icon } from "@iconify/react";
import APIService from "../../services/api-service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";

// import { useState, useEffect } from "react";
import {
  setConfirmPaymentDetails,
  // setPaidClicked,
} from "../../redux/reducers/pay";
import { useState } from "react";
import { theme } from "../../assets/themes/theme";

interface EscrowConfirmPaymentProps {
  open: boolean;
  onClose: () => void;
  onPaid: () => void;
}

export default function EscrowConfirmPaymentModal({
  open,
  onClose,
  onPaid,
}: EscrowConfirmPaymentProps) {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  // Simplify device type detection
  // const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "pc";
  const { payId, lang, p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const userIP = await fetchUserIP();
      console.log("User IP at first", userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        setIsLoading(false);
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
      onPaid();
      setIsLoading(false);
    } catch (error) {
      console.error("Error Confirming:", error);
      setIsLoading(false);
    }
  };

  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          width: { xs: "90%", sm: "80%", md: "70vh" },
          maxWidth: "100%",
          bgcolor: "background.paper",
        },
      }}
    >
      <Box p={{ xs: 2, sm: 3, md: 4 }}>
        <DialogContent sx={{ p: 0 }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              fontSize={25}
              textTransform="capitalize"
              textAlign={"center"}
            >
              {t("blc_pw_51")}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            alignItems={"center"}
            bgcolor={"#fefef2"}
            gap={2}
            my={2}
            px={3}
            py={2}
            borderRadius={2}
          >
            <Icon
              icon="material-symbols:info-rounded"
              color={theme.palette.secondary.main}
              fontSize={58}
            />
            <Typography
              variant="body2"
              fontSize={{ xs: 12, sm: "15px" }}
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              Please make sure you have read the payment instructions below and you have made the
              payment.
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            bgcolor={"#fff"}
            boxShadow={"5px 5px 10px 0px rgba(23, 136, 196, 0.1)"}
            gap={1}
            my={2}
            px={3}
            py={2}
            border={`1px solid ${theme.palette.primary.main}`}
            borderRadius={2}
          >
            <Typography
              textAlign={"center"}
              variant="h6"
              fontWeight={700}
              sx={{ textDecoration: "underline" }}
              // color={theme.palette.primary.main}
            >
              Payment Instructions
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              // color={theme.palette.primary.main}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: p2pEscrowDetails?.vendor?.description,
                }}
              />
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            bgcolor={"#FEF3F2"}
            gap={2}
            my={2}
            px={3}
            py={2}
            borderRadius={2}
          >
            <Icon icon="tabler:alert-triangle-filled" color="#DD0004" fontSize={58} />
            <Typography
              variant="body2"
              fontSize={{ xs: 12, sm: "15px" }}
              fontWeight={700}
              color="#F04438"
            >
              {t("blc_pw_52")}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={isPaymentConfirmed}
                onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2" fontSize="14px">
                {t("blc_pw_87")}
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <Box display="flex" flexDirection="column">
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={!isPaymentConfirmed || isLoading}
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
              {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : t("blc_pw_53")}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
