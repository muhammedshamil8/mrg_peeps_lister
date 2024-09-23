import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRecord, updateRecord, fetchRecord, fetchRecords } from '@/utils/airtableService';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useToast } from "@/hooks/use-toast"

const airtableSchema = z.object({
  family_name: z.string().min(1, { message: "Family name is required" }),
  adults: z.number().min(0, { message: "Must be 0 or more" }),
  childrens: z.number().min(0, { message: "Must be 0 or more" }),
  groups: z.string().nonempty({ message: "Group is required" }),
  subgroups: z.string().optional(),
  places: z.string().optional(),
  status: z.string().nonempty({ message: "Status is required" }),
  called: z.boolean().optional(),
});

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
];
const AirtableForm = () => {
  const eventID = useParams().id;
  const form = useForm({
    resolver: zodResolver(airtableSchema),
    defaultValues: {
      family_name: '',
      adults: 0,
      childrens: 0,
      groups: '',
      subgroups: '',
      places: '',
      status: 'pending',
      called: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groups, setGroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [places, setPlaces] = useState([]);
  const [groupsloading, setGroupsLoading] = useState(true);
  const [subgroupsloading, setSubgroupsLoading] = useState(true);
  const [placesloading, setPlacesLoading] = useState(true);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
  const { toast } = useToast()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (eventID) {
        try {
          const record = await fetchRecord('families', eventID);
          console.log(record);
          if (record) {
            form.setValue('family_name', record.fields.family_name);
            form.setValue('adults', record.fields.adults);
            form.setValue('childrens', record.fields.childrens);
            form.setValue('groups',
              Array.isArray(record.fields.groups) && record.fields.groups.length > 0
                ? record.fields.groups[0]
                : record.fields.groups || ''
            );
            form.setValue('subgroups',
              Array.isArray(record.fields.subgroups) && record.fields.subgroups.length > 0
                ? record.fields.subgroups[0]
                : record.fields.subgroups || ''
            );
            form.setValue('places',
              Array.isArray(record.fields.places) && record.fields.places.length > 0
                ? record.fields.places[0]
                : record.fields.places || ''
            );
            form.setValue('called', record.fields.called);
            form.setValue('status', record.fields.status);
            setIsEdit(true);
          }
        } catch (error) {
          console.error('Error fetching record:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [eventID]);

  useEffect(() => {
    if (!eventID) {
      setLoading(false);
    }
    fetchGroups();
    fetchPlaces();
    fetchSubgroups();
  }, []);

  const handleSubmit = async (data) => {
    console.log(data);
    setSubmitLoading(true);
    try {
      const formattedData = {
        family_name: data.family_name,
        called: data.called,
        status: data.status,
        adults: Number(data.adults),
        childrens: Number(data.childrens),
        groups: data.groups ? [data.groups] : [],
        places: data.places ? [data.places] : [],
        subgroups: data.subgroups ? [data.subgroups] : [],
      };

      if (isEdit) {
        await updateRecord('families', eventID, formattedData);
        toast({
          title: 'Success',
          description: 'Family data updated successfully',
          variant: 'success',
        });
      } else {
        await createRecord('families', formattedData);
        toast({
          title: 'Success',
          description: 'Family data added successfully',
          variant: 'success',
        });
      }

      form.reset();
      form.setValue('groups', '');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting the form',
        variant: 'destructive',
      });

    } finally {
      setSubmitLoading(false);
      // handleNavigateBack();
    }
  };


  const fetchPlaces = async () => {
    try {
      const records = await fetchRecords('places');
      console.log(records);
      setPlaces(records);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setPlacesLoading(false);
    }
  }
  const fetchGroups = async () => {
    try {
      const records = await fetchRecords('groups');
      console.log(records);
      setGroups(records);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setGroupsLoading(false);
    }
  }
  const fetchSubgroups = async () => {
    try {
      const records = await fetchRecords('subgroups');
      console.log(records);
      setSubgroups(records);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    } finally {
      setSubgroupsLoading(false);
    }
  }

  const handleNavigateBack = () => {
    navigate(-1);
  }

  return (
    <div className="flex flex-col items-center justify-start pt-10 h-full bg-gradient-to-r from-blue-300 to-purple-500 p-4" ref={parent}>
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-white">{isEdit ? 'Edit Family Data' : 'Add Family Data'}</h1>

      {loading ? (
        <Loader className="animate-spin text-blue-600 my-6" />
      ) : (

        <>
          <p className="mb-4 text-gray-600 text-center">
            {isEdit ? 'Edit the family data below' : 'Fill in the form below to add a new family'}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">

              <FormField
                control={form.control}
                name="family_name"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Family Name</FormLabel>
                    <Input
                      placeholder="Family Name"
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adults"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Adults</FormLabel>
                    <Input
                      type="number"
                      placeholder="Number of Adults"
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="childrens"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Childrens</FormLabel>
                    <Input
                      type="number"
                      placeholder="Number of Children"
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groups"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groupsloading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          groups.map((item, index) => (
                            <SelectItem key={index} value={item.id}>{item.fields.group_name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subgroups"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Sub Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Sub Group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subgroupsloading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          subgroups.map((item, index) => (
                            <SelectItem key={index} value={item.id}>{item.fields.subgroup_name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="places"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Place</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Place" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {placesloading ? (
                          <Loader className="animate-spin" />
                        ) : (
                          places.map((item, index) => (
                            <SelectItem key={index} value={item.id}>{item.fields.place_name}</SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((item, index) => (
                          <SelectItem key={index} value={item.value}>{item.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem ref={parent}>
                <FormLabel>Called</FormLabel>
                <FormField
                  control={form.control}
                  name="called"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Called for marriage or not
                        </FormLabel>
                        <FormDescription>
                          Select if the family has been called for marriage or not
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </FormItem>
              <Button type="submit" className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200 disabled:bg-gray-400" disabled={submitLoading}>
                {submitLoading ? <Loader className="animate-spin" /> : (isEdit ? 'Update' : 'Submit')}
              </Button>
            </form>
          </Form>
        </>

      )}
    </div>
  );
};

export default AirtableForm;
