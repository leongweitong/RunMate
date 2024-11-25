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
import { saveToFileCordova } from '../fileSaver';
import AlertBox from '../components/AlertBox';
import ConfirmBox from '../components/ConfirmBox';

const ActivityDetailsPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { getByID, deleteRecord } = useIndexedDB("activity");
  const [activity, setActivity] = useState(null)
  const navigate = useNavigate()
  const captureRef = useRef(null);
  const mapRef = useRef(null);
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [haveNavigate, setHaveNavigate] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [guide, setGuide] = useState({});

  const handleAlertBox = (text, navigate=false) => {
      setAlertMessage(text);
      setShowAlertBox(true);
      setHaveNavigate(navigate)
  };

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

  // Check if activity.path is multi-segment or a single segment
  const isMultiSegment = Array.isArray(activity.path[0][0]);
  const data = isMultiSegment ? activity.path : [activity.path];  // Wrap single segment in an array

  // Initialize empty array to store filtered results
  let latLngArray = [];

  // Function to filter a segment using Kalman Filter
  const applyKalmanFilter = (segmentData) => {
    const kFilter = new KalmanFilter({
      observation: {
        sensorDimension: 2,  // Only 2 dimensions: latitude and longitude
        sensorCovariance: 1000,  // Covariance of the sensor (adjustable)
        name: 'sensor'
      },
      dynamic: {
        init: {
          // Initial state mean for latitude and longitude, no additional dimensions
          mean: segmentData[0].concat([0, 0]).map(a => [a]), // Initial guess of position
          covariance: [
            [1, 0, 0, 0],  // Covariance for latitude
            [0, 1, 0, 0],  // Covariance for longitude
            [0, 0, 1, 0],  // Covariance for velocity (optional)
            [0, 0, 0, 1]   // Covariance for direction (optional)
          ],
        },
        name: 'constant-speed',
        covariance: [0.1, 0.1, 0.1, 0.1] // Process noise covariance for the dynamic model
      }
    });

    // Apply Kalman filter to this segment
    const filteredResults = kFilter.filterAll(segmentData);

    // Return filtered results in [lat, lng] format
    return filteredResults.map(result => [result[0], result[1]]);
  };

  // Iterate through each segment (multi-segment or single wrapped in array)
  data.forEach(segment => {
      if(segment.length < 2) return;
      const filteredSegment = applyKalmanFilter(segment);
      latLngArray.push(filteredSegment)
  });

  // At this point, latLngArray contains all the filtered coordinates
  console.log(latLngArray);

  const handleDeleteActivity = () => {
    setAlertMessage(t("quote.confirm.delete-activity"))
    setGuide({haveFunction:true, fn:deleteActivity})
    setShowConfirmBox(true)
  }

  const deleteActivity = () => {
    deleteRecord(activity.id).then((event) => {
      handleAlertBox(t("quote.alert.activity-delete"),true);
    }).catch((error) => {
      console.error("Error deleting activity:", error);
      handleAlertBox(t("quote.alert.activity-delete-error"),true);
    });
  };

  const captureScreenshot = () => {
    if(!navigator.onLine) {
      handleAlertBox(t("quote.alert.no-wifi"));
      return;
    }

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
              finalCanvas.height = mapHeight + pageHeight

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
                  0, mapHeight, pageWidth, pageHeight
              );

              // Convert the final canvas to a PNG Blob
              finalCanvas.toBlob((blob) => {
                if (window.cordova) {
                    // Cordova: Save the image to the Downloads folder
                    saveToFileCordova(blob, `activity-screenshot-${Date.now()}.png`)
                        .then((message) => {
                          handleAlertBox(t("quote.alert.screenshot-success"),false);
                        })
                        .catch((error) => {
                          handleAlertBox(t("quote.alert.screenshot-error"),false);
                        });
                } else {
                    // Browser: Trigger download using an anchor element
                    const dataUrl = finalCanvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'activity-screenshot.png';
                    link.click();
                    handleAlertBox(t("quote.alert.screenshot-success"),false);
                }
              }, 'image/png');
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
        <div onClick={handleDeleteActivity} className='rounded-xl bg-white border border-black p-2'>
          <BsTrash className='text-2xl' />
        </div>
      </div>

      {showAlertBox && (
          <AlertBox text={alertMessage} setShowAlertBox={setShowAlertBox} haveNavigate={haveNavigate} navigatePage={-1} />
      )}

      {showConfirmBox && (
        <ConfirmBox text={alertMessage} setShowConfirmBox={setShowConfirmBox} user={guide} />
      )}

      <div>
        <MapContainer zoomControl={false} scrollWheelZoom={false} preferCanvas={true} ref={mapRef} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Polyline pathOptions={{ color: 'red', weight: 5 }} positions={latLngArray} />
          <FitBounds path={isMultiSegment ? activity.path.flat() : activity.path} />
        </MapContainer>

        <div ref={captureRef} className="running-info-container border-t border-black p-4">
          <div className='h-full flex flex-col justify-center'>
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
  const [boundsFitOnce, setBoundsFitOnce] = useState(false);

  useEffect(() => {
    if (path && path.length > 0 && !boundsFitOnce) {
      const boundingBox = turf.bbox(turf.lineString(path));
      map.fitBounds([
        [boundingBox[0], boundingBox[1]],
        [boundingBox[2], boundingBox[3]]
      ]);
      setBoundsFitOnce(true);
    }
  }, [map, path]);

  return null;
}

export default ActivityDetailsPage