// hooks/useSendOTP.ts
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setP2PEscrowDetails, setCurrentPage } from "../../redux/reducers/pay";
import APIService from "../../services/api-service";

export const useSendOTP = (shouldRedirectEscrow: boolean, payId: string) => {
  const dispatch = useDispatch();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!shouldRedirectEscrow) {
      intervalRef.current = setInterval(async () => {
        const sendOtpPayload = {
          call_type: "pay",
          ip: "192.168.0.0",
          lang: "en",
          pay_id: payId,
        };

        try {
          const resp = await APIService.sendOTP(sendOtpPayload);
          if (resp.data?.escrow_status === 1) {
            const checkoutLink = resp.data?.data?.checkout_link;
            if (checkoutLink) {
                window.location.assign(checkoutLink);
                dispatch(setP2PEscrowDetails(resp.data));
                dispatch(setCurrentPage("escrow-page"));
              
                if (intervalRef.current !== null) {
                  clearInterval(intervalRef.current);
                }
              }
              
          }
        } catch (error) {
          console.error("Error during Send OTP:", error);
        }
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [shouldRedirectEscrow, payId, dispatch]);
};
