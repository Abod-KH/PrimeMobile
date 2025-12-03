"use client";
import React, { useEffect } from "react";

declare global {
  interface Window {
    google: { translate: { TranslateElement: { new (config: object, elementId: string): any; InlineLayout: { SIMPLE: any; }; }; }; };
    googleTranslateElementInit: () => void;
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      if (window.google) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "ar,en",
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Add custom styles for the Google Translate widget
    const style = document.createElement('style');
    style.textContent = `
      .goog-te-gadget {
        color: white !important;
      }
      .goog-te-gadget-simple {
        background-color: transparent !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        padding: 5px 10px !important;
        border-radius: 4px !important;
        color: white !important;
      }
      .goog-te-gadget-simple img {
        display: none !important;
      }
      .goog-te-gadget-simple > span > a > span {
        color: white !important;
        font-size: 14px !important;
      }
      .goog-te-banner-frame {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      id="google_translate_element"
      className="translate-widget"
    ></div>
  );
};

export default GoogleTranslate;
