import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function Disclaimer(): React.JSX.Element {
  const [isloading, setIsLoading] = React.useState(true);
  const { paymentDetails } = useSelector((state: RootState) => state.pay);

  const { t } = useTranslation();

  React.useEffect(() => {
    if (paymentDetails) {
      setIsLoading(false);
    }
  }, [paymentDetails]);

  return (
    <>
      {!isloading && (
        <Box
          bgcolor={theme.palette.secondary.light}
          p={1.5}
          borderRadius={2}
          mt={1}
        >
          <Typography
            variant="h5"
            color={"#DC6803"}
            fontSize={12}
            fontWeight={600}
          >
            {t("disclaimer")}
          </Typography>
          <Typography variant="body2" fontSize={"0.75rem"}>
            {t("disclaimer-text")}
            <Link
              href="#"
              color={"#000"}
              fontWeight={600}
              sx={{ textDecoration: "none" }}
            >
              {t("pwat-token")}
            </Link>
          </Typography>
          <Typography variant="body2" fontSize={"0.75rem"}>
            {t("this-order")}
          </Typography>
        </Box>
      )}
    </>
  );
}
