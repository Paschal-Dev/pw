import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import AwaitingVendorConfirmation from "./awaiting_vendor_confirmation";
import ManualPaymentExpired from "./manual_payment_expired";
import ManualPaymentSuccessful from "./manual_payment_successful";
import { setConfirmPaymentDetails } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";
import { RootState } from "../../redux/store";

interface ManualPaymentStatusProps {
  onChatToggle: (isChatOpen: boolean) => void;
  onPaidToggle: () => void;
}

export default function ManualPaymentStatus({
  onChatToggle,
}: ManualPaymentStatusProps): React.JSX.Element {
  const { payId, confirmPaymentDetails } = useSelector((state: RootState) => state.pay);
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

  // Memoize the payment status check function
  const checkPaymentStatus = useCallback(
    async (userIP: string) => {
      if (!payId) {
        console.warn("No payId provided, skipping payment status check.");
        return;
      }

      try {
        const confirmPaymentPayload = {
          call_type: "p2p_manual_payment_confirm",
          ip: userIP,
          pay_id: payId,
        };

        const respo = await APIService.manualPayment(confirmPaymentPayload);
        if (respo.data.status === "success") {
          dispatch(setConfirmPaymentDetails(respo.data));
          console.log("API RESPONSE FROM CONFIRM PAYMEMT=>>> ", respo.data);

          // console.log("Check", isPaidClicked);
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    },
    [payId, dispatch]
  );

  // Effect to check payment status every 5 seconds
  useEffect(() => {
    if (
      confirmPaymentDetails?.payment_status === 1 ||
      confirmPaymentDetails?.payment_status === 4
    ) {
      return; // Stop polling for terminal statuses
    }

    let userIP: string | null = null;

    const initializeIP = async () => {
      userIP = await fetchUserIP();
      if (userIP) {
        await checkPaymentStatus(userIP); // Run immediately after IP fetch
      }
    };

    initializeIP();

    const interval = setInterval(() => {
      if (userIP) {
        checkPaymentStatus(userIP);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [checkPaymentStatus, confirmPaymentDetails?.payment_status, fetchUserIP]);

  return (
    <>
      {confirmPaymentDetails?.payment_status === 1 ? (
        <ManualPaymentSuccessful onChatToggle={onChatToggle} />
      ) : confirmPaymentDetails?.payment_status === 4 ? (
        <ManualPaymentExpired />
      ) : (
        <AwaitingVendorConfirmation onChatToggle={onChatToggle} />
      )}
    </>
  );
}
