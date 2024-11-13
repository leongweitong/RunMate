import React, {useState, useEffect, useRef } from 'react'
import { MapContainer, Marker, TileLayer, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SyncLoader } from 'react-spinners'
import 'leaflet-rotatedmarker';
import RunningControls from '../components/RunningControls'
import * as turf from "@turf/turf";
import { useNavigate } from 'react-router-dom';
import AlertBox from '../components/AlertBox';

const RunningPage = ({color='rgba(230, 56, 37, 0.95)', accuracyThreshold = 10, positionBufferSize = 3}) => {
    const myIcon = new L.Icon({
        iconSize: [20,20],
        iconUrl: 'arrow-marker.png',
        shadowSize: [80, 80],
        shadowUrl: 'shadowIcon.png',
        iconAnchor: [10, 10],
        shadowAnchor: [40, 40],
    })

    const [loading, setLoading] = useState(true)
    const [position, setPosition] = useState(null)
    const [heading, setHeading] = useState(0)
    const [prevPosition, setPrevPosition] = useState(null)
    const [path, setPath] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [keepTrack, setKeepTrack] = useState(false);
    const [coords, setCoords] = useState([]);
    const keepTrackRef = useRef(keepTrack);
    const [multiPath, setMultiPath] = useState([]);
    const [gpsCounter, setGpsCounter] = useState(0);
    let positionBuffer = [];
    const navigate = useNavigate();
    const [showAlertBox, setShowAlertBox] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleAlertBox = (text) => {
        setAlertMessage(text);
        setShowAlertBox(true);
    };

    useEffect(() => {
        const getMapLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    onMapSuccess(pos);
                    navigator.geolocation.watchPosition(onMapSuccess, onMapError, { enableHighAccuracy: true });
                }, onMapError, { enableHighAccuracy: true })
            }
        }
    
        const onMapSuccess = (pos) => {
            const { latitude, longitude, speed, accuracy } = pos.coords;
            const newPosition = [latitude, longitude];

            if (accuracy > accuracyThreshold && gpsCounter < 5) {
                setGpsCounter(prevCount => prevCount + 1);
                return;
            }

            setGpsCounter(0)
            positionBuffer.push(newPosition);

            if (positionBuffer.length > positionBufferSize) positionBuffer.shift();

            // 2. Average Multiple Points
            let avgPosition = newPosition;
            if (positionBuffer.length === positionBufferSize) {
                const avgLat = positionBuffer.reduce((sum, pos) => sum + pos[0], 0) / positionBuffer.length;
                const avgLon = positionBuffer.reduce((sum, pos) => sum + pos[1], 0) / positionBuffer.length;
                avgPosition = [avgLat, avgLon];
            }
        
            setPrevPosition((prevPosition) => {
                if (prevPosition) {
                    const userDirection = getCurrentDirection(prevPosition[0], prevPosition[1], avgPosition[0], avgPosition[1]);
                    setHeading(userDirection);
                    
                    let coordA = L.latLng(prevPosition[0], prevPosition[1]);
                    let coordB = L.latLng(avgPosition[0], avgPosition[1]);
                    let distance1 = coordA.distanceTo(coordB);
        
                    const from = turf.point([prevPosition[0], prevPosition[1]]);
                    const to = turf.point([avgPosition[0], avgPosition[1]]);
                    const distance2 = turf.distance(from, to) * 1000; // Distance in meters
        
                    const calculatedSpeed = distance2 / ((pos.timestamp - prevPosition.timestamp) / 1000); // m/s
                    const realisticSpeedThreshold = 10; // Example threshold, 10 m/s (36 km/h)
        
                    // Ignore location updates with unrealistic distance jumps or speed
                    if (distance2 > 50 && calculatedSpeed > realisticSpeedThreshold) { 
                        console.warn("Ignoring inaccurate location update");
                        return prevPosition;
                    }
        
                    if (keepTrackRef.current) {
                        setTotalDistance((prevDistance) => prevDistance + ((distance1 + distance2)/2));
                        console.log('keep track user data');
                    }
                }
                return { ...avgPosition, timestamp: pos.timestamp }; // Keep track of timestamp
            });
        
            setPosition(avgPosition);
            if (keepTrackRef.current) {
                setPath((prevPath) => [...prevPath, avgPosition]);
        
                const newCoords = {
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    altitudeAccuracy: pos.coords.altitudeAccuracy,
                    heading: pos.coords.heading,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    speed: pos.coords.speed,
                    timestamp: pos.timestamp
                };
        
                setCoords((coords) => [...coords, newCoords]);
            }
            setLoading(false);
        };
    
        const onMapError = (error) => {
          console.error(error)
        }

        const startBackgroundTracking = () => {
            if (window.cordova) {
                BackgroundGeolocation.configure({
                    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
                    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY, // Ensures the highest accuracy
                    stationaryRadius: 10, // Lower stationary radius for more frequent updates
                    distanceFilter: 10, // Shorter distance filter for more location updates
                    notificationTitle: 'Location tracking',
                    notificationText: 'Track your runs in the background',
                    debug: false, // Disables sound and visual notifications
                    interval: 1000, // More frequent updates (every 5 seconds)
                    fastestInterval: 500, // Minimum interval between updates
                    activitiesInterval: 1000, // More frequent activity updates
                    stopOnTerminate: false, // Continue tracking after app termination
                    startOnBoot: true, // Start tracking after device reboot

                    // ios
                    activityType: BackgroundGeolocation.ACTIVITY_TYPE_FITNESS,
                    saveBatteryOnBackground: false,
                });                

                BackgroundGeolocation.start();

                BackgroundGeolocation.on('location', (location) => {
                    onMapSuccess({ coords: location });
                });
            }
            else getMapLocation()
        };

        const stopBackgroundTracking = () => {
            if (window.cordova) {
                BackgroundGeolocation.stop();
                window.powerManagement.release(function() {
                    console.log('Wakelock released');
                }, function() {
                    console.log('Failed to release wakelock');
                });
            }
        };

        const checkNotificationPermissionAndStartTracking = () => {
            if (window.cordova) {
                const permissions = cordova.plugins.permissions;
        
                const error = () => {
                    handleAlertBox(t('quote.alert.notification-denied'));
                    navigate(-1);
                };

                permissions.checkPermission(permissions.POST_NOTIFICATIONS, (status) => {
                    if (status.hasPermission) {
                        window.powerManagement.acquire(startBackgroundTracking(), startBackgroundTracking());
                    } else {
                        permissions.requestPermission(permissions.POST_NOTIFICATIONS, (statusAfterRequest) => {
                            if (statusAfterRequest.hasPermission) {
                                startBackgroundTracking();
                            } else {
                                error();
                            }
                        }, error);
                    }
                });
            }
        };

        if(window.cordova) checkNotificationPermissionAndStartTracking();
        else getMapLocation();

        return () => {
            stopBackgroundTracking();
        };
    }, [])

    useEffect(() => {
        keepTrackRef.current = keepTrack;
    }, [keepTrack]);

    const handleChangeKeepTrack = (data) => {
        console.log("Before update - keepTrack:", keepTrack);

        if (!data && path.length > 0) {
            // Stop tracking: store the current path segment in multiPath
            setMultiPath(prevMultiPath => [...prevMultiPath, path]);
            setPath([]);  // Reset the current path to start a new segment
        }

        setKeepTrack(data);
        console.log("After update - keepTrack:", data);
    };
    

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
            <MapContainer center={position} doubleClickZoom={false} dragging={false} touchZoom={false} boxZoom={false} zoom={18} zoomControl={false} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {/* Render all polylines in multiPath */}
                {multiPath.map((segment, index) => (
                    <Polyline key={index} pathOptions={{ color: 'red' }} positions={segment} />
                ))}
                
                {/* Render the current path (in progress) */}
                {path.length > 0 && (
                    <Polyline pathOptions={{ color: 'blue' }} positions={path} />
                )}
                <RotatingMarker position={position} icon={myIcon} rotationAngle={heading} />
                <MapUpdater position={position} />
            </MapContainer>

            <RunningControls keepTrack={keepTrack} handleChangeKeepTrack={handleChangeKeepTrack} totalDistance={totalDistance} path={path} coords={coords} multiPath={multiPath} />

            {showAlertBox && (
                <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} />
            )}
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
            map.panTo(position, map.getZoom())
        }
    }, [position, map])

    return null
}

export default RunningPage