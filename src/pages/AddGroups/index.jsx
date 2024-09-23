import React, { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useParams } from 'react-router-dom';
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
import { Loader, Trash2 } from 'lucide-react';
import { createRecord, fetchRecords, deleteRecord } from '@/utils/airtableService';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useToast } from '@/hooks/use-toast';
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

// Schema Definitions
const airtableSchema1 = z.object({
    group_name: z.string().min(1, { message: "Group name is required" }),
});
const airtableSchema2 = z.object({
    subgroup_name: z.string().min(1, { message: "Sub group name is required" }),
});
const airtableSchema3 = z.object({
    place_name: z.string().min(1, { message: "Place name is required" }),
});

const AirtableForm = () => {
    const { toast } = useToast();
    const [formType, setFormType] = useState(null);
    const [showType, setShowType] = useState('groups');
    const [loading, setLoading] = useState(true);
    const [places, setPlaces] = useState([]);
    const [groups, setGroups] = useState([]);
    const [subgroups, setSubgroups] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [parent] = useAutoAnimate();

    const handleFormSwitch = (type) => {
        setFormType(type);
    };

    const handleShowSwitch = (type) => {
        setShowType(type);
    };

    // Determine form schema based on formType
    const schema = formType === 'groups' ? airtableSchema1 :
        formType === 'subgroups' ? airtableSchema2 :
            airtableSchema3;

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            group_name: '',
            subgroup_name: '',
            place_name: '',
        },
    });

    const handleSubmit = async (data) => {
        setSubmitLoading(true);
        try {
            await createRecord(formType, data);  // Replace with your Airtable table name
            toast({
                title: 'Success',
                description: `${formType === 'groups' ? 'Group' : formType === 'subgroups' ? 'Subgroup' : 'Place'} added successfully`,
                variant: 'success',
            });
            if (formType === 'groups') {
                fetchGroups();
            } else if (formType === 'subgroups') {
                fetchSubgroups();
            } else if (formType === 'places') {
                fetchPlaces();
            }

            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                title: 'Error',
                description: 'An error occurred while submitting the form',
                variant: 'destructive',
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
        fetchGroups();
        fetchSubgroups();
        setLoading(false);
    }, []);

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

    const handleDelete = async (tableName, id) => {
        try {
            await deleteRecord(tableName, id);
            setLoading(true);
            toast({
                title: 'Success',
                description: 'Record deleted successfully',
                variant: 'success',
            });
            if (tableName === 'groups') {
                fetchGroups();
            } else if (tableName === 'subgroups') {
                fetchSubgroups();
            } else if (tableName === 'places') {
                fetchPlaces();
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex flex-col items-center justify-start pt-10 h-full bg-gradient-to-r from-blue-300 to-purple-500 p-4" ref={parent}>
            <h1 className="text-3xl md:text-5xl font-bold text-center text-white mb-10">Manage Categories</h1>

            {/* Buttons to switch between forms */}
            <div className="mb-6 flex space-x-4 justify-center items-center" >
                <Button onClick={() => handleFormSwitch('groups')} className="bg-blue-500 text-white">
                    Add Group
                </Button>
                <Button onClick={() => handleFormSwitch('subgroups')} className="bg-green-500 text-white">
                    Add Subgroup
                </Button>
                <Button onClick={() => handleFormSwitch('places')} className="bg-purple-500 text-white">
                    Add Place
                </Button>
                {formType !== null && (
                    <Button onClick={() => handleFormSwitch(null)} className="bg-red-500 text-white">
                        Close Form
                    </Button>
                )}
            </div>

            {/* Display form based on selection */}
            {formType && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                        {formType === 'groups' && (
                            <FormField
                                control={form.control}
                                name="group_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Group Name</FormLabel>
                                        <Input
                                            placeholder="Enter Group Name"
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {formType === 'subgroups' && (
                            <FormField
                                control={form.control}
                                name="subgroup_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subgroup Name</FormLabel>
                                        <Input
                                            placeholder="Enter Subgroup Name"
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {formType === 'places' && (
                            <FormField
                                control={form.control}
                                name="place_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Place Name</FormLabel>
                                        <Input
                                            placeholder="Enter Place Name"
                                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            {...field}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <Button type="submit" className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200" disabled={submitLoading}>
                            {submitLoading ? <Loader className="animate-spin" /> : 'Submit'}
                        </Button>
                    </form>
                </Form>
            )}
            <section className='flex flex-col items-center justify-start pt-10 h-full  p-4' ref={parent}>
                {/* Buttons to switch between forms */}
                <div className="mb-6 flex space-x-4">
                    <Button onClick={() => handleShowSwitch('groups')} className="bg-blue-500 text-white">
                        Show Group
                    </Button>
                    <Button onClick={() => handleShowSwitch('subgroups')} className="bg-green-500 text-white">
                        Show Subgroup
                    </Button>
                    <Button onClick={() => handleShowSwitch('places')} className="bg-purple-500 text-white">
                        Show Place
                    </Button>
                </div>

                {/* Display form based on selection */}
                {loading ? (
                    <p className="text-center text-lg">Loading... <Loader className='animate-spin' /></p>
                ) : (
                    <div className="flex flex-col items-center space-y-4 w-full">
                        {showType === 'groups' && (
                            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[500px]">
                                <h2 className="text-3xl font-bold mb-4">Groups</h2>
                                {groups.map((group, index) => (
                                    <div key={index} className="bg-gray-200 p-4 rounded-lg mb-4 flex justify-between gap-4">
                                        <p key={index} className="text-lg">{group.fields.group_name}</p>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <button className="flex items-center text-sm text-red-600 hover:bg-red-100 p-2 rounded transition duration-200 mx-auto">
                                                    <Trash2 className="mr-1 w-4 h-4 md:w-6 md:h-6" />
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
                                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete('groups', group.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showType === 'subgroups' && (
                            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[500px]">
                                <h2 className="text-3xl font-bold mb-4">Subgroups</h2>
                                {subgroups.map((subgroup, index) => (
                                    <div key={index} className="bg-gray-200 p-4 rounded-lg mb-4 flex justify-between gap-4">
                                        <p key={index} className="text-lg">{subgroup.fields.subgroup_name}</p>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <button className="flex items-center text-sm text-red-600 hover:bg-red-100 p-2 rounded transition duration-200 mx-auto">
                                                    <Trash2 className="mr-1 w-4 h-4 md:w-6 md:h-6" />
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
                                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete('subgroups', subgroup.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                        )}
                        {showType === 'places' && (
                            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[500px]">
                                <h2 className="text-3xl font-bold mb-4">Places</h2>
                                {places.map((place, index) => (
                                    <div key={index} className="bg-gray-200 p-4 rounded-lg mb-4 flex justify-between gap-4">
                                        <p key={index} className="text-lg">{place.fields.place_name}</p>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <button className="flex items-center text-sm text-red-600 hover:bg-red-100 p-2 rounded transition duration-200 mx-auto">
                                                    <Trash2 className="mr-1 w-4 h-4 md:w-6 md:h-6" />
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
                                                    <AlertDialogCancel >Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete('places', place.id)}>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AirtableForm;
