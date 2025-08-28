 import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function Dark() {
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 dark:text-white" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
