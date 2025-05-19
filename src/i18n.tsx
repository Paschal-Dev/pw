import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import enLocale from "./locale/en/translation.json";
import frLocale from "./locale/fr/translation.json";
import esLocale from "./locale/es/translation.json";
import itLocale from "./locale/it/translation.json";
import ptLocale from "./locale/pt/translation.json";
import deLocale from "./locale/de/translation.json";
import hiLocale from "./locale/hi/translation.json";
import idLocale from "./locale/id/translation.json";
import jaLocale from "./locale/ja/translation.json";
import ruLocale from "./locale/ru/translation.json";
import skLocale from "./locale/sk/translation.json";
import arLocale from "./locale/ar/translation.json";
import beLocale from "./locale/be/translation.json";
import zhLocale from "./locale/zh/translatiojn.json";
import krLocale from "./locale/kr/translation.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector/cjs";
i18n
  .use(Backend)
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    lng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: enLocale,
      fr: frLocale,
      es: esLocale,
      it: itLocale,
      pt: ptLocale,
      de: deLocale,
      hi: hiLocale,
      id: idLocale,
      ja: jaLocale,
      ru: ruLocale,
      sk: skLocale,
      ar: arLocale,
      be: beLocale,
      zh: zhLocale,
      kr: krLocale
    },
  });
export default i18n;