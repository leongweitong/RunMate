import React, {useState, useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SyncLoader } from 'react-spinners'

const RunningPage = () => {
    const myIcon = new L.Icon({
        iconSize: [35,35],
        iconUrl: 'marker.png',
        iconAnchor: [17.5, 17.5],
    })

    const navigate = useNavigate()
    const mapRef = useRef()
    const [loading, setLoading] = useState(true)
    const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
    const [position, setPosition] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const getMapLocation = () => {
            if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })
            navigator.geolocation.watchPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })
            }
        }
    
        const onMapSuccess = (pos) => {
          const { latitude, longitude } = pos.coords
          setPosition([latitude, longitude])
          setLoading(false)
        }
    
        const onMapError = (error) => {
          console.error(error)
        }
    
        getMapLocation()
    }, [position])

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    }

    const endRunning = () => {
        navigate('/')
        return
    }

    if(loading) {
        return (<div className='full-screen-loader'>
            <SyncLoader color={color} loading={loading} size={12} aria-label="Loading Spinner"/>
        </div>)
    }

    return (
        position && (<>
            <MapContainer ref={mapRef} center={position} doubleClickZoom={false} dragging={false} zoom={18} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <Marker position={position} icon={ myIcon }></Marker>
            </MapContainer>

            <div className="fixed bottom-10 left-0 w-full p-4 text-white z-10">
                <div className="bg-black p-4 flex justify-between items-center rounded-xl">
                    <div>
                        <div>
                            Duration: <span className='font-bold'>00:00:00</span>
                        </div>
                        <div>Kilometers: <span className='font-bold'>0.0 KM</span></div>
                    </div>
                    <div className="flex gap-6">
                        <div className='rounded-full bg-white p-2' onClick={togglePlayPause}>
                            {isPlaying ? (
                            <BsPauseFill className='text-4xl text-primary' />
                            ) : (
                            <BsCaretRightFill className='text-4xl text-primary' />
                            )}
                        </div>
                        <div className='rounded-full bg-white p-2' onClick={endRunning}>
                            <BsStopFill className='text-4xl text-primary' />
                        </div>
                    </div>
                </div>
            </div>
        </>)
    )
}

export default RunningPage