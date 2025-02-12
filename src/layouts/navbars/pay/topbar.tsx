import React from "react";
import {
  Box,
  Toolbar,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Container } from "@mui/system";
import Logo from "../../../assets/images/logo-white.png";
import { theme } from "../../../assets/themes/theme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import english from "../../../assets/images/english-flag.png";
import french from "../../../assets/images/flag-france.png";
import italian from "../../../assets/images/flag-italy.png";
import spanish from "../../../assets/images/spanish_flag.png";
import portuguese from "../../../assets/images/flag-portuguese.png";
import slovak from "../../../assets/images/flag_slovak.png";
import indonesian from "../../../assets/images/flag_indonesian.jpeg";
import russian from "../../../assets/images/flag_russian.png";
import hindi from "../../../assets/images/flag_hindi.png";
import japanese from "../../../assets/images/flag_japanese.png";
import german from "../../../assets/images/flag_german.png";
import chinese from "../../../assets/images/flag_chinese.png";
import korean from "../../../assets/images/flag_korean.png";
import arabic from "../../../assets/images/flag_arabic.png";
import bengali from "../../../assets/images/flag_bengali.jpeg";
// import { setCurrentPage } from "../../../redux/reducers/pay";
import { useDispatch } from "react-redux";
// import { RootState } from "../../../redux/store";
import { setCurrentPage } from "../../../redux/reducers/pay";
// import { RootState } from "../../../redux/store";
// import APIService from "../../../services/api-service";
// import { PageProps } from "../../../utils/myUtils";
export default function Topbar(): React.JSX.Element {
  const [deviceType, setDeviceType] = React.useState("mobile");
  const mobile = useMediaQuery(theme.breakpoints.only("xs"));
  const tablet = useMediaQuery(theme.breakpoints.down("md"));
  const [language, setLanguage] = React.useState(
    localStorage.getItem("language") ?? "en"
  );
  const dispatch = useDispatch();
  // const dispatch = useDispatch();
  // const { payId } = useSelector((state: RootState) => state.pay);

  //  function ClickableImage({ payId }) {
  const handleClick = async () => {
    // dispatch(setButtonClicked(false));
    dispatch(setCurrentPage("pay"));
  };

  const { i18n } = useTranslation();
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    i18n.changeLanguage(event.target.value);
    localStorage.setItem("language", event.target.value);
  };
  React.useEffect(() => {
    if (mobile) {
      setDeviceType("mobile");
    } else if (tablet) {
      setDeviceType("tablet");
    } else {
      setDeviceType("pc");
    }
  }, [mobile, tablet]);
  return (
    <>
      <Box
        bgcolor={theme.palette.primary.main}
        py={1}
        sx={{ position: deviceType === "mobile" ? "fixed" : "" }}
        width={"100%"}
        zIndex={100}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src={Logo} onClick={handleClick} style={{ cursor: 'pointer' }} />
          <FormControl
            variant="standard"
            size="small"
            sx={{
              minWidth: 80,
              color: "#fff",
            }}
          >
            <Select
              labelId="language-select"
              id="language-select"
              value={language}
              label="Language"
              onChange={handleChange}
              sx={{ color: "#fff", "& .MuiSelect-root": { color: "#fff" } }}
              defaultValue="English"
            >
              <MenuItem value={"en"}>
                <img
                  src={english}
                  alt="EN"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                English
              </MenuItem>
              <MenuItem value={"fr"}>
                <img
                  src={french}
                  alt="FR"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                French
              </MenuItem>
              <MenuItem value={"es"}>
                <img
                  src={spanish}
                  alt="SP"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Spanish
              </MenuItem>
              <MenuItem value={"it"}>
                <img
                  src={italian}
                  alt="IT"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Italian
              </MenuItem>
              <MenuItem value={"pt"}>
                <img
                  src={portuguese}
                  alt="PT"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Portuguese
              </MenuItem>
              <MenuItem value={"de"}>
                <img
                  src={german}
                  alt="DE"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                German
              </MenuItem>
              <MenuItem value={"hi"}>
                <img
                  src={hindi}
                  alt="HI"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Hindi
              </MenuItem>
              <MenuItem value={"ru"}>
                <img
                  src={russian}
                  alt="RU"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Russian
              </MenuItem>
              <MenuItem value={"id"}>
                <img
                  src={indonesian}
                  alt="ID"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Indonesian
              </MenuItem>
              <MenuItem value={"jp"}>
                <img
                  src={japanese}
                  alt="JP"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Japanese
              </MenuItem>
              <MenuItem value={"sk"}>
                <img
                  src={slovak}
                  alt="SK"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Slovak
              </MenuItem>
              <MenuItem value={"kr"}>
                <img
                  src={korean}
                  alt="KR"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Korean
              </MenuItem>
              <MenuItem value={"ch"}>
                <img
                  src={chinese}
                  alt="CH"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Chinese
              </MenuItem>
              <MenuItem value={"be"}>
                <img
                  src={bengali}
                  alt="BE"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Bengali
              </MenuItem>
              <MenuItem value={"ar"}>
                <img
                  src={arabic}
                  alt="AR"
                  style={{ width: 20, marginRight: 10 }}
                />{" "}
                Arabic
              </MenuItem>
            </Select>
          </FormControl>
        </Container>
      </Box>
      {deviceType === "mobile" && <Toolbar />}
    </>
  );
}