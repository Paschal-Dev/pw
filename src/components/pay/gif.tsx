import React from "react";
import { Box } from "@mui/material";
import checkoutGif from "../../assets/images/pw-checkout-gif-white.gif";
import i18n from "../../i18n";
import japanese from "../../assets/images/japanese.gif";
import spanish from "../../assets/images/spanish-gif.gif";
import arabic from "../../assets/images/arabic.gif";
import russian from "../../assets/images/russian.gif";
import indonesian from "../../assets/images/indonesian.gif";
import french from "../../assets/images/french.gif";
import italian from "../../assets/images/italian.gif";
import german from "../../assets/images/german.gif";
import chinese from "../../assets/images/chinese.gif";
import hindi from "../../assets/images/hindi.gif";
import bengali from "../../assets/images/bengali.gif";
import portugese from "../../assets/images/portuguese.gif";
import slovak from "../../assets/images/slovak.gif";
import korean from "../../assets/images/korean.gif";





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
