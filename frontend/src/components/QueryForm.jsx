import React, { useState } from 'react'
import { createQuery } from '../api'

export default function QueryForm({ onCreated }) {
  const [locationInput, setLocation] = useState('')
  const [dateFrom, setFrom] = useState(new Date().toISOString().slice(0,10))
  const [dateTo, setTo] = useState(new Date(Date.now()+3*24*3600*1000).toISOString().slice(0,10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await createQuery({ locationInput, dateFrom, dateTo })
    setLoading(false)
    if (res.error) setError(res.error)
    else {
      setLocation('')
      onCreated && onCreated(res)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap gap-4 items-end">
      <div className="flex flex-col">
        <label className="text-sm font-medium">Location</label>
        <input value={locationInput} onChange={e=>setLocation(e.target.value)} placeholder="City, Landmark, Zip..." required className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Date From</label>
        <input type="date" value={dateFrom} onChange={e=>setFrom(e.target.value)} required className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium">Date To</label>
        <input type="date" value={dateTo} onChange={e=>setTo(e.target.value)} required className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Query'}</button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  )
}
