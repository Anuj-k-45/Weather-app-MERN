import React from 'react'

function Icon({ code, alt }) {
  if (!code) return null;
  const src = `https://openweathermap.org/img/wn/${code}@2x.png`;
  return <img src={src} alt={alt || 'icon'} className="w-12 h-12" />;
}

export default function WeatherCard({ data }) {
  if (!data) return null;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">{data.location?.name || 'Location'}</h3>
      <div className="flex items-center gap-4">
        <Icon code={data.current?.icon} alt={data.current?.weather} />
        <div>
          <div className="text-2xl font-bold">{Math.round(data.current?.tempC)}°C</div>
          <div className="text-gray-600 dark:text-gray-300">{data.current?.weather}</div>
          <div className="text-xs text-gray-500">at {new Date(data.current?.at).toLocaleString()}</div>
        </div>
      </div>
      <h4 className="mt-6 font-semibold">Next 5 days (3-hour steps)</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-3">
        {(data.forecast || []).slice(0, 16).map((f, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xs">{new Date(f.at).toLocaleString()}</div>
            <Icon code={f.icon} alt={f.weather} />
            <div className="font-semibold">{Math.round(f.tempC)}°C</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">{f.weather}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
