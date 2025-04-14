/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from '../utils/axios';
import encryptPayload from '../utils/encrypt-payload';

export default class APIService {
  // static getToken = (payload: unknown) =>
  //   axiosInstanceWithoutKey.post('/get-token-key.php', encryptPayload(payload));
  // static encodeKey = (payload: any) =>
  //   axiosInstanceWithoutKey.post('/encode-key.php', encryptPayload(payload));
  static sendOTP = (payload: any) =>
    axiosInstance.post('/pay/', encryptPayload(payload));
  static resendOTP = (payload: any) =>
    axiosInstance.post('/pay/resend-otp.php', encryptPayload(payload));
  static verifyOTP = (payload: any) =>
    axiosInstance.post('/pay/verify-otp.php', encryptPayload(payload));
  static walletPay = (payload: any) =>
    axiosInstance.post('/pay/wallet-pay.php', encryptPayload(payload));
  static walletResendOtp = (payload: any) =>
    axiosInstance.post('/pay/wallet-resend-otp.php', encryptPayload(payload));
  static walletPayValidate = (payload: any) =>
    axiosInstance.post('/pay/wallet-pay-validate.php', encryptPayload(payload));
  static p2pVendors = (payload: any) =>
    axiosInstance.post('/pay/p2p-vendors.php', encryptPayload(payload));
  static p2pVendorsEscrow = (payload: any) =>
    axiosInstance.post('/pay/p2p-vendors-escrow.php', encryptPayload(payload));
  static p2pCancelEscrow = (payload: any) =>
    axiosInstance.post('/pay/cancel-escrow.php', encryptPayload(payload));
  static updateUser = (payload: any) =>
    axiosInstance.post('/pay/update-users-profile.php', encryptPayload(payload));
}

