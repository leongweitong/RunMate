import React, {useState, useEffect} from 'react'
import { BsDropletFill, BsWind, BsEyeFill, BsGeoAltFill } from 'react-icons/bs'

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const API_WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY
    const API_WEATHER_URL = import.meta.env.VITE_WEATHER_API_URL

    useEffect(() => {
        const getWeatherData = async (latitude, longitude) => {
            const res = await fetch(`${API_WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_WEATHER_KEY}`)
            const data = await res.json()
            setWeatherData(data)
            console.log(data)
        }
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(position => {
                getWeatherData(position.coords.latitude, position.coords.longitude)
            })
        } else {
            console.log("Geolocation is not available.");
        }
    }, [])

    if (!weatherData) return null

    return (
        <div className="bg-primary p-4 rounded-b-3xl h-60 mb-20">
            <div className="flex gap-2 items-center justify-center mb-4">
                <BsGeoAltFill className='text-white text-xl' />
                <div className='text-white text-xl'>{weatherData.name}</div>
            </div>
            <div className='bg-white p-4 rounded-3xl shadow'>
                <div className="flex items-center justify-center">
                    <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt='' className="flex-1 w-32 h-32" />
                    <div className="flex-1 text-md">
                        <div className='font-bold opacity-50'>Today</div>
                        <div className='flex text-primary font-bold'>
                            <div className='text-4xl'>{(weatherData.main.temp - 273.15).toFixed(0)}°</div>
                            <div className='text-xl leading-none self-end'>/{(weatherData.main.feels_like - 273.55).toFixed(0)}°</div>
                        </div>
                        <div className='font-bold opacity-50 capitalize'>{weatherData.weather[0].main}</div>
                    </div>
                </div>
                <div className="flex gap-2 justify-content mt-2">
                    <div className='flex flex-1 flex-col items-center'>
                        <BsDropletFill className="text-primary mb-1" />
                        <div className='font-bold opacity-80'>{weatherData.main.humidity}%</div>
                        <div className='opacity-70'>Humidity</div>
                    </div>
                    <div className='flex flex-1 flex-col items-center'>
                        <BsWind className="text-primary font-bold mb-1" />
                        <div className='font-bold opacity-80'>{weatherData.wind.speed}m/s</div>
                        <div className='opacity-70'>Wind</div>
                    </div>
                    <div className='flex flex-1 flex-col items-center'>
                        <BsEyeFill className="text-primary mb-1" />
                        <div className='font-bold opacity-80'>{(weatherData.visibility / 1000).toFixed(0)}km</div>
                        <div className='opacity-70'>Visibility</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather