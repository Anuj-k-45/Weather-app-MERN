import React from 'react'

export default function InfoModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-lg w-full" onClick={e=>e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">About PM Accelerator</h2>
        <p className="mb-3 text-sm">
          Product Manager Accelerator (PMA) is a US-based company with a global reach, premiering in AI learning and as a development hub.
          Mentors hail from Google, Meta, Apple, Nvidia, and more.
        </p>
        <p className="mb-4 text-sm">
          Learn more on their LinkedIn page:{" "}
          <a href="https://www.linkedin.com/company/product-manager-accelerator/" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline">
            Product Manager Accelerator
          </a>
        </p>
        <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Close</button>
      </div>
    </div>
  )
}
