import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1048,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
  palette: {
    primary: {
      main: "#009FDD",
      light: "#F5FBFE",
      dark: "#28304E",
    },
    secondary: {
      main: "#FEC84B",
      light: "#FDDE80",
    },
    background: {
      default: "#FBFBFB",
    },
    success: {
      main: "#12B76A",
      light: "#D1FADF",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
          textTransform: "capitalize",
          // ":hover": {
          //   background: "none",
          // },
          // color: "#fff",
          // borderColor: "#fff",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});
