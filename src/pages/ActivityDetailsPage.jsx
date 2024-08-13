import React, {useState, useEffect} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from "react-i18next";

const ActivityDetailsPage = () => {
  const { t } = useTranslation();
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

      <div className="fixed bottom-10 left-0 w-full p-4 text-white z-10">
          <div className="bg-white p-4 flex justify-between items-center rounded-xl">
              <div>
                  <div>
                  {t("general.duration")}: <span className='font-bold'>00:00:00</span>
                  </div>
                  <div>{t("general.kilometers")}: <span className='font-bold'>1800 M</span></div>
              </div>
              <div className="flex gap-6">
                  
              </div>
          </div>
      </div>
    </>
  );
}

export default ActivityDetailsPage