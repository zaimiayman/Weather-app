import { startTransition, useEffect, useState } from 'react'

const weatherCodeMap = {
  0: { label: 'Clear sky', icon: 'Sun', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)' },
  1: { label: 'Mostly clear', icon: 'Sun', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)' },
  2: { label: 'Partly cloudy', icon: 'CloudSun', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)' },
  3: { label: 'Overcast', icon: 'Cloud', gradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)' },
  45: { label: 'Fog', icon: 'CloudFog', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)' },
  48: { label: 'Rime fog', icon: 'CloudFog', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)' },
  51: { label: 'Light drizzle', icon: 'CloudDrizzle', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)' },
  53: { label: 'Moderate drizzle', icon: 'CloudDrizzle', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)' },
  55: { label: 'Dense drizzle', icon: 'CloudDrizzle', gradient: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #3b82f6 100%)' },
  56: { label: 'Freezing drizzle', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)' },
  57: { label: 'Dense freezing drizzle', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #60a5fa 100%)' },
  61: { label: 'Light rain', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #60a5fa 100%)' },
  63: { label: 'Rain', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #3b82f6 100%)' },
  65: { label: 'Heavy rain', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #1d4ed8 100%)' },
  66: { label: 'Freezing rain', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #60a5fa 100%)' },
  67: { label: 'Heavy freezing rain', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #3b82f6 100%)' },
  71: { label: 'Light snow', icon: 'Snowflake', gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)' },
  73: { label: 'Snow', icon: 'Snowflake', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)' },
  75: { label: 'Heavy snow', icon: 'Snowflake', gradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)' },
  77: { label: 'Snow grains', icon: 'Snowflake', gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)' },
  80: { label: 'Showers', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #60a5fa 100%)' },
  81: { label: 'Strong showers', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #3b82f6 100%)' },
  82: { label: 'Violent showers', icon: 'CloudRain', gradient: 'linear-gradient(135deg, #93c5fd 0%, #60a5fa 50%, #1d4ed8 100%)' },
  85: { label: 'Snow showers', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)' },
  86: { label: 'Heavy snow showers', icon: 'CloudSnow', gradient: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%)' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #f59e0b 100%)' },
  96: { label: 'Storm with hail', icon: 'CloudLightning', gradient: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 50%, #f87171 100%)' },
  99: { label: 'Severe storm', icon: 'CloudLightning', gradient: 'linear-gradient(135deg, #fecaca 0%, #f87171 50%, #dc2626 100%)' },
}

const quickCities = ['Casablanca', 'Paris', 'Tokyo', 'New York', 'Marrakesh']
const defaultCity = 'Casablanca'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

function getStoredCity() {
  return window.localStorage.getItem('weather-last-city') ?? defaultCity
}

function getStoredRecentSearches() {
  return JSON.parse(window.localStorage.getItem('weather-recent-searches') ?? '[]')
}

function getWeatherMeta(code) {
  return weatherCodeMap[code] ?? {
    label: 'Variable weather',
    icon: 'Sparkles',
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #93c5fd 50%, #a5b4fc 100%)',
  }
}

function getTempUnitLabel(unit) {
  return unit === 'fahrenheit' ? 'degF' : 'degC'
}

function getWindUnitLabel(unit) {
  return unit === 'fahrenheit' ? 'mph' : 'km/h'
}

function formatFullDate(dateString, locale, timezone) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(dateString))
}

function formatWeekday(dateString, locale, timezone) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: timezone,
  }).format(new Date(`${dateString}T12:00:00`))
}

function formatHour(dateString, locale, timezone) {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(dateString))
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.round((seconds % 3600) / 60)
  return `${hours}h ${minutes.toString().padStart(2, '0')}`
}

function displayUnitLabel(unitLabel) {
  return unitLabel === 'degC' ? '°C' : '°F'
}

function normalizeSuggestions(results = []) {
  return results.map((place) => ({
    id: `${place.latitude}-${place.longitude}-${place.name}`,
    label: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
    name: place.name,
    admin1: place.admin1,
    country: place.country,
  }))
}

function pickHourlySnapshot(hourly) {
  if (!hourly?.time?.length) {
    return []
  }

  const nextIndexes = []
  const now = new Date()

  for (let index = 0; index < hourly.time.length; index += 1) {
    const itemDate = new Date(hourly.time[index])
    if (itemDate >= now) {
      nextIndexes.push(index)
    }
    if (nextIndexes.length === 8) {
      break
    }
  }

  return nextIndexes.map((index) => ({
    time: hourly.time[index],
    temperature: Math.round(hourly.temperature_2m[index]),
    apparentTemperature: Math.round(hourly.apparent_temperature[index]),
    precipitationProbability: Math.round(hourly.precipitation_probability[index]),
    wind: Math.round(hourly.wind_speed_10m[index]),
    code: hourly.weather_code[index],
  }))
}

function updateRecentSearches(city) {
  const previous = JSON.parse(window.localStorage.getItem('weather-recent-searches') ?? '[]')
  const next = [city, ...previous.filter((item) => item.toLowerCase() !== city.toLowerCase())].slice(0, 5)
  window.localStorage.setItem('weather-recent-searches', JSON.stringify(next))
  window.localStorage.setItem('weather-last-city', city)
  return next
}

function WeatherIcon({ icon, className = 'h-8 w-8' }) {
  const classes = `${className} shrink-0`

  switch (icon) {
    case 'Sun':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
        </svg>
      )
    case 'CloudSun':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 6.5A4.5 4.5 0 0 1 16.4 5M7 18h9.5a3.5 3.5 0 0 0 .2-7A5 5 0 0 0 7.4 9.7 4 4 0 0 0 7 18Z" />
          <path d="M12 3v1.5M5.8 5.8l1.1 1.1M4 11h1.5" />
        </svg>
      )
    case 'Cloud':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 18h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 8.6 4.5 4.5 0 0 0 7 18Z" />
        </svg>
      )
    case 'CloudFog':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 14h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 4.6 4.5 4.5 0 0 0 7 14Z" />
          <path d="M5 17.5h14M7 20h10" />
        </svg>
      )
    case 'CloudDrizzle':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 13h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 3.6 4.5 4.5 0 0 0 7 13Z" />
          <path d="M9 16.5v.5M13 16.5v.5M17 16.5v.5M10 20v.5M14 20v.5" />
        </svg>
      )
    case 'CloudRain':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 13h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 3.6 4.5 4.5 0 0 0 7 13Z" />
          <path d="M9 16l-1 3M13 16l-1 4M17 16l-1 3" />
        </svg>
      )
    case 'CloudSnow':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 13h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 3.6 4.5 4.5 0 0 0 7 13Z" />
          <path d="M10 16.5h.01M8.8 19h.01M11.2 19h.01M15 17.5h.01M13.8 20h.01M16.2 20h.01" />
        </svg>
      )
    case 'CloudLightning':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 13h10a4 4 0 0 0 .5-8A5.5 5.5 0 0 0 7.1 3.6 4.5 4.5 0 0 0 7 13Z" />
          <path d="m12 14-2 4h2l-1 4 4-6h-2l1-2Z" />
        </svg>
      )
    case 'Snowflake':
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2.5v19M5 6.5l14 11M19 6.5 5 17.5M5 12h14" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={classes} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3.5v17M3.5 12h17" />
          <circle cx="12" cy="12" r="7" />
        </svg>
      )
  }
}

