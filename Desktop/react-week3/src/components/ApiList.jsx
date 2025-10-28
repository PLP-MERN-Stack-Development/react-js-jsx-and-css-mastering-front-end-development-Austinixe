import React, { useState, useEffect } from "react";
import Button from "./Button";

function ApiList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-gray-700 dark:text-gray-300">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors mt-6">
      <h2 className="text-xl font-bold mb-4">API Todos</h2>

      <input
        type="text"
        className="w-full mb-4 p-2 border rounded-md"
        placeholder="Search todos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {filteredData.slice(0, 20).map((todo) => (
          <li
            key={todo.id}
            className={`p-2 border-b border-gray-200 dark:border-gray-700 ${
              todo.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiList;
