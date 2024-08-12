import React, {useState, useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SyncLoader } from 'react-spinners'
import 'leaflet-rotatedmarker';
import RunningControls from '../components/RunningControls'

const RunningPage = () => {
    const myIcon = new L.Icon({
        iconSize: [20,20],
        iconUrl: 'arrow-marker.png',
        shadowSize: [80, 80],
        shadowUrl: 'shadowIcon.png',
        iconAnchor: [10, 10],
        shadowAnchor: [40, 40],
    })

    const [loading, setLoading] = useState(true)
    const [color, setColor] = useState('rgba(230, 56, 37, 0.95)')
    const [position, setPosition] = useState(null)
    const [heading, setHeading] = useState(0)
    const [prevPosition, setPrevPosition] = useState(null)
    const [path, setPath] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [keepTrack, setKeepTrack] = useState(false);

    useEffect(() => {
        const getMapLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })
                navigator.geolocation.watchPosition(onMapSuccess, onMapError, { enableHighAccuracy: true })
            }
        }
    
        const onMapSuccess = (pos) => {
            const { latitude, longitude } = pos.coords
            const newPosition = [latitude, longitude]
        
            setPrevPosition((prevPosition) => {
                if (prevPosition) {
                    const userDirection = getCurrentDirection(prevPosition[0], prevPosition[1], latitude, longitude)
                    setHeading(userDirection)

                    if(keepTrack) {
                        const prevLatLng = L.latLng(prevPosition[0], prevPosition[1]);
                        const currentLatLng = L.latLng(latitude, longitude);
                        const distance = prevLatLng.distanceTo(currentLatLng); // Distance in meters
    
                        setTotalDistance((prevDistance) => prevDistance + distance);
                        // console.log(totalDistance)
                    }
                }
                return newPosition
            })
            setPosition(newPosition)
            // console.log(path)
            keepTrack && setPath((prevPath) => [...prevPath, newPosition]);
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
                <PolylineUpdater pathOptions={{color: 'red'}} positions={path}/>
                <RotatingMarker position={position} icon={myIcon} rotationAngle={heading} />
                <MapUpdater position={position} />
            </MapContainer>

            <RunningControls keepTrack={keepTrack} setKeepTrack={setKeepTrack} totalDistance={totalDistance} path={path} />
        </>)
    )
}

const PolylineUpdater = ({pathOptions, positions}) => {
    return <Polyline pathOptions={pathOptions} positions={positions} />
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