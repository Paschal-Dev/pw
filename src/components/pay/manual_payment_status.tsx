import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AwaitingVendorConfirmation from "./awaiting_vendor_confirmation";
import ManualPaymentExpired from "./manual_payment_expired";
import ManualPaymentSuccessful from "./manual_payment_successful";
import { setConfirmPaymentDetails } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";
import { RootState } from "../../redux/store";
import PaymentInDispute from "./manual-payment-in-dispute";

interface ManualPaymentStatusProps {
  onChatToggle: (isChatOpen: boolean) => void;
  // onPaidToggle: () => void;
}

export default function ManualPaymentStatus({
  onChatToggle,
}: ManualPaymentStatusProps): React.JSX.Element {
  const { payId, confirmPaymentDetails, lang } = useSelector(
    (state: RootState) => state.pay
  );
  const dispatch = useDispatch();

  // Memoize fetchUserIP
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
          dispatch(setConfirmPaymentDetails(respo.data));
          console.log("API RESPONSE FROM CONFIRM PAYMEMT CONTINUOUS CHECK=>>> ", respo.data);

      } catch (error) {
        console.error("Error Confirm Payment:", error);
      }
    }, 10000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [dispatch, fetchUserIP, lang, payId]);


  return (
    <>
      {confirmPaymentDetails?.confirm_manual_payment === 1 ? (
        <ManualPaymentSuccessful onChatToggle={onChatToggle} />
      ) : confirmPaymentDetails?.confirm_manual_payment === 4 ? (
        <ManualPaymentExpired />
      ) : confirmPaymentDetails?.confirm_manual_payment === 5 ? (
        <PaymentInDispute onChatToggle={onChatToggle} />
      ) : confirmPaymentDetails?.confirm_manual_payment === 2 ? (
        <AwaitingVendorConfirmation onChatToggle={onChatToggle} />
      ) : <AwaitingVendorConfirmation onChatToggle={onChatToggle} />}
    </>
  );
}
