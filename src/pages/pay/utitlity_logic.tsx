// utils/paymentUtils.ts
import { Dispatch } from "redux";
import {
  setOTPVerified,
  setPaymentDetails,
//   setWalletPaymentDetails,
//   setCurrentPage,
} from "../../redux/reducers/pay";

export const handleNonEscrowResponse = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  dispatch: Dispatch
): void => {
  if (data?.message?.toLowerCase()?.includes("verified")) {
    dispatch(setOTPVerified(true));
  }

  if (data?.error_code === 400) {
    throw new Error(data.message);
  } else {
    dispatch(setPaymentDetails(data));
    if (data?.otp_modal === 0 || !data?.otp_modal) {
      dispatch(setOTPVerified(true));
    } else {
      dispatch(setOTPVerified(false));
    }
  }
};
