import React, {useState, useEffect} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsAlarm, BsSpeedometer, BsGeoAltFill } from 'react-icons/bs';
import { FaShoePrints } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {formatTime} from '../utils/formatTime'
import * as turf from "@turf/turf";

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

  if (!activity) return <div className='text-center'>Loading...</div>;

  const totalMinutes = (activity.time / 1000) / 60;
  const totalHours = ((activity.time / 1000) / 60) / 60;
  const pace = totalMinutes / activity.totalDistance;
  const speed = activity.totalDistance / totalHours;

  const KalmanFilter = window.kalmanFilter.KalmanFilter;

  const kFilter = new KalmanFilter({
    observation: {
      sensorDimension: 2,
      sensorCovariance: 1000000, // Lowered for more reliance on GPS data, but adjust as needed
      name: 'sensor'
    },
    dynamic: {
      init: {
        mean: activity.path[0].concat([0, 0]).map(a => [a]),
        covariance: [[10, 0, 0, 0], [0, 10, 0, 0], [0, 0, 10, 0], [0, 0, 0, 10]], // Adjusted for more initial uncertainty
      },
      name: 'constant-speed',
      covariance: [0.1, 0.1, 0.1, 0.1] // Adjusted for smoother tracking
    }
  });

  const filteredResults = kFilter.filterAll(activity.path);
  const latLngArray = filteredResults.map(result => [result[0], result[1]]);
  
  return (
    <>
      <MapContainer zoomControl={false} scrollWheelZoom={false} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Polyline pathOptions={{ color: 'red' }} positions={latLngArray} />
        <FitBounds path={activity.path} />
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

const FitBounds = ({ path }) => {
  const map = useMap();

  useEffect(() => {
    if (path && path.length > 0) {
      const boundingBox = turf.bbox(turf.lineString(path));
      map.fitBounds([
        [boundingBox[0], boundingBox[1]],
        [boundingBox[2], boundingBox[3]]
      ]);
    }
  }, [map, path]);

  return null;
}

export default ActivityDetailsPage