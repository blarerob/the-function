'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {useRouter} from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod';
import Dropdown from '@/components/shared/Dropdown';
import { eventFormSchema } from '@/lib/validator';
import { FileUploader } from '@/components/shared/FileUploader';
import Image from 'next/image';
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { eventDefaultValues } from '@/consts';
import { useUploadThing } from '@/lib/uploadthing';
import { createEvent, updateEvent } from '@/lib/actions/event.actions';
import Link from 'next/link';
import { IEvent } from "@/lib/database/models/event.model"
import {Textarea} from "@/components/ui/textarea";
import {CreateEventParams} from "@/types";

type EventFormProps = {
    userId: string
    firstName: string
    lastName: string
    type: "Create" | "Update"
    event?: IEvent,
    eventId?: string
}

const EventForm = ({ userId, firstName, lastName, type, event, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
    const router = useRouter();

  const initialValues = event && type === 'Update'
      ? { ...event, startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime) }
      : eventDefaultValues
    ? {
        ...eventDefaultValues,
        startDateTime: new Date(eventDefaultValues.startDateTime),
        endDateTime: new Date(eventDefaultValues.endDateTime),
      }
    : eventDefaultValues;

  const { startUpload } = useUploadThing('imageUploader');

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
        const uploadedImages = await startUpload(files);

        if (!uploadedImages) {
            return;
        }

        uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === 'Create') {
        try {
            const newEvent = await createEvent({
                event: {...values, imageUrl: uploadedImageUrl},
                userId,
                firstName,
                lastName,
                path: '/profile',
            })

            if (newEvent) {
                form.reset();
                router.push(`/events/${newEvent._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (type === 'Update') {
        if (!eventId) {
            // Use Link for navigation
            return (
                <Link href="/events">
                    <a>Back to Events</a>
                </Link>
            );
        }

        try {
            const updatedEvent = await updateEvent({
                userId,
                event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
                path: `/events/${eventId}`,
            });

            if (updatedEvent) {
                form.reset();
                router.push(`/events/${updatedEvent._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}

  return (
      <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormControl>
                                  <Input placeholder="Event title" {...field} className="input-field" />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormControl>
                                  <Dropdown onChangeHandler={field.onChange} value={field.value} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormControl className="h-72">
                                  <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormControl className="h-72">
                                  <FileUploader
                                      onFieldChange={field.onChange}
                                      imageUrl={field.value}
                                      setFiles={setFiles}
                                  />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                          <FormItem className="w-full">
                              <FormControl>
                                  <div className="flex-center h-[54px] w-full rounded-full bg-grey-50 px-4 py-2">
                                      <Image
                                          src="/assets/icons/location-grey.svg"
                                          alt="calendar"
                                          width={24}
                                          height={24}
                                      />

                                      <Input placeholder="Event location or Online" {...field} className="input-field" />
                                  </div>

                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                      control={form.control}
                      name="startDateTime"
                      render={({ field }) => (
                          <FormItem className="w-full text-nowrap">
                              <FormControl>
                                  <div className="ag-input-field text-nowrap flex-center h-[54px] w-full rounded-full bg-grey-50 px-4 py-2">
                                      <Image
                                          src="/assets/icons/calendar.svg"
                                          alt="calendar"
                                          width={24}
                                          height={24}
                                          className="filter-grey"
                                      />
                                      <p className="ml-3 text-nowrap whitespace-nowrap text-grey-600">Start Date: </p>
                                      <DatePicker
                                          selected={field.value}
                                          onChange={(date: Date) => field.onChange(date)}
                                          showTimeSelect
                                          timeInputLabel="Time:"
                                          dateFormat="MM/dd/yyyy h:mm aa"
                                          wrapperClassName="datePicker"
                                          className='ml-2'
                                      />

                                  </div>

                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="endDateTime"
                      render={({ field }) => (
                          <FormItem className="input-field w-full">
                              <FormControl>
                                  <div className=" h-[54px] w-full rounded-full bg-grey-50 px-4 py-2">
                                      <Image
                                          src="/assets/icons/calendar.svg"
                                          alt="calendar"
                                          width={24}
                                          height={24}
                                          className="filter-grey"
                                      />
                                      <p className="ml-3 whitespace-nowrap text-grey-600">End Date: </p>
                                      <DatePicker
                                          selected={field.value}
                                          onChange={(date: Date) => field.onChange(date)}
                                          showTimeSelect
                                          timeInputLabel="Time:"
                                          dateFormat="MM/dd/yyyy h:mm aa"
                                          wrapperClassName="datePicker"
                                          className='ml-2'
                                      />
                                  </div>

                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="flex flex-col gap-5 md:flex-row">
                  <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                          <FormItem className="mb-8 mt-3 w-full">
                              <FormControl>
                                  <div className="input-field flex-center h-[54px] w-full rounded-full bg-grey-50 px-4 py-2">
                                      <Image
                                          src="/assets/icons/dollar.svg"
                                          alt="dollar"
                                          width={24}
                                          height={24}
                                          className="filter-grey"
                                      />
                                      <Input type="number" placeholder="Price" {...field} className="input-field" />
                                      <FormField
                                          control={form.control}
                                          name="isFree"
                                          render={({ field }) => (
                                              <FormItem>
                                                  <FormControl>
                                                      <div className="flex items-center">
                                                          <label htmlFor="isFree" className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                              Free Ticket
                                                          </label>
                                                          <Checkbox
                                                              onCheckedChange={field.onChange}
                                                              checked={field.value}
                                                              id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
                                                      </div>

                                                  </FormControl>
                                                  <FormMessage />
                                              </FormItem>
                                          )}
                                      />
                                  </div>

                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                          <FormItem className="mt-3 w-full">
                              <FormControl>
                                  <div className="flex-center h-[54px] w-full rounded-full bg-grey-50 px-4 py-2">
                                      <Image
                                          src="/assets/icons/link.svg"
                                          alt="link"
                                          width={24}
                                          height={24}
                                      />

                                      <Input placeholder="URL" {...field} className="input-field" />
                                  </div>

                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>


              <Button
                  type="submit"
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="button w-full align-bottom"
              >
                  {form.formState.isSubmitting ? (
                      'Submitting...'
                  ): `${type} Event `}</Button>
          </form>
      </Form>
  );
};

export default EventForm;