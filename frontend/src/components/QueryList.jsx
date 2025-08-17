import React, { useEffect, useState } from "react";
import { listQueries, updateQuery, deleteQuery } from "../api";

export default function QueryList({ refreshKey }) {
  // ✅ accept prop
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  async function refresh() {
    const data = await listQueries();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    refresh();
  }, [refreshKey]); // ✅ run whenever refreshKey changes

  async function onUpdate(id) {
    const newTo = prompt("Set new end date (YYYY-MM-DD):");
    if (!newTo) return;
    const res = await updateQuery(id, { dateTo: newTo });
    if (res.error) setError(res.error);
    else refresh();
  }

  async function onDelete(id) {
    if (!confirm("Delete this record?")) return;
    const res = await deleteQuery(id);
    if (res.error) setError(res.error);
    else refresh();
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Saved Queries</h3>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-4">
        {items.map((i) => (
          <div
            key={i._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md"
          >
            <div className="font-medium">
              {i.normalizedLocation?.name || i.locationInput}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {new Date(i.dateFrom).toLocaleDateString()} →{" "}
              {new Date(i.dateTo).toLocaleDateString()} •{" "}
              {i.snapshots?.length || 0} points
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdate(i._id)}
                className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => onDelete(i._id)}
                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
