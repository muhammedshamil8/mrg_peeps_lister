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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from 'lucide-react'; // Importing icons
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useToast } from "@/hooks/use-toast"

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedPlace, setSelectedPlace] = useState('All');
  const [selectedSubgroup, setSelectedSubgroup] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
  const [places, setPlaces] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const { toast } = useToast()

  useEffect(() => {
    fetchFamilies();
    fetchPlaces();
    fetchGroups();
    fetchSubgroups();
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

  const getGroupName = (groupID) => {
    if (!groupID) return '';
    const group = groups.find(group => group.id === groupID[0]);
    return group?.fields.group_name;
  }

  const getSubgroupName = (subgroupID) => {
    if (!subgroupID) return '';
    const subgroup = subgroups.find(subgroup => subgroup.id === subgroupID[0]);
    return subgroup?.fields.subgroup_name;
  }

  const getPlaceName = (placeID) => {
    if (!placeID) return '';
    const place = places.find(place => place.id === placeID[0]);
    return place?.fields.place_name;
  }

  const handleDelete = async (deletingId) => {
    try {
      await deleteRecord('families', deletingId);
      toast({
        title: 'Family Deleted',
        description: 'The family has been successfully deleted.',
        variant: 'success',
      })
      fetchFamilies();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const filteredFamilies = familyData.filter(family => {
    const familyName = family?.fields.family_name?.toLowerCase() || '';
    const matchesSearch = familyName.includes(searchQuery.toLowerCase());
    const isGroupMatch = selectedGroup === 'All' || getGroupName(family.fields.groups) === selectedGroup;
    const isPlaceMatch = selectedPlace === 'All' || getPlaceName(family.fields.places) === selectedPlace;
    const isSubgroupMatch = selectedSubgroup === 'All' || getSubgroupName(family.fields.subgroups) === selectedSubgroup;
    const isStatusMatch = selectedStatus === 'All' || family.fields.status === selectedStatus;

    return matchesSearch && isGroupMatch && isPlaceMatch && isSubgroupMatch && isStatusMatch;
  });



  const getSummaryForGroup = (group) => {
    // Use filtered families for summary
    const familiesInGroup = filteredFamilies.filter(family =>
      (group === 'All' || getGroupName(family.fields.groups) === group) &&
      (selectedPlace === 'All' || getPlaceName(family.fields.places) === selectedPlace) &&
      (selectedSubgroup === 'All' || getSubgroupName(family.fields.subgroups) === selectedSubgroup) &&
      (selectedStatus === 'All' || family.fields.status === selectedStatus)
    );

    const totalFamilies = familiesInGroup.length;
    const totalChildren = familiesInGroup.reduce((acc, family) => acc + (family.fields.childrens || 0), 0);
    const totalAdults = familiesInGroup.reduce((acc, family) => acc + (family.fields.adults || 0), 0);

    return { totalFamilies, totalChildren, totalAdults };
  };

  const summary = getSummaryForGroup(selectedGroup);



  const fetchPlaces = async () => {
    try {
      const records = await fetchRecords('places');
      console.log(records);
      setPlaces(records);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  }
  const fetchGroups = async () => {
    try {
      const records = await fetchRecords('groups');
      console.log(records);
      setGroups(records);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }
  const fetchSubgroups = async () => {
    try {
      const records = await fetchRecords('subgroups');
      console.log(records);
      setSubgroups(records);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    }
  }

  const handleReset = () => {
    setSearchQuery('');
    setSelectedGroup('All');
    setSelectedPlace('All');
    setSelectedSubgroup('All');
    setSelectedStatus('All');
  };



  return (
    <div className="p-8 bg-gradient-to-r from-blue-200 to-blue-400 min-h-full mb-2" ref={parent}>
      <h1 className="text-3xl md:text-5xl text-center mb-8 font-bold text-white drop-shadow-lg">Marriage List</h1>

      <div className="flex justify-center mb-6 flex-wrap gap-4">
        {groups.map(group => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group.fields.group_name)}
            className={`px-6 py-2 rounded-lg transition duration-200 ${selectedGroup === group.fields.group_name ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-500 hover:text-white shadow-md'}`}
          >
            {group.fields.group_name}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-6 gap-3">
        <Select
          onValueChange={(value) => setSelectedPlace(value)}
          value={selectedPlace}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Place" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Places</SelectItem>
            {places.map(place => (
              <SelectItem key={place.id} value={place.fields.place_name}>
                {place.fields.place_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => setSelectedSubgroup(value)}
          value={selectedSubgroup}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subgroups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Subgroups</SelectItem>
            {subgroups.map(subgroup => (
              <SelectItem key={subgroup.id} value={subgroup.fields.subgroup_name}>
                {subgroup.fields.subgroup_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setSelectedStatus(value)}
          value={selectedStatus}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>


      </div>
      <div className="flex justify-center mb-6 gap-3">
        <button
          onClick={handleReset} // Call the reset function on click
          className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200'
        >
          Reset Filters
        </button>
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
        <div className="text-center mb-4">
          {selectedGroup === 'All' && selectedPlace === 'All' && selectedSubgroup === 'All' && selectedStatus === 'All' ? (
            <p className="text-lg text-gray-500">No filters applied. Showing all families.</p>
          ) : (
            <p className="text-lg">
              Families Filtered by:
              {selectedGroup !== 'All' && ` | ${selectedGroup} |`}
              {selectedPlace !== 'All' && ` ${selectedPlace} |`}
              {selectedSubgroup !== 'All' && `  ${selectedSubgroup} |`}
              {selectedStatus !== 'All' && ` ${selectedStatus} |`}
            </p>
          )}
        </div>
        <h2 className="text-3xl font-bold mb-4">Summary for {selectedGroup}</h2>
        <p className="text-lg">Total Families: {summary.totalFamilies}</p>
        <p className="text-lg">Children: {summary.totalChildren}</p>
        <p className="text-lg">Adults: {summary.totalAdults}</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6" ref={parent}>
        <h2 className="text-3xl font-bold mb-4">Families</h2>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : (
          <ul className="space-y-4" ref={parent}>
            {filteredFamilies.length > 0 ? (
              filteredFamilies.map((family, index) => (
                <li key={index} className="border rounded-lg p-4 flex justify-between items-center shadow hover:shadow-md transition duration-200 bg-gray-50">
                  <div className="flex-1">
                    <span className="font-semibold text-lg">{family.fields.family_name}</span>
                    <span className="block  text-orange-700">{getGroupName(family.fields.groups)}</span>
                    <span className="block italic text-orange-500">{getSubgroupName(family.fields?.subgroups)}</span>
                    <span className="block italic text-blue-700">{getPlaceName(family.fields?.places)}</span>
                    <span className="text-gray-500">
                      {family.fields.childrens} Children, {family.fields.adults} Adults
                    </span>
                  </div>
                  <div className="flex items-center flex-col justify-center md:flex-row gap-2">
                    {family.fields.status && (
                      <Badge
                        variant={
                          family.fields.status === 'pending'
                            ? 'pending'
                            : family.fields.status === 'confirmed'
                              ? 'confirmed'
                              : 'cancelled'
                        }
                        className="md:mr-2 mx-auto"
                      >
                        {family.fields.status}
                      </Badge>
                    )}
                    <Badge variant={family.fields.called ? 'called' : 'notCalled'} className="md:mr-2 mx-auto">
                      {family.fields.called ? 'Called' : 'Not Called'}
                    </Badge>
                    {user && role === 'admin' && (
                      <div className="flex items-center md:space-x-4 md:ml-4 flex-col md:flex-row justify-center">
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <div className="flex items-center text-sm text-red-600 hover:bg-red-100 p-2 rounded transition duration-200 mx-auto">
                              <Trash2 className="mr-1 w-4 h-4 md:w-6 md:h-6" /> Delete
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. Do you really want to delete this record?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel >Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(family.id)}>Continue</AlertDialogAction>
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
