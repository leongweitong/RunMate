import React, {useState, useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { BsPauseFill, BsStopFill, BsCaretRightFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SyncLoader } from 'react-spinners'
import 'leaflet-rotatedmarker';

const RunningPage = () => {
    const myIcon = new L.Icon({
        iconSize: [20,20],
        // iconUrl: 'marker.png',
        iconUrl: 'arrow-marker.png',
        shadowSize: [80, 80],
        shadowUrl: 'shadowIcon.png',
        iconAnchor: [10, 10],
        shadowAnchor: [40, 40],
    })

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
    const [position, setPosition] = useState(null)
    const [heading, setHeading] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [prevPosition, setPrevPosition] = useState(null)

    useEffect(() => {
        const getMapLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })
                const watchID = navigator.geolocation.watchPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })

                // Clear the geolocation watch on component unmount
                // return () => navigator.geolocation.clearWatch(watchID)
            }
        }
    
        const onMapSuccess = (pos) => {
            const { latitude, longitude } = pos.coords
            const newPosition = [latitude, longitude]
        
            setPrevPosition((prevPosition) => {
                if (prevPosition) {
                    const userDirection = getCurrentDirection(prevPosition[0], prevPosition[1], latitude, longitude)
                    setHeading(userDirection)
                }
                return newPosition
            })
            setPosition(newPosition)
            setLoading(false)
        }
    
        const onMapError = (error) => {
          console.error(error)
        }
    
        getMapLocation()
    }, [])

    function getCurrentDirection(previousLat, previousLng, currentLat, currentLng) {
        const diffLat = currentLat - previousLat
        const diffLng = currentLng - previousLng
        const anticlockwiseAngleFromEast = convertToDegrees(Math.atan2(diffLat, diffLng))
        const clockwiseAngleFromNorth = 90 - anticlockwiseAngleFromEast
        return clockwiseAngleFromNorth

        function convertToDegrees(radian) {
          return (radian * 180) / Math.PI; 
        }
    }

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
            <MapContainer center={position} doubleClickZoom={false} dragging={false} touchZoom={false} boxZoom={false} zoom={17} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {/* <Marker position={position} icon={ myIcon } rotationAngle={heading}></Marker> */}
                <RotatingMarker position={position} icon={myIcon} rotationAngle={heading} />
                <MapUpdater position={position} />
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

const RotatingMarker = ({ position, icon, rotationAngle }) => {
    const markerRef = useRef()

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setRotationAngle(rotationAngle)
        }
    }, [rotationAngle])

    return <Marker ref={markerRef} position={position} icon={icon} rotationAngle={rotationAngle} />
}

const MapUpdater = ({ position }) => {
    const map = useMap()

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom())
        }
    }, [position, map])

    return null
}

export default RunningPage