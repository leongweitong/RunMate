import React, {useState, useEffect} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsAlarm, BsSpeedometer, BsGeoAltFill } from 'react-icons/bs';
import { FaShoePrints } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {formatTime} from '../utils/formatTime'
import * as turf from "@turf/turf";
import smooth from 'to-smooth';

const ActivityDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getByID } = useIndexedDB("activity");
  const [activity, setActivity] = useState(null)
  const navigate = useNavigate()
  const [centerPosition, setCenterPosition] = useState(null)

  useEffect(() => {
    getByID(Number(id)).then((activity) => {
      setActivity(activity);
      const res = turf.center(turf.points(activity.path))
      setCenterPosition(res.geometry.coordinates)
    });
  }, []);

  if (!activity) return <div className='text-center'>Loading...</div>;

  const totalMinutes = (activity.time / 1000) / 60;
  const totalHours = ((activity.time / 1000) / 60) / 60;
  const pace = totalMinutes / activity.totalDistance;
  const speed = activity.totalDistance / totalHours;
  const smoothedPath = smooth(activity.path);
  
  return (
    <>
      <MapContainer 
        center={centerPosition} 
        zoom={17} 
        zoomControl={false} 
        scrollWheelZoom={false} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline pathOptions={{ color: 'red' }} positions={smoothedPath} />
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
              <div className="flex justify-between gap-2">
                  <div className='flex flex-col items-center justify-center gap-2 text-sm'>
                    <FaShoePrints />
                    <div>{pace.toFixed(2)} min/km</div>
                    <div>{t("general.pace")}</div>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2 text-sm'>
                    <BsGeoAltFill />
                    <div>{activity.totalDistance} km</div>
                    <div>{t("general.kilometers")}</div>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2 text-sm'>
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