import React from 'react'
import { BsDropletFill, BsWind, BsEyeFill, BsGeoAltFill } from 'react-icons/bs'

const Weather = () => {
  return (
    <div className="bg-primary p-4 rounded-b-3xl p-4 h-60 mb-20">
        <dic className="flex gap-2 items-center justify-center mb-4">
            <BsGeoAltFill className='text-white text-2xl' />
            <div className='text-white text-2xl'>Kampung Ayer Keroh</div>
        </dic>
        <div className='bg-white p-4 rounded-3xl shadow'>
            <div className="flex items-center justify-center">
                <img src="http://openweathermap.org/img/wn/04d@2x.png" alt='' className="flex-1 w-32 h-32" />
                <div className="flex-1 text-md">
                    <div className='font-bold opacity-50'>Today</div>
                    <div className='flex text-primary font-bold'>
                        <div className='text-5xl'>{(305.55 - 273.15).toFixed(0)}°</div>
                        <div className='text-2xl leading-none self-end'>/{312.55 - 273.55}°</div>
                    </div>
                    <div className='font-bold opacity-50 capitalize'>broken clouds</div>
                </div>
            </div>
            <div className="flex gap-2 justify-content mt-2">
                <div className='flex flex-1 flex-col items-center'>
                    <BsDropletFill className="text-primary mb-1" />
                    <div className='font-bold opacity-80'>75%</div>
                    <div className='opacity-70'>Humidity</div>
                </div>
                <div className='flex flex-1 flex-col items-center'>
                    <BsWind className="text-primary font-bold mb-1" />
                    <div className='font-bold opacity-80'>3.39m/s</div>
                    <div className='opacity-70'>Wind</div>
                </div>
                <div className='flex flex-1 flex-col items-center'>
                    <BsEyeFill className="text-primary mb-1" />
                    <div className='font-bold opacity-80'>10km</div>
                    <div className='opacity-70'>Visibility</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Weather