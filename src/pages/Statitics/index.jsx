import React, { useState, useEffect } from 'react';
import { fetchRecords } from '@/utils/airtableService';
import { UserRound, UsersRound, Phone, Baby, CalendarCheck } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react'

const StatisticsPage = () => {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchFamilies();
    fetchGroups();
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

  const fetchGroups = async () => {
    try {
      const records = await fetchRecords('groups');
      console.log(records);
      setGroups(records);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }



  const getGroupName = (groupID) => {
    if (!groupID) return '';
    const group = groups.find(group => group.id === groupID[0]);
    return group?.fields.group_name;
  }


  const totalFamilies = familyData.length;
  const totalAdults = familyData.reduce((acc, family) => acc + (family.fields.adults || 0), 0);
  const totalChildren = familyData.reduce((acc, family) => acc + (family.fields.childrens || 0), 0);
  const totalConfirmed = familyData.reduce((acc, family) => acc + (family.fields.status === 'confirmed' ? 1 : 0), 0);
  const totalCalled = familyData.reduce((acc, family) => acc + (family.fields.called ? 1 : 0), 0);

  const statisticsData = familyData.reduce((acc, family) => {
    const group = getGroupName(family.fields.groups) || 'Unknown';
    const isConfirmed = family.fields.status === 'confirmed' ? 1 : 0;

    if (!acc[group]) {
      acc[group] = { group, totalFamilies: 0, totalAdults: 0, totalChildren: 0, called: 0, confirmed: 0, subgroups: [] };
    }
    acc[group].totalFamilies += 1;
    acc[group].totalAdults += family.fields.adults || 0;
    acc[group].totalChildren += family.fields.childrens || 0;
    acc[group].called += family.fields.called ? 1 : 0;
    acc[group].confirmed += isConfirmed; 

    return acc;
  }, {});

  const groupedStatistics = Object.values(statisticsData);

  return (
    <div className="flex flex-col items-center justify-start p-8 bg-gradient-to-r from-purple-200 to-purple-400 min-h-full  overflow-auto pb-10" ref={parent}>
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">Statistics Page</h1>

      {loading ? (
        <div className="flex items-center justify-center">
          <p className="text-xl text-white">Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-8 mb-8" ref={parent}>
            {groupedStatistics.map((item, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 w-full max-w-[360px] text-lg mx-auto">
                <div className="flex items-center mb-6" onClick={() => handleGroupClick(index)}>
                  <UserRound className="w-8 h-8 text-purple-500 cursor-pointer" />
                  <h2 className="text-xl font-semibold ml-4 cursor-pointer">{item.group}</h2>
                </div>
                <p className="text-lg"><UsersRound className="inline w-5 h-5 text-gray-500" /> Total Families: {item.totalFamilies}</p>
                <p className="text-lg"><UserRound className="inline w-5 h-5 text-gray-500" /> Total Adults: {item.totalAdults}</p>
                <p className="text-lg"><Baby className="inline w-5 h-5 text-gray-500" /> Total Children: {item.totalChildren}</p>
                <p className="text-lg"><CalendarCheck className="inline w-5 h-5 text-gray-500" /> Total Confirmed: {item.confirmed}</p>
                <p className="text-lg"><Phone className="inline w-5 h-5 text-gray-500" /> Total Called: {item.called}</p>
                <p className='text-lg'><UsersRound className="inline w-5 h-5 text-gray-500" /> Adults + Children: {item.totalChildren + item.totalAdults} </p>
              </div>
            ))}
          </div>

          <div className="bg-purple-600 text-white shadow-lg rounded-lg p-8 w-full sm:max-w-md mx-auto mt-8 text-lg">
            <h2 className="text-2xl font-bold mb-6">Overall Totals</h2>
            <p className="text-lg"><UsersRound className="inline w-5 h-5 text-gray-200" /> Total Families: {totalFamilies}</p>
            <p className="text-lg"><UserRound className="inline w-5 h-5 text-gray-200" /> Total Adults: {totalAdults}</p>
            <p className="text-lg"><Baby className="inline w-5 h-5 text-gray-200" /> Total Children: {totalChildren}</p>
            <p className="text-lg"><CalendarCheck className="inline w-5 h-5 text-gray-200" /> Total Confirmed: {totalConfirmed}</p>
            <p className="text-lg"><Phone className="inline w-5 h-5 text-gray-200" /> Total Called: {totalCalled}</p>
            <p className="text-lg"><UsersRound className="inline w-5 h-5 text-gray-200" /> Adults + Children: {totalAdults + totalChildren}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
