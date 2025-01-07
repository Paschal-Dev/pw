import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import Footer from "../../layouts/footers/pay/footer";
import Disclaimer from "../../layouts/sections/pay/disclaimer";
import background from "../../assets/images/bg.png";
import Topbar from "../../layouts/navbars/pay/topbar";
import ErrorPage from "./error_page";
import { useSendOTP } from "./custom_hooks";
import { useSelector } from "react-redux";
import { renderActivePage } from "./render_logic";
import { RootState } from "../../redux/store";
import { Helmet } from "react-helmet";

export default function Pay(): React.JSX.Element {
  const [errorResponse] = useState(null);
  const [errorPage] = useState(false);

  const { shouldRedirectEscrow, currentPage, paymentDetails } = useSelector(
    (state: RootState) => state.pay
  );

  useSendOTP(shouldRedirectEscrow, "yourPayId");

  return (
    <Box
      height="100vh"
      sx={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
      zIndex={-2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Helmet>
        <title>
          {paymentDetails?.data
            ? `Pay ${paymentDetails.data.currency_sign}${paymentDetails.data.amount} to ${paymentDetails.seller.name}`
            : "Payment Page"}
        </title>
      </Helmet>
      <Topbar />
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          py: 1,
        }}
      >
        {errorPage ? (
          <ErrorPage errorResponse={errorResponse} />
        ) : (
          renderActivePage(currentPage)
        )}
        <Disclaimer />
        <Footer />
      </Container>
    </Box>
  );
}
