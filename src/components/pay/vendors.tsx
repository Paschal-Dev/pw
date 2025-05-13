import React, { useState } from "react";
import { Box, Typography, useMediaQuery, Alert, AlertTitle, Modal } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import APIService from "../../services/api-service";
import { Vendor } from "../../data/pay/vendors-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setButtonClicked, setClickedId, setCurrentPage, setP2PEscrowDetails } from "../../redux/reducers/pay";
import { t } from "i18next";
import close from "../../assets/images/close-icon.svg";
import RequiredFields from "../required_fields";

interface Props {
  item: Vendor;
}

const Vendors: React.FC<Props> = ({ item }) => {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"error" | null>(null);
  const dispatch = useDispatch();
  const { payId } = useSelector((state: RootState) => state.pay);
  const { clickedId, lang } = useSelector((state: RootState) => state.pay);
  const [open, setOpen] = useState(false);
  const isDisabled = clickedId !== null && clickedId !== item.id;
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

  const handleClose = () => {
    setOpen(false);
    dispatch(setButtonClicked(false)); // Reset backdrop when modal closes
    dispatch(setClickedId(null));
  };

  React.useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);

  const handleOpen = async () => {
    dispatch(setButtonClicked(true)); // Show backdrop
    dispatch(setClickedId(item.id));
    try {
      const userIP = await fetchUserIP();
      if (!userIP) {
        console.error("Could not fetch IP");
        dispatch(setButtonClicked(false)); // Hide backdrop on error
        dispatch(setClickedId(null));
        return;
      }

      const p2pEscrowPayload = {
        call_type: "p2p_vendors_escrow",
        ip: userIP,
        pay_id: payId,
        vendor_id: item.id,
        lang: lang,
      };
      const respo = await APIService.p2pVendorsEscrow(p2pEscrowPayload);
      dispatch(setP2PEscrowDetails(respo.data));

      const errorMessage = respo.data?.message?.toLowerCase()?.includes("Daily");
      const limitMessage = respo.data?.message;
      if (errorMessage) {
        setAlertMessage(limitMessage);
        setAlertSeverity("error");
        console.log("API ERROR RESPONSE FROM P2P VENDORS ESCROW =>>> ", limitMessage);
      } else if (respo.data?.input?.toLowerCase()?.includes("required")) {
        setOpen(true);
        console.log("API ERROR RESPONSE FROM P2P VENDORS ESCROW =>>> ", respo.data);
      } else {
        dispatch(setCurrentPage("escrow-page"));
        console.log("API RESPONSE FROM P2P VENDORS ESCROW =>>> ", respo.data);
      }
    } catch (error) {
      console.error("Error Getting Escrow:", error);
    } finally {
      if (!open) {
        dispatch(setButtonClicked(false)); // Hide backdrop unless modal is open
        dispatch(setClickedId(null)); 
      }
    }
  };

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 5,
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
        <Box
        onClick={isDisabled ? undefined : handleOpen}
        display="flex"
        flexDirection="column"
        borderRadius={2}
        bgcolor="#FFF"
        width={deviceType === "mobile" ? 140 : "auto"}
        border={1}
        borderColor="#B2E2F5"
        title={`Load your wallet with ${item.payment_method}`}
        sx={{
          opacity: isDisabled ? 0.5 : 1,
          pointerEvents: isDisabled ? "none" : "auto",
          ":hover": isDisabled
            ? {}
            : {
                border: "1.5px solid #B2E2F5",
                boxShadow: "0px 8px 15px 0px rgba(0,0,0,0.25)",
                cursor: "pointer",
              },
        }}
      >
        <img
          src={item.logo}
          alt={item.payment_method}
          style={{ borderRadius: 8 }}
          width={deviceType === "mobile" ? 120 : 190}
        />
        <Box borderRadius={8} p={0.5} display="flex" flexDirection="column">
          <Box
            bgcolor={theme.palette.primary.light}
            borderRadius={1}
            px={deviceType === "mobile" ? 1 : 0.5}
          >
            <Typography
              color="black"
              variant="caption"
              fontSize={deviceType === "mobile" ? 8 : "auto"}
              fontWeight="bold"
            >
              {item.payment_method}
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              borderTop={1}
              justifyContent="space-between"
              py={0.3}
            >
              <Typography
                color="#757575"
                flex={1}
                variant="body2"
                fontSize={deviceType === "mobile" ? 6 : "1.2vh"}
                fontWeight={600}
                style={{ flex: 1 }}
              >
                {item.use_name}
              </Typography>
              <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
                {item.exchange_rate !== 0 && (
                  <Typography
                    color="#6CE9A6"
                    variant="body2"
                    fontSize={deviceType === "mobile" ? 6 : 8}
                    fontWeight={800}
                    bgcolor="#D1FADF"
                    borderRadius={1}
                    textAlign="center"
                    py={0.2}
                    px={0.5}
                  >
                    {item.exchange_rate}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  fontSize={deviceType === "mobile" ? 6 : 8}
                  fontWeight={600}
                  px={1}
                  py={0.3}
                  color="#FFF"
                  bgcolor={theme.palette.primary.main}
                  borderRadius={1}
                >
                  {item.currency}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Box></Box>
            <Box onClick={handleClose} sx={{ cursor: "pointer" }}>
              <img src={close} alt="" width={50} />
            </Box>
          </Box>
          <Typography variant="h5" fontSize="20px" fontWeight={600}>
            Input The Following Details:
          </Typography>
          <RequiredFields item={item} />
        </Box>
      </Modal>
      {alertSeverity === "error" && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            width: deviceType !== "mobile" ? "60%" : "20%",
          }}
        >
          <AlertTitle>{t("blc_pw_44")}</AlertTitle>
          {alertMessage}
        </Alert>
      )}
    </>
  );
};

export default Vendors;