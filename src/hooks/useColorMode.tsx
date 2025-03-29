"use client"

import { useEffect, useState } from "react";

const useColorMode = () => {
  const [colorMode, setColorMode] = useState(() => {
    // Get theme from localStorage or default to 'dark'
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", colorMode === "dark");
    localStorage.setItem("theme", colorMode);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
