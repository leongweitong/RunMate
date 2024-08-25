import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { BarChart, Bar, AreaChart, Area, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIndexedDB } from "react-indexed-db-hook";

const AnalysisPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const { getAll } = useIndexedDB("activity");

  useEffect(() => {
    const fetchData = async () => {
      const activities = await getAll();
      const processedData = processActivities(activities);
      setData(processedData);
    };

    fetchData();
  }, []);

  const processActivities = (activities) => {
    // Ensure we received valid activity data
    if (!activities || activities.length === 0) {
      console.warn("No activities found!");
      return [];
    }
  
    const groupedData = activities.reduce((acc, activity) => {
      const date = new Date(activity.createTime).toLocaleDateString();
  
      // Validate that totalDistance and time are numbers
      const totalDistance = parseFloat(activity.totalDistance) || 0;
      const time = parseFloat(activity.time) || 0;
  
      if (!acc[date]) {
        acc[date] = { date, totalDistance: 0, totalTime: 0 };
      }
  
      // Accumulate total distance and time for each date
      acc[date].totalDistance += totalDistance;
      acc[date].totalTime += time;
  
      return acc;
    }, {});
  
    // Convert accumulated data to average speed
    const result = Object.values(groupedData).map((item) => {
      const totalHours = ((item.totalTime / 1000) / 60) / 60; // Convert milliseconds to hours
  
      // Avoid division by zero for speed calculation
      const speed = totalHours > 0 ? (item.totalDistance / totalHours).toFixed(2) : 0;
  
      return {
        date: item.date,
        speed: parseFloat(speed), // Convert to a float for chart display
        totalTime: totalHours.toFixed(2),
      };
    });
  
    console.log("Processed Activity Data:", result);
  
    return result;
  }; 

  return (
    <div className='flex flex-col gap-4'>
      <div className="border-b border-secondary px-4 py-3">
        <div className='text-primary text-xl font-semibold'>{t("analysis")}</div>
      </div>
  
      {data.length > 0 ? (
        <>
          <div className='px-4'>
            <div className='p-4'>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e63825f2" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#e63825f2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    dataKey="totalTime" 
                    fill="url(#colorTime)" 
                    name={t("time-spent-running-hour")} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className='px-4'>
            <div className='p-4'>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e63825f2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#e63825f2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" dataKey="speed" name={t("speed-analysis-hour")} stroke="#e63825f2" fillOpacity={1} fill="url(#colorSpeed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        <div className='mt-4 text-center text-gray-500'>{t("general.no-record")}</div>
      )}
    </div>
  );  
}

export default AnalysisPage;
