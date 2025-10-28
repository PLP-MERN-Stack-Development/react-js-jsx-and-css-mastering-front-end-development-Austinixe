import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TaskManager from "./components/TaskManager";
import Footer from "./components/Footer";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Tasks", href: "#" },
    { label: "About", href: "#" },
  ];

  // Toggle the 'dark' class on <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors text-gray-900 dark:text-gray-100">
      <Navbar links={navLinks} toggleTheme={toggleTheme} darkMode={darkMode} />

      <main className="flex flex-col items-center justify-center flex-grow p-6">
        <div className="mt-6 w-full max-w-md">
          <TaskManager />
        </div>
      </main>

      <Footer text="© 2025 MyApp. All rights reserved." />
    </div>
  );
}

export default App;
