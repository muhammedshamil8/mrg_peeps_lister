import React, { useState, useEffect } from 'react';
import { fetchRecords } from '@/utils/airtableService';
import { UserRound, UsersRound, Phone, Baby } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react'

const StatisticsPage = () => {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    setLoading(true);
    try {
      const records = await fetchRecords("families");
      setFamilyData(records);
    } catch (error) {
      console.error("Error fetching family data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalFamilies = familyData.length;
  const totalAdults = familyData.reduce((acc, family) => acc + (family.fields.totalAdults || 0), 0);
  const totalChildren = familyData.reduce((acc, family) => acc + (family.fields.totalChildren || 0), 0);
  const totalCalled = familyData.reduce((acc, family) => acc + (family.fields.called ? 1 : 0), 0);

  const statisticsData = familyData.reduce((acc, family) => {
    const group = family.fields.group || 'Unknown';
    if (!acc[group]) {
      acc[group] = { group, totalFamilies: 0, totalAdults: 0, totalChildren: 0, called: 0 };
    }
    acc[group].totalFamilies += 1;
    acc[group].totalAdults += family.fields.totalAdults || 0;
    acc[group].totalChildren += family.fields.totalChildren || 0;
    acc[group].called += family.fields.called ? 1 : 0;
    return acc;
  }, {});

  const groupedStatistics = Object.values(statisticsData);

  return (
    <div className="flex flex-col items-center justify-start p-8 bg-gradient-to-r from-purple-200 to-purple-400 min-h-full" ref={parent}>
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">Statistics Page</h1>

      {loading ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-white">Loading...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" ref={parent}>
            {groupedStatistics.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 w-full">
                <div className="flex items-center mb-6">
                  <UserRound className="w-8 h-8 text-purple-500" />
                  <h2 className="text-xl font-semibold ml-4">{item.group}</h2>
                </div>
                <p className="text-lg"><UsersRound className="inline w-5 h-5 text-gray-500" /> Total Families: {item.totalFamilies}</p>
                <p className="text-lg"><UserRound className="inline w-5 h-5 text-gray-500" /> Total Adults: {item.totalAdults}</p>
                <p className="text-lg"><Baby className="inline w-5 h-5 text-gray-500" /> Total Children: {item.totalChildren}</p>
                <p className="text-lg"><Phone className="inline w-5 h-5 text-gray-500" /> Total Called: {item.called}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-600 text-white shadow-lg rounded-lg p-8 w-full sm:max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Overall Totals</h2>
            <p className="text-lg"><UsersRound className="inline w-5 h-5 text-gray-200" /> Total Families: {totalFamilies}</p>
            <p className="text-lg"><UserRound className="inline w-5 h-5 text-gray-200" /> Total Adults: {totalAdults}</p>
            <p className="text-lg"><Baby className="inline w-5 h-5 text-gray-200" /> Total Children: {totalChildren}</p>
            <p className="text-lg"><Phone className="inline w-5 h-5 text-gray-200" /> Total Called: {totalCalled}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
