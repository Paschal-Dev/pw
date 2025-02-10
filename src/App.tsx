/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React from "react";
import "./App.css";
import Pay from "./pages/pay";
import { useTranslation } from "react-i18next";


function App(): React.JSX.Element {
  // const dispatch = useDispatch();
  
  const { i18n } = useTranslation();

  React.useEffect(() => {
    const savedLang = localStorage.getItem('language');
    i18n.changeLanguage(savedLang ?? "en")
  }, [i18n])

  return <Pay />;
}

export default App;
