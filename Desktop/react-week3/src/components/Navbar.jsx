import React from "react";

function Navbar({ links = [], toggleTheme, darkMode }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">MyApp</h1>
      <ul className="flex gap-4">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.href} className="hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        onClick={toggleTheme}
        className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded dark:bg-gray-700 dark:text-white"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
}

export default Navbar;