function App() {
  const locale = 'fr-FR'
  const [query, setQuery] = useState(getStoredCity)
  const debouncedQuery = useDebounce(query, 300)
  const [activeCity, setActiveCity] = useState(getStoredCity)
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState(getStoredRecentSearches)
  const [unit, setUnit] = useState('celsius')

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function fetchSuggestions() {
      const trimmed = debouncedQuery.trim()

      if (trimmed.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=5&language=fr&format=json`,
          { signal }
        )

        if (!response.ok) {
          throw new Error('Erreur réseau lors de la recherche de villes.')
        }

        const data = await response.json()
        startTransition(() => {
          setSuggestions(normalizeSuggestions(data.results))
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          setSuggestions([])
        }
      }
    }

    fetchSuggestions()

    return () => {
      controller.abort()
    }
  }, [debouncedQuery])

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function loadWeather(city) {
      try {
        setStatus('loading')
        setError('')

        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`,
          { signal }
        )

        if (!geoResponse.ok) {
          throw new Error('Erreur réseau lors de la géolocalisation.')
        }

        const geoData = await geoResponse.json()
        const place = geoData.results?.[0]

        if (!place) {
          throw new Error('Aucune ville trouvée. Essaie avec un autre nom.')
        }

        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,is_day&hourly=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,daylight_duration&temperature_unit=${unit}&wind_speed_unit=${unit === 'fahrenheit' ? 'mph' : 'kmh'}&timezone=auto&forecast_days=7`,
          { signal }
        )

        if (!forecastResponse.ok) {
          throw new Error('Erreur réseau lors de la récupération des données météo.')
        }

        const forecastData = await forecastResponse.json()

        setWeather({
          place: {
            name: place.name,
            country: place.country,
            admin1: place.admin1,
            latitude: place.latitude,
            longitude: place.longitude,
          },
          forecast: forecastData,
        })
        setRecentSearches(updateRecentSearches(place.name))
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus('error')
          setError(error.message)
        }
      }
    }

    loadWeather(activeCity)

    return () => {
      controller.abort()
    }
  }, [activeCity, unit])

  const current = weather?.forecast.current
  const daily = weather?.forecast.daily
  const hourly = weather?.forecast.hourly
  const timezone = weather?.forecast.timezone ?? 'UTC'
  const currentMeta = getWeatherMeta(current?.weather_code)
  const hourlyCards = pickHourlySnapshot(hourly)
  const temperatureUnit = getTempUnitLabel(unit)
  const displayTemperatureUnit = displayUnitLabel(temperatureUnit)
  const windUnit = getWindUnitLabel(unit)
  const heroTone = current?.is_day
    ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 45%, rgba(233,213,255,0.10) 100%)'
    : 'linear-gradient(135deg, rgba(233,213,255,0.12) 0%, rgba(224,231,255,0.06) 45%, rgba(147,197,253,0.10) 100%)'

  const todayRange = daily
    ? `${Math.round(daily.temperature_2m_max[0])}${displayTemperatureUnit} / ${Math.round(daily.temperature_2m_min[0])}${displayTemperatureUnit}`
    : ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    const city = query.trim()
    if (!city) {
      return
    }

    setShowSuggestions(false)
    setActiveCity(city)
  }

  const handleCitySelection = (city) => {
    setQuery(city)
    setShowSuggestions(false)
    setActiveCity(city)
  }

  return (
    <main className="min-h-screen  from-blue-50 to-indigo-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[30px] border border-slate-200/50 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.1)] sm:p-8 bg-white/80 backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: heroTone }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.18),transparent_60%)]" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.36em] text-indigo-600/80">Weather pulse</p>
                <h1 className="mt-3 font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-4xl font-semibold leading-none text-slate-900 sm:text-6xl">
                  Meteo plus nette,
                  <br />
                  plus vivante.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Une experience plus complete avec suggestions de villes, previsions horaires, unite
                  basculable et resume clair pour la semaine.
                </p>
              </div>

              <div className="grid gap-4 ">
                <div className="inline-flex w-fit rounded-full border border-slate-200 bg-white/50 p-1 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setUnit('celsius')}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      unit === 'celsius' ? 'bg-indigo-500 text-white' : 'text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    Celsius
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('fahrenheit')}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      unit === 'fahrenheit' ? 'bg-indigo-500 text-white' : 'text-slate-700 hover:bg-white/50'
                    }`}
                  >
                    Fahrenheit
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-3">
                  <label className="text-xs uppercase tracking-[0.24em] text-slate-600" htmlFor="city-search">
                    Rechercher une ville
                  </label>

                  <div className="relative">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id="city-search"
                        type="text"
                        value={query}
                        onBlur={() => {
                          window.setTimeout(() => setShowSuggestions(false), 120)
                        }}
                        onChange={(event) => {
                          setQuery(event.target.value)
                          setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Casablanca, Paris, Tokyo..."
                        className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white/70 px-4 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-indigo-400 backdrop-blur-sm"
                      />
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="h-12 rounded-2xl bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-wait disabled:bg-indigo-300"
                      >
                        {status === 'loading' ? 'Chargement...' : 'Chercher'}
                      </button>
                    </div>

                    {showSuggestions && suggestions.length > 0 ? (
                      <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 rounded-3xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-sm">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            onMouseDown={() => handleCitySelection(suggestion.name)}
                            className="flex w-full items-start justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-slate-50"
                          >
                            <span>
                              <span className="block text-sm font-medium text-slate-900">{suggestion.name}</span>
                              <span className="mt-1 block text-xs text-slate-500">
                                {[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}
                              </span>
                            </span>
                            <span className="text-xs uppercase tracking-[0.24em] text-indigo-500">Ville</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {quickCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelection(city)}
                        className="rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-xs text-slate-700 transition hover:bg-white/80 backdrop-blur-sm"
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  {recentSearches.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="uppercase tracking-[0.22em]">Recents</span>
                      {recentSearches.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => handleCitySelection(city)}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 transition hover:bg-slate-200"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </form>
              </div>
            </div>

            {status === 'error' ? (
              <div className="rounded-3xl border border-red-200/50 bg-red-50/50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {weather ? (
              <div className="grid items-start gap-4 xl:grid-cols-[1.45fr_0.95fr]">
                <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white/60 backdrop-blur-sm">
                  <div className="p-px" style={{ backgroundImage: currentMeta.gradient }}>
                    <div className="grid gap-6 rounded-[27px] bg-white/40 p-5 sm:p-7 backdrop-blur-sm">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-xs uppercase tracking-[0.26em] text-slate-600 backdrop-blur-sm">
                            <WeatherIcon icon={currentMeta.icon} className="h-4 w-4" />
                            Current weather
                          </div>
                          <h2 className="mt-4 font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-3xl font-semibold text-slate-900 sm:text-5xl">
                            {weather.place.name}
                          </h2>
                          <p className="mt-2 text-sm text-slate-600">
                            {[weather.place.admin1, weather.place.country].filter(Boolean).join(', ')}
                          </p>
                          <p className="mt-3 text-sm text-slate-500">
                            {formatFullDate(current.time, locale, timezone)}
                          </p>
                        </div>

                        <div className="grid gap-3 ">
                          <div className=" border border-slate-200 bg-white/70 px-5 py-4 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                              <WeatherIcon icon={currentMeta.icon} className="h-12 w-12 text-slate-700" />
                              <div>
                                <div className="text-5xl font-semibold text-slate-900">
                                  {Math.round(current.temperature_2m)}
                                  {displayTemperatureUnit}
                                </div>
                                <div className="text-sm text-slate-600">{currentMeta.label}</div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ressenti</p>
                              <p className="mt-3 text-2xl font-semibold text-slate-900">
                                {Math.round(current.apparent_temperature)}
                                {displayTemperatureUnit}
                              </p>
                            </div>
                            <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pluie</p>
                              <p className="mt-3 text-2xl font-semibold text-slate-900">{Math.round(current.precipitation)} mm</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Humidite</p>
                          <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {Math.round(current.relative_humidity_2m)}%
                          </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Vent</p>
                          <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {Math.round(current.wind_speed_10m)} {windUnit}
                          </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Amplitude</p>
                          <p className="mt-3 text-3xl font-semibold text-slate-900">{todayRange}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white/50 p-4 backdrop-blur-sm">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">UV max</p>
                          <p className="mt-3 text-3xl font-semibold text-slate-900">{Math.round(daily.uv_index_max[0])}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>

                <aside className="grid gap-4">
                  <div className="rounded-[28px] border border-slate-200 bg-white/60 p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-xl font-medium text-slate-900">
                        Soleil
                      </h3>
                      <WeatherIcon icon="Sun" className="h-6 w-6 text-amber-400" />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Lever</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {formatHour(daily.sunrise[0], locale, timezone)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Coucher</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {formatHour(daily.sunset[0], locale, timezone)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Duree du jour</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{formatDuration(daily.daylight_duration[0])}</p>
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white/60 p-5 backdrop-blur-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-xl font-medium text-slate-900">
                        Fenetre du jour
                      </h3>
                      <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-500">Today</span>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <div className="rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pluie probable</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          {Math.round(daily.precipitation_probability_max[0])}%
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Fuseau</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">{timezone}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Coordonnees</p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          {weather.place.latitude.toFixed(2)}, {weather.place.longitude.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            ) : null}

            {weather ? (
              <section className="grid items-start gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white/60 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-xl font-medium text-slate-900">
                      Prochaines heures
                    </h3>
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-500">Hourly pulse</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {hourlyCards.map((hour) => {
                      const hourMeta = getWeatherMeta(hour.code)
                      const barHeight = Math.max(18, Math.min(64, hour.temperature + 14))

                      return (
                        <div
                          key={hour.time}
                          className="grid grid-cols-[72px_44px_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 backdrop-blur-sm"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">{formatHour(hour.time, locale, timezone)}</p>
                            <p className="mt-1 text-xs text-slate-500">{hour.precipitationProbability}% pluie</p>
                          </div>
                          <WeatherIcon icon={hourMeta.icon} className="h-6 w-6 text-slate-600" />
                          <div className="flex items-end gap-3">
                            <div className="h-16 w-2 rounded-full bg-slate-200/50">
                              <div
                                className="w-full rounded-full bg-linear-to-t from-indigo-400 to-blue-300"
                                style={{ height: `${barHeight}px` }}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-slate-700">{hourMeta.label}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                Ressenti {hour.apparentTemperature}
                                {displayTemperatureUnit} | Vent {hour.wind} {windUnit}
                              </p>
                            </div>
                          </div>
                          <p className="text-xl font-semibold text-slate-900">
                            {hour.temperature}
                            {displayTemperatureUnit}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white/60 p-5 sm:p-6 backdrop-blur-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-['Space_Grotesk',ui-sans-serif,system-ui,sans-serif] text-xl font-medium text-slate-900">
                      Previsions 7 jours
                    </h3>
                    <span className="shrink-0 text-xs uppercase tracking-[0.18em] text-slate-500">Daily outlook</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {daily.time.map((day, index) => {
                      const dayMeta = getWeatherMeta(daily.weather_code[index])

                      return (
                        <div
                          key={day}
                          className="grid grid-cols-[78px_auto_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200 bg-white/50 px-4 py-3 backdrop-blur-sm"
                        >
                          <p className="text-sm font-medium capitalize text-slate-700">
                            {formatWeekday(day, locale, timezone)}
                          </p>
                          <WeatherIcon icon={dayMeta.icon} className="h-5 w-5 text-slate-600" />
                          <div>
                            <p className="text-sm text-slate-700">{dayMeta.label}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              UV {Math.round(daily.uv_index_max[index])} | Pluie {Math.round(daily.precipitation_probability_max[index])}%
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-slate-900">
                            {Math.round(daily.temperature_2m_max[index])}
                            {displayTemperatureUnit} / {Math.round(daily.temperature_2m_min[index])}
                            {displayTemperatureUnit}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
