import React, {useState, useEffect, useRef} from 'react'
import { useIndexedDB  } from "react-indexed-db-hook";
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from "react-i18next";
import { BsArrowLeftShort, BsSpeedometer, BsGeoAltFill, BsTrash, BsDownload } from 'react-icons/bs';
import { FaShoePrints } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {formatTime} from '../utils/formatTime'
import * as turf from "@turf/turf";
import html2canvas from 'html2canvas';
import leafletImage from 'leaflet-image';

const ActivityDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getByID, deleteRecord } = useIndexedDB("activity");
  const [activity, setActivity] = useState(null)
  const navigate = useNavigate()
  const captureRef = useRef(null);
  const mapRef = useRef(null);

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

  const data = activity.path.map((res, i) => [...res, activity.coords[i].accuracy])

  const kFilter = new KalmanFilter({
    observation: {
      sensorDimension: 3,
      sensorCovariance: 250000,
      name: 'sensor'
    },
    dynamic: {
      init: {
        mean: data[0].concat([0, 0, 0]).map(a => [a]),
        covariance: [
          [1, 0, 0, 0, 0, 0], 
          [0, 1, 0, 0, 0, 0], 
          [0, 0, 1, 0, 0, 0], 
          [0, 0, 0, 1, 0, 0],
          [0, 0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0, 1],
        ],
      },
      name: 'constant-speed',
      covariance: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    }
  });

  const filteredResults = kFilter.filterAll(data);
  const latLngArray = filteredResults.map(result => [result[0], result[1]]);

  const deleteActivity = () => {
    const userConfirmed = window.confirm("Are you sure you want to delete this activity?");
  
    if (userConfirmed) {
      deleteRecord(activity.id).then((event) => {
        alert("Activity Deleted!");
        navigate(-1);
      }).catch((error) => {
        console.error("Error deleting activity:", error);
        alert("There was an error deleting the activity.");
      });
    }
  };

  const captureScreenshot = () => {
    if (mapRef.current && captureRef.current) {

      // Capture the map using leafletImage
      leafletImage(mapRef.current, (err, mapCanvas) => {
          if (err) {
              console.error("Error capturing map:", err);
              return;
          }

          const mapWidth = mapCanvas.width;
          const mapHeight = mapCanvas.height;

          // Capture the rest of the page using html2canvas
          html2canvas(captureRef.current, {
            scale: mapWidth / captureRef.current.offsetWidth
          }).then(pageCanvas => {
              const ctx = pageCanvas.getContext("2d");
              
              const pageWidth = pageCanvas.width;
              const pageHeight = pageCanvas.height;

              // Adjust page canvas height to accommodate both the map and captureRef
              const finalCanvas = document.createElement("canvas");
              finalCanvas.width = mapWidth
              finalCanvas.height = mapHeight

              const finalCtx = finalCanvas.getContext("2d");

              // Draw the map canvas on the final canvas
              finalCtx.drawImage(
                  mapCanvas,
                  0, 0, mapWidth, mapHeight,
                  0, 0, mapWidth, mapHeight
              );

              // Draw the page (captureRef) canvas on the final canvas below the map
              finalCtx.drawImage(
                  pageCanvas,
                  0, 0, pageWidth, pageHeight,
                  0, mapHeight - pageHeight, pageWidth, pageHeight
              );

              // Create a download link for the combined screenshot
              const dataUrl = finalCanvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = dataUrl;
              link.download = 'activity-screenshot.png';
              link.click();
          });
      });
    }
  };

  const activeShare = () => {
    captureScreenshot()
  }
  
  return (
    <>
      <div className='fixed top-0 left-0 p-4 z-10'>
        <div onClick={()=> navigate(-1)} className='rounded-xl bg-white border border-black p-2'>
          <BsArrowLeftShort className='text-2xl' />
        </div>
      </div>

      <div className='fixed top-0 left-2/4 transform -translate-x-1/2 p-4 z-10'>
        <div onClick={activeShare} className='rounded-xl bg-white border border-black p-2'>
          <BsDownload className='text-2xl' />
        </div>
      </div>

      <div className='fixed top-0 right-0 p-4 z-10'>
        <div onClick={deleteActivity} className='rounded-xl bg-white border border-black p-2'>
          <BsTrash className='text-2xl' />
        </div>
      </div>

      <div>
        <MapContainer zoomControl={false} scrollWheelZoom={false} preferCanvas={true} ref={mapRef} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Polyline pathOptions={{ color: 'red', weight: 5 }} positions={latLngArray} />
          <FitBounds path={activity.path} />
        </MapContainer>

        <div ref={captureRef} className="fixed bottom-10 left-0 w-full p-4">
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