import React, { useEffect, useState } from "react";

function ThemeSwitcher() {
  const [dark, setDark] = useState(() => localStorage.theme === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      onClick={() => setDark(!dark)}
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeSwitcher;
