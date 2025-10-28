import React from "react";

function Card({ title, content, className = "" }) {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 border border-gray-200 ${className}`}
    >
      {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
      {content && <p className="text-gray-700">{content}</p>}
    </div>
  );
}

export default Card;
