import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
// import { RootState } from "../../redux/store";
// import { useTranslation } from "react-i18next";
import { useState } from "react";
import { theme } from "../../assets/themes/theme";
import { Vendor } from "../../data/pay/vendors-data";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";

interface ManualVendorModalProps {
  item: Vendor;
  open: boolean;
  onClose: () => void;
  onOkay: () => void; // New prop for handling Okay button click
}

export default function ManualVendorModal({
  open,
  onClose,
  onOkay,
  item,
}: ManualVendorModalProps) {
  // const { p2pVendorsDetails, clickedId } = useSelector((state: RootState) => state.pay);
  const [isLoading, setIsLoading] = useState(false);
  // const { t } = useTranslation();

  const handleOkayClick = () => {
    onClose();
    setIsLoading(true);
    onOkay();
    setIsLoading(false);
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
          <Box bgcolor={theme.palette.secondary.main} borderRadius={3}>
            <Typography
              variant="h6"
              fontWeight={700}
              fontSize={20}
              textTransform="capitalize"
              textAlign={"center"}
            >
              {t("blc_pw_102")}
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
              fontWeight={500}
              // sx={{ textDecoration: "underline" }}
            >
              {t("blc_pw_104")}{" "}
              <strong>{item?.payment_method || "this method"}</strong>{" "}
              {t("blc_pw_105")}{" "}
              <strong>{item?.payment_method || "this method"}</strong>{" "}
              {t("blc_pw_106")}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column">
            <Button
              variant="contained"
              disabled={isLoading}
              onClick={handleOkayClick} // Call handleOkayClick on Okay button click
              sx={{
                fontSize: "16px",
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
                t("blc_pw_103")
              )}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
