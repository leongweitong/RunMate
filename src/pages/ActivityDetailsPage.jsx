import React, {useState, useEffect} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsAlarm, BsSpeedometer, BsGeoAlt } from 'react-icons/bs';
import { FaShoePrints } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {formatTime} from '../utils/formatTime'

const ActivityDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getByID } = useIndexedDB("activity");
  const [activity, setActivity] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getByID(Number(id)).then((activity) => {
      setActivity(activity);
    });
  }, []);

  if (!activity) return <div>Loading...</div>;

  const totalMinutes = (activity.time / 1000) / 60;
  const totalHours = ((activity.time / 1000) / 60) / 60;
  const distanceKm = activity.totalDistance / 1000;
  const pace = totalMinutes / distanceKm;
  const speed = distanceKm / totalHours;
  
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

      <div className='fixed top-0 left-0 p-4'>
        <div onClick={()=> navigate(-1)} className='rounded-xl bg-white border border-black p-2'>
          <BsArrowLeftShort className='text-2xl' />
        </div>
      </div>

      <div className="fixed bottom-10 left-0 w-full p-4">
          <div className="bg-white border border-black p-4 rounded-xl">
                <div className='text-center mb-4 font-semibold text-2xl'>
                  <div>{formatTime(activity.time)}</div>
                </div>
              <div className="flex justify-between gap-4">
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <FaShoePrints />
                    <div>{pace.toFixed(2)} min/km</div>
                    <div>{t("general.pace")}</div>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <BsGeoAlt />
                    <div>{(activity.totalDistance / 1000).toFixed(2)} km</div>
                    <div>{t("general.kilometers")}</div>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <BsSpeedometer  />
                    <div>{speed.toFixed(2)} km/h</div>
                    <div>{t("general.speed")}</div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}

export default ActivityDetailsPage