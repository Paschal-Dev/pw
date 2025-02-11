import React, { useState } from "react";
import { Box, Typography, Backdrop, useMediaQuery } from "@mui/material";
import { theme } from "../../assets/themes/theme";
import APIService from "../../services/api-service";
import { Vendor } from "../../data/pay/vendors-data";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
// import { setHeaderKey } from "../../redux/reducers/auth";
import { setCurrentPage, setP2PEscrowDetails } from "../../redux/reducers/pay";
import loader from "../../assets/images/loader.gif";

// import { PageProps } from "../../utils/myUtils";

interface Props {
  item: Vendor;
}

const Vendors: React.FC<Props> = ({ item, }) => {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const { payId: payId } = useSelector((state: RootState) => state.pay);
  const [isClicked, setIsClicked] = useState(false);

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
    if (isClicked) return;
    setIsClicked(true);
    try {
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
        ip: "192.168.0.0",
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
      dispatch(setCurrentPage("escrow-page"));

      console.log("API RESPONSE FROM P2P VENDORS ESCROW =>>> ", respo.data);

    } catch (error) {
      console.error("Error Getting Escrow:", error);
    }



    console.log(item.id);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        display="flex"
        flexDirection="column"
        borderRadius={2}
        bgcolor="#FFF"
        width="auto"
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
          width={190}
        />
        <Box borderRadius={8} p={0.5} display="flex" flexDirection="column">
          <Box
            bgcolor={theme.palette.primary.light}
            borderRadius={1}
            px={deviceType === "mobile" ? 1 : 0.5}
          >
            <Typography color="black" variant="caption" fontWeight="bold">
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
                fontSize={deviceType === "mobile" ? 12 : "1.2vh"}
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
                    fontSize={deviceType === "mobile" ? 12 : 8}
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
                  fontSize={deviceType === "mobile" ? 12 : 8}
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
      {isClicked && (
        <Backdrop open={isClicked}>
          <img src={loader} alt="Loader" />
        </Backdrop>
      )}
    </>
  );
};

export default Vendors;
