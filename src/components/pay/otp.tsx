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
import { setOTPVerified } from "../../redux/reducers/pay";
import { useTranslation } from "react-i18next";

interface OtpInputProps {
  value: string;
  index: number;
  focus: boolean;
  onChange: (index: number, value: string) => void;
  id: string;
  setValue: any;
}

const OtpInput = React.forwardRef<HTMLInputElement, OtpInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ value, onChange, index, focus }, _ref) => {
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

    const handlePaste = async (ev: React.ClipboardEvent<HTMLInputElement>) => {
      ev.preventDefault(); // Prevent default paste behavior
    
      try {
        const paste = await navigator.clipboard.readText(); // Get clipboard text
        console.log("PASTE LOGGED ::: ", paste);
    
        const inputs = document.querySelectorAll<HTMLInputElement>(".otp-input");
    
        if (paste.length > inputs.length) return; // Ensure paste length doesn't exceed inputs
    
        [...paste].forEach((char, idx) => {
          if (inputs[idx]) {
            inputs[idx].value = char;
            onChange(idx, char);
          }
        });
    
        // Move focus to the last entered input
        const lastInputIndex = Math.min(paste.length - 1, inputs.length - 1);
        inputs[lastInputIndex]?.focus();
    
        // Trigger input event to update state properly
        inputs[lastInputIndex]?.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (error) {
        console.error("Error reading clipboard: ", error);
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
        onPaste={(e) => handlePaste(e)}
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

const Otp: React.FC<OtpProps> = ({
  deviceType,
  // onOtpVerification,
}) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | "resend" | null
  >(null);
  const [showOtp, setShowOtp] = useState(true);
  const [isSuccessAlertShown, setIsSuccessAlertShown] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const {
    payId: payId,
    paymentDetails,
    isOTPVerified,
    apiResponse,
  } = useSelector((state: RootState) => state.pay);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (apiResponse?.otp_modal === 0) {
      //  else {
      setShowOtp(false);
      setIsSuccessAlertShown(false);
      // }
    } else if (apiResponse?.otp_modal === 1) {
      // Show OTP input
      setShowOtp(true);
      setIsSuccessAlertShown(false);
    }
  }, [apiResponse]);



  useEffect(() => {
    if (alertSeverity === "success") {
      const timeoutId = setTimeout(() => {
        setAlertSeverity(null);
        setIsSuccessAlertShown(true);
        setTimeout(() => {
          setIsSuccessAlertShown(false);
          setShowOtp(false);
          // setShowVideoThumb(true);
        }, 5000);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [alertSeverity]);

  useEffect(() => {
    if (alertSeverity === "resend") {
      const timeoutId = setTimeout(() => {
        setAlertSeverity(null);
        setIsSuccessAlertShown(false);
        setShowOtp(true);
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

    const verifyOtpPayload = {
      call_type: "verify_pay_otp",
      ip: "192.168.0.0",
      lang: "en",
      pay_id: payId,
      otp: enteredPin,
    };
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

      // const response2 = await APIService.encodeKey(payload);
      // console.log(
      //   "API RESPONSE FROM VERIFY OTP ENCODE KEY =>>> ",
      //   response2.data
      // );

      // dispatch(setHeaderKey(response2.data?.data?.header_key));
      // localStorage.setItem("headerKey", response2.data?.data?.header_key);

      // const enteredPin = otpValues.join("");


      // // const formData2 = new FormData();
      // // formData2.append("call_type", "verify_pay_otp");
      // // formData2.append("ip", "192.168.0.0");
      // // formData2.append("lang", "en");
      // // formData2.append("pay_id", payId);
      // // formData2.append("otp", enteredPin);

      // const verifyOtpPayload = {
      //   call_type: "verify_pay_otp",
      //   ip: "192.168.0.0",
      //   lang: "en",
      //   pay_id: payId,
      //   otp: enteredPin,
      // };

      // const formData2 = new FormData();
      // Object.entries(verifyOtpPayload).forEach(([key, value]) => {
      //   formData2.append(key, value);
      // });

      // Call the API with the FormData
      const res = await APIService.verifyOTP(verifyOtpPayload);

      // Log the FormData and API response
      console.log("Pay Load =>>> ", verifyOtpPayload); // Logs FormData in a readable format
      console.log("API RESPONSE FROM VERIFY OTP =>>> ", res.data);

      if (res.data && res.data.status === "success") {
        // OTP verification successful
        setAlertMessage(res.data?.message);
        setAlertSeverity("success");
        setOtpValues(["", "", "", "", "", ""]);
        dispatch(setOTPVerified(true));
      } else {
        setAlertMessage(res.data?.message);
        setAlertSeverity("error");
        setOtpValues(["", "", "", "", "", ""]);
        dispatch(setOTPVerified(false));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setAlertMessage(t("blc_pw_41"));
      setAlertSeverity("error");
      setOtpValues(["", "", "", "", "", ""]);
      // onOtpVerification(false);
    }
  }, [dispatch, otpValues, payId, t]);

  const handleResendClick = async () => {
    setAlertMessage(t("blc_pw_42"));
    setAlertSeverity("resend");
    setCountdown(120); // Reset countdown
    setResendDisabled(true); // Disable resend button

    try {
      // const formData = new FormData();
      // formData.append("call_type", "get_key");

      // const response1 = await APIService.getToken(formData);
      // console.log(
      //   "API RESPONSE FROM RESEND OTP GET TOKEN =>>> ",
      //   response1.data
      // );

      // const payload = {
      //   call_type: "encode_key",
      //   token: response1.data?.data?.token,
      //   key: response1.data?.data?.key,
      //   timestamp: Math.floor(Date.now() / 1000),
      // };

      // const response2 = await APIService.encodeKey(payload);
      // console.log(
      //   "API RESPONSE FROM RESEND OTP ENCODE KEY =>>> ",
      //   response2.data
      // );

      // dispatch(setHeaderKey(response2.data?.data?.header_key));
      // localStorage.setItem("headerKey", response2.data?.data?.header_key);

      // resend-otp request
      const resendOtpPayload = {
        call_type: "resend_pay_otp",
        ip: "192.168.0.0",
        lang: "en",
        pay_id: payId,
      };

      setTimeout(() => {
        APIService.resendOTP(resendOtpPayload)
          .then((resp) => {
            console.log("API RESPONSE FROM RESEND OTP =>>> ", resp.data);
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



  return (
    <>
      {alertSeverity === "success" && !isSuccessAlertShown && (
        <Alert
          severity="success"
          style={{
            position: "absolute",
            left: deviceType === "tablet" ? "26%" : 'auto',
            fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
            backgroundColor: "#d8f8d8"
          }}
        >
          <AlertTitle sx={{
            fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
          }}>Success</AlertTitle>
          {alertMessage}
        </Alert>
      )}

      {alertSeverity === "resend" && !isSuccessAlertShown && (
        <Alert
          severity="success"
          style={{
            position: "absolute",
            left: deviceType === "tablet" ? "26%" : 'auto',
            fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
            backgroundColor: "#d8f8d8"
          }}
        >
          <AlertTitle sx={{
            fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
          }}>Success</AlertTitle>
          {alertMessage}
        </Alert>
      )}

      {alertSeverity === "error" && !isSuccessAlertShown && (
        <Alert severity="error" style={{
          position: "absolute",
          left: deviceType === "tablet" ? "26%" : 'auto',
          fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
        }}>
          <AlertTitle sx={{
            fontSize: deviceType === "tablet" || deviceType === "mobile" ? "10px" : 'auto',
          }}>Error</AlertTitle>
          {alertMessage}
        </Alert>
      )}
      {isSuccessAlertShown ? null : (
        <>
          {!isOTPVerified && (
            <Box
              flex={1}
              bgcolor={deviceType === "tablet" ? "#F5F5DC" : theme.palette.background.default}
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
              width={deviceType === "tablet" ? "40%" : "auto"}
            // position={showOtp  ? "fixed" : "unset"}
            >
              <img src={NoticeIcon} alt="" style={{ width: 45 }} />
              <Box width={"80%"}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color={theme.palette.secondary.main}
                >
                  {t("otp_required")}
                </Typography>
                <Typography variant="body2" fontSize={12}>
                  {t("please-enter-otp")}
                  <span
                    style={{
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                    }}
                  >
                    {" "}
                    {paymentDetails?.data?.payee_email}
                  </span>{" "}
                  {t("to")}
                </Typography>
              </Box>

              <Box
                width={"90%"}
                display={"flex"}
                justifyContent={"space-between"}
                gap={1}
              >
                {otpValues.map((value, index) => (
                  <OtpInput
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
                <span>{t("enter-otp-to-continue")}</span>
              </Button>
              <Typography variant="body2" fontSize={12}>
                {t("code")}
                {countdown > 0 ? (
                  <span style={{ color: theme.palette.primary.main }}>
                    {t("resend")} OTP {t("in")} {Math.floor(countdown / 60)}:
                    {countdown % 60} {t("minute")}
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
                    style={{
                      cursor: resendDisabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {t("resend")}
                  </Link>
                )}
              </Typography>
            </Box>
          )}
        </>
      )}

      {isOTPVerified && (
        <Box>{deviceType !== "mobile" && deviceType !== "tablet" && <VideoThumb />}</Box>
      )}
    </>
  );
};

export default Otp;
