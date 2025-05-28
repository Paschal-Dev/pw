import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { theme } from "../../assets/themes/theme";
import { useSelector } from "react-redux";

interface ManualVendorModalProps {
  open: boolean;
  onClose: () => void;
  onOkay: () => void; // New prop for handling Okay button click
}

export default function ManualVendorModal({
  open,
  onClose,
  onOkay,
}: ManualVendorModalProps) {
  const { p2pEscrowDetails } = useSelector((state: RootState) => state.pay);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleOkayClick = () => {
    onClose();
    setIsLoading(true);
    onOkay();
    setIsLoading(false);
  };

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
              {t("blc_pw_98")}
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
            >
              {t("blc_pw_99")}
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: p2pEscrowDetails?.vendor?.description || "",
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
            <Icon
              icon="tabler:alert-triangle-filled"
              color="#DD0004"
              fontSize={58}
            />
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
              disabled={!isPaymentConfirmed || isLoading}
              onClick={handleOkayClick} // Call handleOkayClick on Okay button click
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
              {isLoading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Okay"
              )}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}