/* eslint-disable @typescript-eslint/no-explicit-any */
// ErrorPage.tsx

import { Box, Typography } from "@mui/material";
import React from "react";
import danger from "../../assets/images/danger.svg";
import { useTranslation } from "react-i18next";



interface ErrorProps {
  errorResponse: any;
}

const ErrorPage: React.FC<ErrorProps> = ({ errorResponse }) => {
  const { t } = useTranslation();
  return (
    <Box flex={1}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          borderRadius: 5,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          gap={1}
          textAlign={"center"}
        >
          <Box
            borderRadius={"50%"}
            bgcolor={"#fee4e259"}
            width={70}
            p={1.5}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box borderRadius={"50%"} bgcolor={"#FEE4E2"} width={50} p={2}>
              <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <img src={danger} alt="" width={"100%"} />
              </Box>
            </Box>
          </Box>
          <Typography
            variant="h4"
            textTransform={"uppercase"}
            color={"red"}
            fontWeight={600}
          >
            {t("blc_pw_1")}
          </Typography>
          <Typography variant="h6" fontWeight={500}>
            {errorResponse?.message}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {t("blc_pw_2")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ErrorPage;
