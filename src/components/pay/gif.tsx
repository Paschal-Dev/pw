import React from "react";
import { Box } from "@mui/material";
import checkoutGif from "../../assets/images/pw-checkout-gif-white.gif";
import i18n from "../../i18n";
import japanese from "../../assets/images/Japanese.gif";
import spanish from "../../assets/images/Spanish GIF.gif";
import arabic from "../../assets/images/Arabic.gif";
import russian from "../../assets/images/Russian.gif";
import indonesian from "../../assets/images/Indonesian.gif";
import french from "../../assets/images/French GIF.gif";
import italian from "../../assets/images/Italian.gif";
import german from "../../assets/images/German.gif";
import chinese from "../../assets/images/Chinese.gif";
import hindi from "../../assets/images/Hindi.gif";
import bengali from "../../assets/images/Bengali.gif";
import portugese from "../../assets/images/portuguese.gif";
import slovak from "../../assets/images/Slovak.gif";
import korean from "../../assets/images/Korean.gif";





export default function Gif(): React.JSX.Element {
  
  const languageGif: Record<string, string> = {
    en: checkoutGif, // Default image for English
    ja: japanese,
    ar: arabic,
    ru: russian,
    es: spanish,
    id: indonesian,
    fr: french,
    be: bengali,
    it: italian,
    zh: chinese,
    de: german,
    hi: hindi,
    pt: portugese,
    sk: slovak,
    kr: korean
   
  };

  const currentLanguage = i18n.language;
  const selectedGif = languageGif[currentLanguage] || checkoutGif;

  return (
    <Box position={"relative"}>
      <img
       src={selectedGif}
       alt={currentLanguage}
        width={"100%"}
        style={{
          boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.1)",
          borderRadius: 10,
        }}
      />
    </Box>
  );
}
