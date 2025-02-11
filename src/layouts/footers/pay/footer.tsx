import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { theme } from "../../../assets/themes/theme";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export default function Footer(): React.JSX.Element {
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
        <Box pt={1} justifySelf={"flex-start"}>
          <Typography variant="body2" fontSize={12} textAlign="center">
            {t("terms-condition")}
            <Link href="https://peerwallet.com/terms" color={theme.palette.primary.main} fontWeight={600}>
              {t("terms")}
            </Link>
          </Typography>
        </Box>
      )}
    </>
  );
}
