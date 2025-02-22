"use client";

import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    if (typeof document !== "undefined") {
      const className = "dark";
      const bodyClass = document.documentElement.classList;

      colorMode === "dark"
        ? bodyClass.add(className)
        : bodyClass.remove(className);
    }
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;