import React from "react";

function Footer({ text }) {
  return (
    <footer className="bg-gray-200 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 text-center transition-colors">
      {text}
    </footer>
  );
}

export default Footer;
