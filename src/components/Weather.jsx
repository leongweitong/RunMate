import React, {useState, useEffect} from 'react'
import { BsDropletFill, BsWind, BsEyeFill, BsGeoAltFill } from 'react-icons/bs'
import { SyncLoader } from 'react-spinners'
import { useTranslation } from "react-i18next";

const Weather = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false)
    const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
    const [weatherData, setWeatherData] = useState(null);
    const API_WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY
    const API_WEATHER_URL = import.meta.env.VITE_WEATHER_API_URL
    const LOCAL_STORAGE_TIME = parseInt(import.meta.env.VITE_LOCAL_STORAGE_TIME, 10)
    const [showWeather, setShowWeather] = useState(true)
    const _ = undefined;
    const cachedWeather = localStorage.getItem('weather') ? JSON.parse(localStorage.getItem('weather')) : null

    useEffect(() => {
        const getWeatherData = async (latitude, longitude) => {
            try {
                setLoading(true);
                const res = await fetch(`${API_WEATHER_URL}?lat=${latitude}&lon=${longitude}&appid=${API_WEATHER_KEY}`);
                const data = await res.json();
                setWeatherData(data);
                const weatherCache = {
                    data,
                    timestamp: new Date().getTime(),
                };
                localStorage.setItem('weather', JSON.stringify(weatherCache));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchWeatherData = (latitude, longitude) => {
            if (cachedWeather) {
                const currentTime = new Date().getTime()

                if (currentTime - cachedWeather.timestamp < LOCAL_STORAGE_TIME) {
                    console.log(cachedWeather.data)
                    setWeatherData(cachedWeather.data);
                    return;
                }
            }
            getWeatherData(latitude, longitude)
        }

        const showAlert = (title = 'Error', message = 'Something Wrong.') => {
            if(window.cordova) {
                navigator.notification.alert(
                    message,
                    () => {},
                    title,
                    'OK'
                )
                return 
            }
            console.error(title, message)
        }

        const fetchGeolocation = (useHighAccuracy = false) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(position => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                }, (err) => {
                    setShowWeather(false)
                    // showAlert(_, 'cannot get current position.')
                }, {
                    enableHighAccuracy: useHighAccuracy,
                    timeout: 5000,
                });
            } else {
                setShowWeather(false)
                // showAlert(_, 'Geolocation is not available.')
            }
        }

        const requestLocationPermission = () => {
            if (window.cordova) {
                const permissions = cordova.plugins.permissions
                const permissionFineLocation = permissions.ACCESS_FINE_LOCATION
                const permissionCoarseLocation = permissions.ACCESS_COARSE_LOCATION

                const success = (status) => {
                    // Check both permissions individually
                    permissions.checkPermission(permissionFineLocation, (fineStatus) => {
                        if (fineStatus.hasPermission) fetchGeolocation(true)
                        else {
                            permissions.checkPermission(permissionCoarseLocation, (coarseStatus) => {
                                if (coarseStatus.hasPermission) fetchGeolocation(false)
                                else showAlert('Location Permission', 'To use the full functionality of the RunMate, please manually turn on the location permission')
                            })
                        }
                    })
                }  

                permissions.requestPermissions([permissionFineLocation, permissionCoarseLocation], success, showAlert)
            } 
            else fetchGeolocation()
        }

        const checkWeatherData = () => {
            if(cachedWeather) {
                const currentTime = new Date().getTime()
                if (currentTime - cachedWeather.timestamp < LOCAL_STORAGE_TIME) {
                    setWeatherData(cachedWeather.data)
                    return
                }
            }
            requestLocationPermission()
        }

        checkWeatherData()
    }, [])

    if(!showWeather) return 

    return (
        <div className="px-4">
            {loading && <div className='bg-white p-4 rounded-lg shadow relative'>
                <div className='absolute inset-0 flex items-center justify-center bg-opacity-75'>
                    <SyncLoader color={color} loading={loading} size={8} aria-label="Loading Spinner"/>
                </div>
            </div>}
            {!loading && weatherData && (
                <>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <div className="flex items-center justify-center">
                        <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt='' className="flex-1 h-24" />
                        <div className="flex-1 text-md">
                            <div className='font-bold opacity-50 text-xs'>{weatherData.name}</div>
                            <div className='flex text-primary font-bold'>
                                <div className='text-2xl'>{(weatherData.main.temp - 273.15).toFixed(0)}°</div>
                                <div className='text-lg leading-none self-end'>/{(weatherData.main.feels_like - 273.55).toFixed(0)}°</div>
                            </div>
                            <div className='font-bold opacity-50 capitalize text-xs'>{t(`weather.${(weatherData.weather[0].main).toLowerCase()}`)}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-content text-xs">
                        <div className='flex flex-1 flex-col items-center'>
                            <BsDropletFill className="text-primary mb-1" />
                            <div className='font-bold opacity-80'>{weatherData.main.humidity}%</div>
                            <div className='opacity-70'>{t("weather.humidity")}</div>
                        </div>
                        <div className='flex flex-1 flex-col items-center'>
                            <BsWind className="text-primary font-bold mb-1" />
                            <div className='font-bold opacity-80'>{weatherData.wind.speed}m/s</div>
                            <div className='opacity-70'>{t("weather.wind")}</div>
                        </div>
                        <div className='flex flex-1 flex-col items-center'>
                            <BsEyeFill className="text-primary mb-1" />
                            <div className='font-bold opacity-80'>{(weatherData.visibility / 1000).toFixed(0)}km</div>
                            <div className='opacity-70'>{t("weather.visibility")}</div>
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    )
}

export default Weather