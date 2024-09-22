import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { createRecord, updateRecord, fetchRecord } from '@/utils/airtableService';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useToast } from "@/hooks/use-toast"

const airtableSchema = z.object({
  familyName: z.string().min(1, { message: "Family name is required" }),
  adults: z.number().min(0, { message: "Must be 0 or more" }),
  children: z.number().min(0, { message: "Must be 0 or more" }),
  group: z.string().min(1, { message: "Group is required" }),
  called: z.boolean(),
});

const AirtableForm = () => {
  const { id } = useParams();
  const form = useForm({
    resolver: zodResolver(airtableSchema),
    defaultValues: {
      familyName: '',
      adults: 0,
      children: 0,
      group: '',
      called: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const record = await fetchRecord('families', id);
          if (record) {
            form.setValue('familyName', record.fields.family_name);
            form.setValue('adults', record.fields.adults);
            form.setValue('children', record.fields.childrens);
            form.setValue('group', record.fields.group);
            form.setValue('called', record.fields.called);
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
  }, [id]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (data) => {
    setSubmitLoading(true);
    try {
      const formattedData = {
        family_name: data.familyName,
        called: data.called,
        group: data.group,
        adults: Number(data.adults),
        childrens: Number(data.children),
      };

      if (isEdit) {
        await updateRecord(id, formattedData);
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
                name="familyName"
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
                name="children"
                render={({ field }) => (
                  <FormItem ref={parent}>
                    <FormLabel>Children</FormLabel>
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
                name="group"
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
                        <SelectItem value="mother relative">Mother Relative</SelectItem>
                        <SelectItem value="father relative">Father Relative</SelectItem>
                        <SelectItem value="friends shamil">Friends shamil</SelectItem>
                        <SelectItem value="friends lulu">Friends Lulu</SelectItem>
                        <SelectItem value="friends ashi">Friends Ashique</SelectItem>
                        <SelectItem value="neighbors">Neighbors</SelectItem>
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
              <Button type="submit" className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-200" disabled={submitLoading}>
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
