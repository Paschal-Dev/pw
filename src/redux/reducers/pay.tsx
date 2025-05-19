/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface PayI {
  payId: string;
  lang: any;
  isOTPVerified: boolean;
  paymentDetails: any;
  apiResponse: any;
  walletPaymentDetails: any;
  currentPage: string;
  walletSendPaymentDetails: any;
  p2pVendorsDetails: any;
  chatDetails: any;
  p2pEscrowDetails: any;
  confirmPaymentDetails: any;
  isButtonClicked: boolean;
  // isPaidClicked: boolean;
  isButtonBackdrop: boolean;
  isConfirmButtonBackdrop: boolean;
  shouldRedirectEscrow: boolean;
  errorPage: boolean;
  clickedId: any;
  readMessageIds: string[];
  isChatOpen: boolean;
}

const initialState: PayI = {
  payId: "",
  lang: null,
  isOTPVerified: false,
  paymentDetails: null,
  apiResponse: null,
  walletPaymentDetails: null,
  currentPage: "pay/v",
  p2pVendorsDetails: null,
  chatDetails: null,
  walletSendPaymentDetails: undefined,
  p2pEscrowDetails: null,
  confirmPaymentDetails: null,
  isButtonClicked: false,
  // isPaidClicked: false,
  isButtonBackdrop: false,
  isConfirmButtonBackdrop: false,
  shouldRedirectEscrow: false,
  errorPage: false,
  clickedId: null,
   readMessageIds: [],
   isChatOpen: false,
};

const paySlice = createSlice({
  name: "pay",
  initialState,
  reducers: {
    setPayId: (state, action: PayloadAction<string>) => {
      state.payId = action.payload;
    },
    setLang: (state, action: PayloadAction<any>) => {
      state.lang = action.payload;
    },
    setPaymentDetails: (state, action: PayloadAction<any>) => {
      state.paymentDetails = action.payload;
    },
    setApiResponse: (state, action: PayloadAction<any>) => {
      state.apiResponse = action.payload;
    },
    setWalletPaymentDetails: (state, action: PayloadAction<any>) => {
      state.walletPaymentDetails = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setWalletSendPaymentDetails: (state, action: PayloadAction<any>) => {
      state.walletSendPaymentDetails = action.payload;
    },
    setP2PVendorsDetails: (state, action: PayloadAction<any>) => {
      state.p2pVendorsDetails = action.payload;
    },
    setChatDetails: (state, action: PayloadAction<any>) => {
      state.chatDetails = action.payload;
    },
    setP2PEscrowDetails: (state, action: PayloadAction<any>) => {
      state.p2pEscrowDetails = action.payload;
    },
    setOTPVerified: (state, action: PayloadAction<boolean>) => {
      state.isOTPVerified = action.payload;
    },
    setButtonClicked: (state, action: PayloadAction<boolean>) => {
      state.isButtonClicked = action.payload;
    },
    // setPaidClicked: (state, action: PayloadAction<boolean>) => {
    //     state.isPaidClicked = action.payload;
    // },
    setButtonBackdrop: (state, action: PayloadAction<boolean>) => {
      state.isButtonBackdrop = action.payload;
    },
    setConfirmButtonBackdrop: (state, action: PayloadAction<boolean>) => {
      state.isConfirmButtonBackdrop = action.payload;
    },
    setShouldRedirectEscrow: (state, action: PayloadAction<boolean>) => {
      state.shouldRedirectEscrow = action.payload;
    },
    setErrorPage: (state, action: PayloadAction<boolean>) => {
      state.errorPage = action.payload;
    },
    setClickedId: (state, action: PayloadAction<any>) => {
      state.clickedId = action.payload;
    },
    setConfirmPaymentDetails: (state, action: PayloadAction<any>) => {
      state.confirmPaymentDetails = action.payload;
    },
    clearConfirmPaymentDetails(state) {
      state.confirmPaymentDetails = null; // Reset to initial state
    },
    clearChatDetails(state) {
      state.chatDetails = null; // Reset to initial state
    },
     setReadMessageIds: (state, action: PayloadAction<string[]>) => {
      state.readMessageIds = action.payload;
    },
    setIsChatOpen: (state, action: PayloadAction<boolean>) => {
      state.isChatOpen = action.payload;
    },
  },
});

export const {
//   setPaidClicked,
  setConfirmPaymentDetails,
  clearConfirmPaymentDetails,
  clearChatDetails,
  setPayId,
  setLang,
  setPaymentDetails,
  setWalletPaymentDetails,
  setOTPVerified,
  setWalletSendPaymentDetails,
  setP2PVendorsDetails,
  setP2PEscrowDetails,
  setButtonClicked,
  setButtonBackdrop,
  setConfirmButtonBackdrop,
  setShouldRedirectEscrow,
  setCurrentPage,
  setApiResponse,
  setErrorPage,
  setClickedId,
  setChatDetails,
  setReadMessageIds,
  setIsChatOpen,
} = paySlice.actions;

export default paySlice.reducer;
