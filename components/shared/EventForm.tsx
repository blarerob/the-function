"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {eventFormSchema} from "@/lib/validator"
import * as z from 'zod'
import {eventDefaultValues} from "@/consts"
import Dropdown from "./Dropdown"
import {Textarea} from "@/components/ui/textarea"
import {FileUploader} from "./FileUploader"
import {useState} from "react"
import Image from "next/image"
import DatePicker from "react-datepicker";
import {useUploadThing} from '@/lib/uploadthing'

import "react-datepicker/dist/react-datepicker.css";
import {useRouter} from "next/navigation"
import {createEvent, updateEvent} from "@/lib/actions/event.actions"
import {IEvent} from "@/lib/database/models/event.model"


type EventFormProps = {
    userId: string
    type: "Create" | "Update"
    event?: IEvent,
    eventId?: string
}

const EventForm = ({userId, type, event, eventId}: EventFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const initialValues = event && type === 'Update'
        ? {
            ...event,
            startDateTime: new Date(event.startDateTime),
            endDateTime: new Date(event.endDateTime)
        }
        : eventDefaultValues;
    const router = useRouter();

    const {startUpload} = useUploadThing('imageUploader')

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues
    })

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        let uploadedImageUrl = values.imageUrl;

        if (files.length > 0) {
            const uploadedImages = await startUpload(files)

            if (!uploadedImages) {
                return
            }

            uploadedImageUrl = uploadedImages[0].url
        }

        if (type === 'Create') {
            try {
               const newEvent = await createEvent({
                    event: {
                        ...values,
                        imageUrl: uploadedImageUrl,
                    },
                    userId,
                    path: '/profile'
                });

                if (newEvent) {
                    form.reset();
                    router.push(`/events/${newEvent._id}`)
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (type === 'Update') {
            if (!eventId) {
                router.back()
                return;
            }

            try {
                const updatedEvent = await updateEvent({
                    userId,
                    event: {...values, imageUrl: uploadedImageUrl, _id: eventId},
                    path: `/events/${eventId}`
                })

                if (updatedEvent) {
                    form.reset();
                    router.push(`/events/${updatedEvent._id}`)
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 mb-20 rounded-lg shadow-lg">
            <h2 className="text-3xl font-extrabold text-white text-center mb-6">
                {type} Event
            </h2>
            <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            placeholder="Event title"
                                            {...field}
                                            className="w-full px-4 py-3 bg-white
                                         focus:ring-blue-500 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem className="w-full form-item">
                                    <FormControl>
                                        <Dropdown onChangeHandler={field.onChange} value={field.value}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => (
                                <FormItem className="w-full ">
                                    <FormControl className="h-72">
                                        <Textarea placeholder="Description" {...field}
                                                  className="textarea rounded-2xl"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({field}) => (
                                <FormItem className="w-full flex flex-col gap-2">
                                    <FormControl className="flex align-baseline h-72 bg-white">
                                        <FileUploader
                                            onFieldChange={field.onChange}
                                            imageUrl={field.value}
                                            setFiles={setFiles}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                        <span
                                            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full">
                                            <Image
                                                src="/assets/icons/location-grey.svg"
                                                alt="calendar"
                                                width={24}
                                                height={24}
                                            />
                                        </span>
                                            <Input
                                                placeholder="Event location or Online"
                                                {...field}
                                                className="input-field bg-white border-rose-50 pl-14"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                                )}
                            />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="startDateTime"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div
                                            className="flex items-center ml-3 h-[54px] w-full rounded-lg bg-white shadow-md px-4 py-2 justify-evenly">
                                            <Image
                                                src="/assets/icons/calendar.svg"
                                                alt="calendar"
                                                width={24}
                                                height={24}
                                                className="filter-grey"
                                            />
                                            <p className="whitespace-nowrap text-grey-600">Start Date:</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date | null) => field.onChange(date)}
                                                showTimeSelect
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                wrapperClassName="datePicker"
                                                className="ml-4"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDateTime"
                            render={({field}) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div
                                            className="flex items-center mr-3 h-[54px] w-full rounded-lg bg-white shadow-md px-4 py-2 justify-evenly">
                                            <Image
                                                src="/assets/icons/calendar.svg"
                                                alt="calendar"
                                                width={24}
                                                height={24}
                                                className="filter-grey"
                                            />
                                            <p className="whitespace-nowrap text-grey-600">End Date:</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date | null) => field.onChange(date)}
                                                showTimeSelect
                                                timeInputLabel="Time:"
                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                wrapperClassName="datePicker"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                   <Button
                       type="submit"
                       size="lg"
                       disabled={form.formState.isSubmitting}
                       className="w-full py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50"
                   >
                       {form.formState.isSubmitting ? 'Submitting...' : `${type} Event`}
                   </Button>
                </form>
            </Form>
            </div>
        </div>
    );
};

export default EventForm;