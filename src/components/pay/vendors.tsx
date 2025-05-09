import React, { useState } from "react";
import { Box, Typography, Backdrop, useMediaQuery, Alert, AlertTitle, Modal } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import APIService from "../../services/api-service";
import { Vendor } from "../../data/pay/vendors-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { setHeaderKey } from "../../redux/reducers/auth";
import {setCurrentPage, setP2PEscrowDetails } from "../../redux/reducers/pay";
import loader from "../../assets/images/loader.gif";
import { t } from "i18next";
import close from "../../assets/images/close-icon.svg";
import RequiredFields from "../required_fields";
// import { PageProps } from "../../utils/myUtils";

interface Props {
  item: Vendor;
}

const Vendors: React.FC<Props> = ({ item, }) => {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<"error" | null>(null);
  const [isSuccessAlertShown] = useState(false);
  const dispatch = useDispatch();
  const { payId: payId } = useSelector((state: RootState) => state.pay);
  const { clickedId } = useSelector((state: RootState) => state.pay);
  const [isClicked, setIsClicked] = useState(false);
  const [open, setOpen] = useState(false);
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
  const handleClose = () =>{
   setOpen(false);
   setIsClicked(false);
  } 

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
    if (isClicked)
    setIsClicked(true);
    try {
      const userIP = await fetchUserIP();
      console.log('User IP at first', userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      // const formData = new FormData();
      // formData.append("call_type", "get_key");
      // const response1 = await APIService.getToken(formData);
      // console.log(
        //   "API RESPONSE FROM P2P VENDORS ESCROW GET TOKEN =>>> ",
        //   response1.data
        // );
        
        // const payload = {
          //   call_type: "encode_key",
          //   token: response1.data?.data?.token,
          //   key: response1.data?.data?.key,
          //   timestamp: Math.floor(Date.now() / 1000),
          // };
          
          // const response3 = await APIService.encodeKey(payload);
          // console.log(
      //   "API RESPONSE FROM P2P VENDORS ESCROW ENCODE KEY =>>> ",
      //   response3.data
      // );
      // dispatch(setHeaderKey(response3.data?.data?.header_key));
      // localStorage.setItem("headerKey", response3.data?.data?.header_key);
      const p2pEscrowPayload = {
        call_type: "p2p_vendors_escrow",
        ip: userIP,
        pay_id: payId,
        vendor_id: item.id,
      };
      const respo = await APIService.p2pVendorsEscrow(p2pEscrowPayload);
      dispatch(setP2PEscrowDetails(respo.data));
      // const checkoutLink = item.checkout_link;
      // setTimeout(() => {

      // localStorage.setItem('checkout_link', checkoutLink);
      // localStorage.setItem("redirectHandled", "true");


      // window.location.href = checkoutLink; // Redirect after 5 seconds
      // }, 5000);
      const errorMessage = respo.data?.message?.toLowerCase()?.includes("Daily");
      const limitMessage = respo.data?.message;
      if (errorMessage) {
        setAlertMessage(limitMessage);
        setAlertSeverity("error");
        // setIsButtonClicked(false);

        console.log(
          "API ERROR RESPONSE FROM P2P VENDORS ESCROW =>>> ",
          limitMessage
        );
      }
       else if(respo.data?.input?.toLowerCase()?.includes("required")){
        setOpen(true);
        console.log("API ERROR RESPONSE FROM P2P VENDORS ESCROW =>>> ", respo.data);
      }
      else {
        dispatch(setCurrentPage("escrow-page"));
        console.log("API RESPONSE FROM P2P VENDORS ESCROW =>>> ", respo.data);
      }

    } catch (error) {
      console.error("Error Getting Escrow:", error);
    }



    console.log(clickedId);
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
        onClick={handleOpen}
        display="flex"
        flexDirection="column"
        borderRadius={2}
        bgcolor="#FFF"
        width={deviceType === "mobile" ? 140 : 'auto'}
        border={1}
        borderColor="#B2E2F5"
        title={`Load your wallet with ${item.payment_method}`}
        sx={{
          opacity: isClicked ? 0.5 : 1,
          pointerEvents: isClicked ? 'none' : 'auto',
          ":hover": isClicked ? {} : {
            border: "1.5px solid #B2E2F5",
            boxShadow: "0px 8px 15px 0px rgba(0,0,0,0.25)",
            cursor: 'pointer',
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
            <Typography color="black" variant="caption" fontSize={deviceType === "mobile" ? 8 : "auto"} fontWeight="bold">
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
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
          >
            <Box></Box>
            <Box onClick={handleClose} sx={{cursor: 'pointer'}}>
              <img src={close} alt="" width={50} />
            </Box>
          </Box>
          <Typography variant="h5" fontSize={'20px'} fontWeight={600}>Input The Following Details :</Typography>  
          <RequiredFields item={item}/>
        </Box>
      </Modal>
      {isClicked && (
        <Backdrop open={isClicked}>
          <img src={loader} alt="Loader" />
        </Backdrop>
      )}
      {alertSeverity === "error" && !isSuccessAlertShown && (
        <Alert
          severity="error"
          sx={{
            position: "absolute",
            width: deviceType !== "mobile" ? "60%" : "20%"
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
