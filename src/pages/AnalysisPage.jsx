import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    const groupedData = activities.reduce((acc, activity) => {
      const date = new Date(activity.create_time).toLocaleDateString();

      if (!acc[date]) {
        acc[date] = { date, totalDistance: 0, totalTime: 0 };
      }

      // Accumulate total distance and time for each date
      acc[date].totalDistance += activity.totalDistance;
      acc[date].totalTime += activity.time;

      return acc;
    }, {});

    // Convert accumulated data to average speed
    return Object.values(groupedData).map((item) => {
      const totalHours = ((item.totalTime / 1000) / 60) / 60;
      return {
        date: item.date,
        speed: totalHours > 0 ? item.totalDistance / totalHours : 0
      };
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className="border-b border-secondary px-4 py-3">
        <div className='text-primary text-xl font-semibold'>{t("analysis")}</div>
      </div>

      <div className='px-4'>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* Set the dataKey directly to "date" */}
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="speed" stroke="#ffc658" name={t("Speed (km/h)")}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AnalysisPage;
