import React, {useState, useEffect} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const ActivityDetailsPage = () => {
  const { id } = useParams();
  const { getByID } = useIndexedDB("activity");
  const [activity, setActivity] = useState(null)

  useEffect(() => {
    getByID(Number(id)).then((activity) => {
      setActivity(activity);
    });
  }, []);


  if (!activity) return <div>Loading...</div>;
  
  return (
    <>
      <MapContainer 
        center={activity.path[0]} 
        zoom={17} 
        zoomControl={false} 
        scrollWheelZoom={false} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline pathOptions={{ color: 'red' }} positions={activity.path} />
      </MapContainer>
    </>
  );
}

export default ActivityDetailsPage