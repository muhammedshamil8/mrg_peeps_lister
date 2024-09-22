import React, { useEffect, useState } from 'react';
import { fetchRecords, deleteRecord } from '@/utils/airtableService';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from 'lucide-react'; // Importing icons

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user, role } = useAuth();
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      await deleteRecord('families', deletingId);
      setDeletingId(null);
      fetchFamilies();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const filteredFamilies = familyData.filter(family => {
    const familyName = family?.fields.family_name?.toLowerCase() || '';
    const matchesSearch = familyName.includes(searchQuery.toLowerCase());
    const isGroupMatch = selectedGroup === 'All' || family.fields.group === selectedGroup;
    const isCalledMatch = selectedGroup === 'Called' ? family.fields.called : selectedGroup === 'Not Called' ? !family.fields.called : true;

    return matchesSearch && isGroupMatch && isCalledMatch;
  });

  const groups = [
    { label: 'All', value: 'All' },
    { label: 'Friends', value: 'friends' },
    { label: 'Father Relatives', value: 'father relative' },
    { label: 'Mother Relatives', value: 'mother relative' },
    { label: 'Neighbors', value: 'neighbors' },
    { label: 'Called', value: 'Called' },
    { label: 'Not Called', value: 'Not Called' },
  ];

  const getSummaryForGroup = (group) => {
    const familiesInGroup = filteredFamilies.filter(family => family.fields.group === group);
    const totalFamilies = familiesInGroup.length;
    const totalChildren = familiesInGroup.reduce((acc, family) => acc + (family.fields.children || 0), 0);
    const totalAdults = familiesInGroup.reduce((acc, family) => acc + (family.fields.adults || 0), 0);

    return { totalFamilies, totalChildren, totalAdults };
  };

  const summary = getSummaryForGroup(selectedGroup);

  return (
    <div className="p-8 bg-gradient-to-r from-blue-200 to-blue-400 min-h-screen">
      <h1 className="text-5xl text-center mb-8 font-bold text-white drop-shadow-lg">Marriage List</h1>

      <div className="flex justify-center mb-6 flex-wrap gap-4">
        {groups.map(group => (
          <button
            key={group.value}
            onClick={() => setSelectedGroup(group.value)}
            className={`px-6 py-2 rounded-lg transition duration-200 ${selectedGroup === group.value ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-500 hover:text-white shadow-md'}`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-6 w-full">
        <input
          type="text"
          placeholder="Search Families"
          className="border border-gray-300 rounded-lg p-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-3xl font-bold mb-4">Summary for {selectedGroup}</h2>
        <p className="text-lg">Total Families: {summary.totalFamilies}</p>
        <p className="text-lg">Children: {summary.totalChildren}</p>
        <p className="text-lg">Adults: {summary.totalAdults}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4">Families</h2>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <ul className="space-y-4">
            {filteredFamilies.length > 0 ? (
              filteredFamilies.map((family, index) => (
                <li key={index} className="border rounded-lg p-4 flex justify-between items-center shadow hover:shadow-md transition duration-200 bg-gray-50">
                  <div className="flex-1">
                    <span className="font-semibold text-lg">{family.fields.family_name}</span>
                    <span className="block italic text-gray-700">{family.fields.group}</span>
                    <span className="text-gray-500">
                      {family.fields.childrens} Children, {family.fields.adults} Adults
                    </span>
                  </div>
                  <div className="flex items-center flex-col justify-center">
                    <Badge variant={family.fields.called ? 'called' : 'notCalled'} className="md:mr-2 mx-auto">
                      {family.fields.called ? 'Called' : 'Not Called'}
                    </Badge>

                    {user && role === 'admin' && (
                      <div className="flex items-center space-x-4 md:ml-4 flex-col justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <button className="flex items-center text-sm text-red-600 hover:bg-red-100 p-2 rounded transition duration-200 mx-auto">
                              <Trash2 className="mr-1 w-4 h-4 md:w-6 md:h-6" /> Delete
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Do you really want to delete this record?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeletingId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <button className="flex mx-auto items-center justify-center text-sm text-blue-600 hover:bg-blue-100 p-2 rounded transition duration-200" onClick={() => navigate(`/add-data/${family.id}`)}>
                          <Pencil className="mr-1 w-4 h-4 md:w-6 md:h-6" /> Edit
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-lg text-gray-500">No families found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HomePage;
