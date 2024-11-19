/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice, } from "@reduxjs/toolkit";

interface PayI {
    payId: string;
    isOTPVerified: boolean;
    paymentDetails: any;
    walletPaymentDetails: any;
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
    walletPaymentDetails: null,
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
        setWalletPaymentDetails: (state, action: PayloadAction<any>) => {
            state.walletPaymentDetails = action.payload
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

export const { setPayId, setPaymentDetails, setWalletPaymentDetails, setOTPVerified, setWalletSendPaymentDetails, setP2PVendorsDetails, setP2PEscrowDetails, setButtonClicked, setButtonBackdrop, setConfirmButtonBackdrop, setShouldRedirectEscrow } = paySlice.actions

export default paySlice.reducer