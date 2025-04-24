/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Link, Alert, AlertTitle } from "@mui/material";
import { MediaProps } from "../../utils/myUtils";
import { theme } from "../../assets/themes/theme";
import VideoThumb from "./video-thumb";
import NoticeIcon from "../../assets/images/notice_icon.svg";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@reduxjs/toolkit/query";
// import { setHeaderKey } from "../../redux/reducers/auth";
import APIService from "../../services/api-service";
import { RootState } from "../../redux/store";
import { setCurrentPage, setWalletPaymentDetails } from "../../redux/reducers/pay";
import { useTranslation } from "react-i18next";
// import OtpInputs from "./otp-inputs";

interface WalletOtpInputProps {
  value: string;
  index: number;
  focus: boolean;
  onChange: (index: number, value: string) => void;
  id: string;
  setValue: any;
}

const WalletOtpInput = React.forwardRef<HTMLInputElement, WalletOtpInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ value, onChange, index, focus, setValue }, _ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (focus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [focus]);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();

        onChange(index, "");

        if (index > 0 && document.getElementById(`otp-input-${index - 1}`)) {
          (
            document.getElementById(
              `otp-input-${index - 1}`
            ) as HTMLInputElement
          ).focus();
        }
      }
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      const numericValue = e.currentTarget.value.replace(/\D/g, "").slice(0, 1);
      onChange(index, numericValue);

      // Move to the next input on input
      if (numericValue !== "" && index < 5) {
        const nextInput = document.getElementById(
          `otp-input-${index + 1}`
        ) as HTMLInputElement | null;
        if (nextInput) {
          nextInput.focus();
        }
      }
    };

    const handlePaste = async (ev: {
      target: any;
      preventDefault: () => void;
      clipboardData: any;
    }) => {
      if (ev.target.localName !== "input") return;

      ev.preventDefault();
      const paste = await navigator.clipboard.readText();
      // const paste = (ev.clipboardData || window.Clipboard).getData("text");
      console.log("PASTE LOGGED ::: ", typeof paste);

      const inputs = document.querySelectorAll<HTMLInputElement>(".otp-input");
      if (paste.length !== inputs.length) return;

      inputs.forEach((input, index) => {
        input.focus();
        input.value = paste[index];
        console.log("INDEX ::: ", index);

        if (index === 5) {
          console.log("ENTERED LAST ELEM !!!");
          console.log("To AT+RRAY ::: ", [...paste]);
          setValue([...paste]);
        }
      });

      if (index + paste.length <= 5) {
        inputs[index + paste.length - 1].dispatchEvent(
          new Event("input", { bubbles: true })
        );
      }
    };

    return (
      <input
        type="tel"
        pattern="[0-9]*"
        maxLength={1}
        required
        autoComplete="none"
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        ref={inputRef}
        id={`otp-input-${index}`}
        className="otp-input"
        style={{
          width: "12%",
          height: 40,
          border: "1px solid #009FDD",
          borderRadius: 8,
          textAlign: "center",
          outlineColor: "#009FDD",
        }}
      />
    );
  }
);

interface OtpProps extends MediaProps {
  // onOtpVerification: (isVerified: boolean) => void;
  // apiResponse: any;
}

