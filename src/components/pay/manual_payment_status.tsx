import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AwaitingVendorConfirmation from "./awaiting_vendor_confirmation";
import ManualPaymentExpired from "./manual_payment_expired";
import ManualPaymentSuccessful from "./manual_payment_successful";
import {
  clearChatDetails,
  clearConfirmPaymentDetails,
  setClickedId,
  setConfirmButtonBackdrop,
  setConfirmPaymentDetails,
  setCurrentPage,
  // setP2PEscrowDetails,
  setP2PVendorsDetails,
} from "../../redux/reducers/pay";
import APIService from "../../services/api-service";
import { RootState } from "../../redux/store";
import PaymentInDispute from "./manual-payment-in-dispute";
import { Typography } from "@mui/material";

interface ManualPaymentStatusProps {
  onChatToggle: (isChatOpen: boolean) => void;
}

export default function ManualPaymentStatus({
  onChatToggle,
}: ManualPaymentStatusProps): React.JSX.Element {
  const { payId, confirmPaymentDetails, lang } = useSelector((state: RootState) => state.pay);
  const dispatch = useDispatch();

  const fetchUserIP = useCallback(async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const userIP = await fetchUserIP();
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

      try {
        const respo = await APIService.manualPayment(confirmPaymentPayload);
        console.log("Confirm Payment Response:", respo.data);
        dispatch(setConfirmPaymentDetails(respo.data));
        if (respo.data?.pay?.payment_status === 1) {
          clearInterval(intervalId);
          // dispatch(setConfirmPaymentDetails(respo.data));
          // dispatch(setP2PEscrowDetails(respo.data));

          const url = `https://pay.peerwallet.com/?v=${respo.data.data.unique_id}`;

          const RedirectUrl = respo.data.data.redirect_url;

          if (respo.data?.data.redirect_url === url) {
            dispatch(setCurrentPage("p2p-payment"));
          } else {
            console.log("Payment Successful, rendering success page", RedirectUrl);
            window.location.assign(RedirectUrl);
          }
        } else if (respo.data?.confirm_manual_payment === 3) {
          const p2pPayload = {
            call_type: "p2p_vendors",
            ip: userIP,
            pay_id: payId,
          };
          const respo2 = await APIService.p2pVendors(p2pPayload);
          console.log("API RESPONSE FROM P2P VENDORS FETCH =>>> ", respo2.data);
          dispatch(setP2PVendorsDetails(respo2.data));
          // clearInterval(intervalId);
          dispatch(setCurrentPage("p2p"));
          dispatch(setConfirmButtonBackdrop(false));
          dispatch(clearConfirmPaymentDetails());
          dispatch(setClickedId(null));
          dispatch(clearChatDetails());
          return;
        }
      } catch (error) {
        console.error("Error Confirm Payment:", error);
      }
    }, 10000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fetchUserIP, lang, payId]);

  return (
    <>
      {confirmPaymentDetails?.confirm_manual_payment === 1 ? (
        <ManualPaymentSuccessful onChatToggle={onChatToggle} />
      ) : confirmPaymentDetails?.confirm_manual_payment === 4 ? (
        <ManualPaymentExpired />
      ) : confirmPaymentDetails?.confirm_manual_payment === 5 ? (
        <PaymentInDispute onChatToggle={onChatToggle} />
      ) : confirmPaymentDetails?.confirm_manual_payment === 3 ? (
        <Typography variant="h4" fontWeight={600}>
          Redirecting to Vendor's Page
        </Typography>
      ) : (
        <AwaitingVendorConfirmation onChatToggle={onChatToggle} />
      )}
    </>
  );
}
