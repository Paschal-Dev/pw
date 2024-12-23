export default function Pay(): React.JSX.Element {
    // const [currentPage, setCurrentPage] = useState("pay");
    // const [apiResponse, setApiResponse] = useState(null);
    const [errorResponse, setErrorResponse] = useState(null);
    const [errorPage, setErrorPage] = useState(false);
    const { paymentDetails, shouldRedirectEscrow, currentPage } = useSelector((state: RootState) => state.pay);
  
  
    // const currency_sign = paymentDetails?.data?.currency_sign;
  
    const dispatch = useDispatch();
    const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  
    let count: number = 0;
  
    useEffect(() => {
      count = count + 1;
      const currentPath = window.location.pathname;
  
      if (count === 1) {
        console.log("CURR PATH ::: ", currentPath);
  
        const url = new URL(window.location.href);
        if (!url.searchParams.has("v")) {
          url.searchParams.append("v", "");
        }
  
        const newUrl = ${url};
  
        const payId = ${url.searchParams.get('v')};
  
        if (newUrl.split("=")[1].length === 0) {
          if (currentPath.includes("v")) {
            console.log("CKJSK :: ", newUrl);
          }
  
          history.pushState({}, "", url.href);
  
          console.log("PP :: ", currentPath);
  
          // dispatch(setPayId(payId));
          console.log("The Pay ID", payId);
          setErrorPage(true);
      
        } 
        else {
          console.log("TRY HERE ::");
          console.log("FSsf :: ", url.search);
  
  
          dispatch(setPayId(payId));
  
          console.log("Pay ID", payId);
  
          // send-otp request
          const sendOtpPayload = {
            call_type: "pay",
            ip: "192.168.0.0",
            lang: "en",
            pay_id: payId,
          };
  
          // let intervalId: ReturnType<typeof setInterval>;
  
          if (!shouldRedirectEscrow) {
            intervalRef.current = setInterval(async () => {
              try {
                const resp = await APIService.sendOTP(sendOtpPayload);
                console.log("API RESPONSE FROM SEND OTP", resp.data);
  
                if (resp.data?.escrow_status === 1) {
                  // dispatch(setButtonClicked(true));
  
                  // dispatch(setP2PEscrowDetails(resp.data));
                  const checkoutLink = resp.data.data.checkout_link;
                  console.log("Redirecting to:", checkoutLink);
  
                  if (localStorage.getItem("checkout_link")) {
                    // localStorage.setItem("redirected", "true");
                    window.location.assign(checkoutLink);
                    // clearInterval(intervalId);
                  } else {
                    console.log("No checkout link found.");
                  }
    
                  dispatch(setButtonClicked(true));
                  dispatch(setP2PEscrowDetails(resp.data));
                  dispatch(setCurrentPage("escrow-page"));
    
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  return;
                } else {
                  console.log("Escrow Is Not Active");
  
                  if (resp.data?.message?.toLowerCase()?.includes("verified")) {
                    dispatch(setOTPVerified(true));
                  }
                  if (resp.data?.error_code === 400) {
                    setErrorPage(true);
                    setErrorResponse(resp.data);
                  } else {
                    // Otherwise, set the API response data and dispatch payment details
                    setApiResponse(resp.data);
                    dispatch(setPaymentDetails(resp.data));
                  }
                  if (resp.data?.otp_modal === 0 || !resp.data?.otp_modal) {
                    dispatch(setOTPVerified(true));
                    // setInterval(async () => {
                    const body = {
                      call_type: "pay",
                      ip: "192.168.0.0",
                      lang: "en",
                      pay_id: payId,
                    };
                    APIService.sendOTP(body)
                      .then((resp) => {
                        console.log("PAYMENT STATUS RESPONSE :: :: ", resp.data);
  
                        if (resp.data?.pay?.payment_status === 0 || resp.data?.data?.payment_status === 1 || resp.data?.data?.payment_status === 2 || resp.data?.data?.payment_status === 3 || resp.data?.data?.payment_status === 5) {
                          dispatch(setWalletPaymentDetails(resp.data));
                          setCurrentPage("wallet-payment");
                        }
  
  
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    // }, 2000);
                  } else {
                    dispatch(setOTPVerified(false));
                  }
                }
  
  
                // Check if error_code is 400
  
                // new checks
  
              } catch (error) {
                console.log("ERROR :::: ", error);
              }
            }, 3000);
  
          }
        }
      }
    }, []);
  
    const renderActivePage = () => {
      // if(apiResponse){
      switch (currentPage) {
        case "pay/v":
          return (
            <PayDashboard
            />
          );
        case "p2p":
          return (
            <PayP2P />
          );
        case "p2p-payment":
          return (
            <P2PPayment />
          );
        case "escrow-page":
          return (
            <EscrowPage />
          );
        case "wallet-confirm":
          return (
            <WalletConfirm />
          );
        case "wallet-payment":
          return <WalletPayment />;
        default:
          return (
            <PayDashboard
            />
          );
      }
      // }
    };
  
    return (
      <Box
        height={"100vh"}
        sx={{
          backgroundImage: "url(" + background + ")",
          backgroundSize: "cover",
        }}
        zIndex={-2}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <Helmet>
          <title>
            {paymentDetails?.data
              ? Pay ${paymentDetails.data.currency_sign}${paymentDetails.data.amount} to ${paymentDetails.seller.name}
              : "Payment Page"}
          </title>
          <meta
            property="og:description"
            content={
              paymentDetails?.data
                ? Pay ${paymentDetails.data.currency_sign}${paymentDetails.data.amount} to ${paymentDetails.seller.name}
                : "Payment Page"
            }
          />
          <meta
            property="og:image"
            content={paymentDetails?.seller?.image || ""}
          />
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
            renderActivePage()
          )}
          <Disclaimer />
          <Footer />
        </Container>
      </Box>
    );
  }