const WalletOtp: React.FC<OtpProps> = ({ deviceType }) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | null
  >(null);
  const [showOtp, setShowOtp] = useState(true);
  const [showVideoThumb, setShowVideoThumb] = useState(false);
  const [isSuccessAlertShown, setIsSuccessAlertShown] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const { payId: payId } = useSelector((state: RootState) => state.pay);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { walletSendPaymentDetails } = useSelector(
    (state: RootState) => state.pay
  );
  const fetchUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP:", error);
      return null;
    }
  };

  useEffect(() => {
    if (alertSeverity === "success") {
      const timeoutId = setTimeout(() => {
        setAlertSeverity(null);
        setIsSuccessAlertShown(true);
        setTimeout(() => {
          setIsSuccessAlertShown(false);
          setShowOtp(false);
          setShowVideoThumb(true);
        }, 5000);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertSeverity]);

  useEffect(() => {
    if (alertSeverity === "error") {
      const timeoutId = setTimeout(() => {
        setAlertSeverity(null);
        setIsSuccessAlertShown(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertSeverity]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;

    setOtpValues(newOtpValues);
  };


  const handleButtonClick = React.useCallback(async () => {
    // e.preventDefault();
    const enteredPin = otpValues.join("");
    const userIP = await fetchUserIP();
    console.log('User IP at first', userIP);
    if (!userIP) {
      console.error("Could not fetch IP");
      return;
    }
    const verifyWalletOtpPayload = {
      call_type: "wallet_pay_validate",
      ip: userIP,
      lang: "en",
      pay_id: payId,
      otp: enteredPin,
    }
    try {
      // const formData = new FormData();
      // formData.append("call_type", "get_key");
      // const response1 = await APIService.getToken(formData);
      // console.log(
      //   "API RESPONSE FROM VERIFY OTP GET TOKEN =>>> ",
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
      //   "API RESPONSE FROM VERIFY OTP ENCODE KEY =>>> ",
      //   response3.data
      // );
      // dispatch(setHeaderKey(response3.data?.data?.header_key));
      // localStorage.setItem("headerKey", response3.data?.data?.header_key);
      // const enteredPin = otpValues.join("");
      // const formData2 = new FormData();
      // formData2.append("call_type", "wallet_pay_validate");
      // formData2.append("ip", "192.168.0.0");
      // formData2.append("lang", "en");
      // formData2.append("pay_id", payId);
      // formData2.append("otp", enteredPin);
      const res = await APIService.walletPayValidate(verifyWalletOtpPayload);
      console.log("API RESPONSE FROM VERIFY WALLET OTP =>>> ", res.data);
      if (res.data?.pay?.payment_status === 1) {

        // OTP verification successful
        setAlertMessage(res.data?.message);
        setAlertSeverity("success");
        setOtpValues(["", "", "", "", "", ""]); // Clear OTP input values
        // onOtpVerification(true); // Execute callback for OTP verification
        setShowVideoThumb(true); // Show video thumbnail
        dispatch(setWalletPaymentDetails(res.data));

        const url = `https://pay.peerwallet.com/?v=${res.data.data.unique_id}`;

        const RedirectUrl = res.data.data.redirect_url;

        if (RedirectUrl === url) {
          dispatch(setCurrentPage("wallet-payment"));
        } else {
          console.log("Payment Successful, rendering success page", RedirectUrl);
          window.location.assign(RedirectUrl);
        }
      } else if (res.data?.pay?.payment_status === 5) {
        console.log("Status Check", res.data?.pay?.payment_status);
        console.log("Payment failed, rendering error page");
        // OTP verification successful
        setAlertMessage(res.data?.message);
        setAlertSeverity("error");
        setOtpValues(["", "", "", "", "", ""]); // Clear OTP input values
        // onOtpVerification(true); // Execute callback for OTP verification
        setShowVideoThumb(true); // Show video thumbnail
        dispatch(setWalletPaymentDetails(res.data));
        dispatch(setCurrentPage("wallet-payment"));

      } else if (res.data?.pay?.payment_status === 3) {
        console.log("Status Check", res.data?.pay?.payment_status);
        console.log("Wrong Payment");
        console.log("Status Check", res.data?.pay?.payment_status);
        console.log("Payment failed, rendering error page");

        // OTP verification successful
        setAlertMessage(res.data?.message);
        setAlertSeverity("error");
        setOtpValues(["", "", "", "", "", ""]); // Clear OTP input values
        // onOtpVerification(true); // Execute callback for OTP verification
        setShowVideoThumb(true); // Show video thumbnail
        dispatch(setWalletPaymentDetails(res.data));
        dispatch(setCurrentPage("wallet-payment"));
      } else {
        // Incorrect OTP or other error
        setAlertMessage(res.data?.message);
        setAlertSeverity("error");
        setOtpValues(["", "", "", "", "", ""]); // Clear OTP input values
        // onOtpVerification(false); // Execute callback for OTP verification
        setShowVideoThumb(false); // Hide video thumbnail
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error if API request fails
      setAlertMessage(t("blc_pw_41"));
      setAlertSeverity("error");
      setOtpValues(["", "", "", "", "", ""]);
      // onOtpVerification(false);
      setShowVideoThumb(false);
    }
  }, [dispatch, otpValues, payId, t]);


  const handleResendClick = async () => {
    setCountdown(120); // Reset countdown
    setResendDisabled(true); // Disable resend button
    try {
      const userIP = await fetchUserIP();
      console.log('User IP at first', userIP);
      if (!userIP) {
        console.error("Could not fetch IP");
        return;
      }
      // const formData = new FormData();
      // formData.append("call_type", "get_key");
      // const response1 = await APIService.getToken(formData);
      // console.log(
      //   "API RESPONSE FROM WALLET RESEND OTP GET TOKEN =>>> ",
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
      //   "API RESPONSE FROM WALLET RESEND OTP ENCODE KEY =>>> ",
      //   response3.data
      // );
      // dispatch(setHeaderKey(response3.data?.data?.header_key));
      // localStorage.setItem("headerKey", response3.data?.data?.header_key);
      // resend-otp request
      const walletResendOtpPayload = {
        call_type: "resend_wallet_otp",
        ip: userIP,
        lang: "en",
        pay_id: payId,
      };
      setTimeout(() => {
        APIService.walletResendOtp(walletResendOtpPayload)
          .then((resp) => {
            console.log("API RESPONSE FROM WALLET RESEND OTP =>>> ", resp.data);
          })
          .catch((error: unknown) => {
            console.log("ERROR ::::::: ", error);
          });
      }, 2000);
    } catch (error) {
      console.error("Error Resending OTP:", error);
    }
  };

  const isButtonDisabled: boolean = otpValues.some((value) => value === "");

  React.useEffect(() => {
    console.log("BUTTON STATUS", isButtonDisabled);
    if (!isButtonDisabled) {
      handleButtonClick();
    }
  }, [handleButtonClick, isButtonDisabled]);
  // const { t } = useTranslation();

  return (
    <>
      {alertSeverity === "success" && !isSuccessAlertShown && (
        <Alert
          severity="success"
          style={{
            position: "absolute",
            backgroundColor: "#d8f8d8",
            width: "20%",
          }}
        >
          <AlertTitle>Success</AlertTitle>
          {alertMessage}
        </Alert>
      )}

      {alertSeverity === "error" && !isSuccessAlertShown && (
        <Alert severity="error" style={{ position: "absolute", width: "20%" }}>
          <AlertTitle>Error</AlertTitle>
          {alertMessage}
        </Alert>
      )}
      {isSuccessAlertShown ? null : (
        <Box
          flex={1}
          bgcolor={theme.palette.background.default}
          borderRadius={2}
          py={1}
          px={5}
          mx={"auto"}
          display={showOtp ? "flex" : "none"} // Show OTP section based on showOtp state
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          textAlign={"center"}
          gap={1}
          width={deviceType === "tablet" ? "50%" : "auto"}
        >
          <img src={NoticeIcon} alt="" style={{ width: 45 }} />
          <Box width={"80%"}>
            <Typography
              variant="h5"
              fontWeight={700}
              color={theme.palette.secondary.main}
            >
              {t("blc_pw_32")}
            </Typography>
            <Typography variant="body2" fontSize={12}>
              {t("blc_pw_33")}
              <span
                style={{ color: theme.palette.primary.main, fontWeight: 700 }}
              >
                {" "}
                {walletSendPaymentDetails?.data?.payee_email}
              </span>{" "}
              {t("blc_pw_34")}
            </Typography>
          </Box>

          <Box
            width={"90%"}
            display={"flex"}
            justifyContent={"space-between"}
            gap={1}
          >
            {otpValues.map((value, index) => (
              <WalletOtpInput
                key={index}
                value={value}
                onChange={handleChange}
                index={index}
                focus={index === otpValues.length - 1}
                id={`otp-input-${String(index)}`}
                setValue={setOtpValues}
              />
            ))}
          </Box>

          <Button
            variant="contained"
            sx={{
              width: "90%",
              paddingY: 0.8,
              paddingX: 4,
              borderRadius: 2,
              ":hover": { background: theme.palette.primary.main },
              fontWeight: 600,
            }}
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
          >
            {t("blc_pw_35")}
          </Button>
          <Typography variant="body2" fontSize={12}>
            {t("blc_pw_36")}{" "}
            {countdown > 0 ? (
              <span style={{ color: theme.palette.primary.main }}>
                {t("blc_pw_37")} {Math.floor(countdown / 60)}:{countdown % 60}
              </span>
            ) : (
              <Link
                onClick={handleResendClick}
                fontSize={12}
                fontWeight={600}
                sx={{
                  textDecoration: "none",
                  ":hover": { background: "none" },
                }}
                style={{ cursor: resendDisabled ? "not-allowed" : "pointer" }}
              >
                {t("blc_pw_38")}
              </Link>
            )}
          </Typography>
        </Box>
      )}

      {showVideoThumb && (
        <Box>{deviceType !== "mobile" && <VideoThumb />}</Box>
      )}
    </>
  );
};

export default WalletOtp;
