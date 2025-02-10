/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice, } from "@reduxjs/toolkit";

interface PayI {
    payId: string;
    isOTPVerified: boolean;
    paymentDetails: any;
    apiResponse: any;
    walletPaymentDetails: any;
    currentPage: string;
    walletSendPaymentDetails: any;
    p2pVendorsDetails: any;
    p2pEscrowDetails: any;
    isButtonClicked: boolean;
    isButtonBackdrop: boolean;
    isConfirmButtonBackdrop: boolean;
    shouldRedirectEscrow: boolean;
}

const initialState: PayI = {
    payId: "",
    isOTPVerified: false,
    paymentDetails: null,
    apiResponse: null,
    walletPaymentDetails: null,
    currentPage: "pay/v",
    p2pVendorsDetails: null,
    walletSendPaymentDetails: undefined,
    p2pEscrowDetails: null,
    isButtonClicked: false,
    isButtonBackdrop: false,
    isConfirmButtonBackdrop: false,
    shouldRedirectEscrow: false,
}

const paySlice = createSlice({
    name: "pay",
    initialState,
    reducers: {
        setPayId: (state, action: PayloadAction<string>) => {
            state.payId = action.payload
        },
        setPaymentDetails: (state, action: PayloadAction<any>) => {
            state.paymentDetails = action.payload
        },
        setApiResponse: (state, action: PayloadAction<any>) => {
            state.apiResponse = action.payload
        },
        setWalletPaymentDetails: (state, action: PayloadAction<any>) => {
            state.walletPaymentDetails = action.payload
        },
        setCurrentPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload
        },
        setWalletSendPaymentDetails: (state, action: PayloadAction<any>) => {
            state.walletSendPaymentDetails = action.payload
        },
        setP2PVendorsDetails: (state, action: PayloadAction<any>) => {
            state.p2pVendorsDetails = action.payload
        },
        setP2PEscrowDetails: (state, action: PayloadAction<any>) => {
            state.p2pEscrowDetails = action.payload
        },
        setOTPVerified: (state, action: PayloadAction<boolean>) => {
            state.isOTPVerified = action.payload
        },
        setButtonClicked: (state, action: PayloadAction<boolean>) => {
            state.isButtonClicked = action.payload;
        },
        setButtonBackdrop: (state, action: PayloadAction<boolean>) => {
            state.isButtonBackdrop = action.payload;
        },
        setConfirmButtonBackdrop: (state, action: PayloadAction<boolean>) => {
            state.isConfirmButtonBackdrop = action.payload;
        },
        setShouldRedirectEscrow: (state, action: PayloadAction<boolean>) => {
            state.shouldRedirectEscrow = action.payload;
        },

    }
})

export const { setPayId, setPaymentDetails, setWalletPaymentDetails, setOTPVerified, setWalletSendPaymentDetails, setP2PVendorsDetails, setP2PEscrowDetails, setButtonClicked, setButtonBackdrop, setConfirmButtonBackdrop, setShouldRedirectEscrow, setCurrentPage, setApiResponse } = paySlice.actions

export default paySlice.reducer