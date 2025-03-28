'use client';

import * as React from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Dropdown from "@/components/shared/Dropdown";
import FormControl from "@mui/material/FormControl";
import { FileUploader } from "@/components/shared/FileUploader";
import Image from 'next/image';
import { Checkbox, FormGroup, FormLabel } from "@mui/material";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type EventFormProps = {
    userId: string;
    type: 'Create' | 'Update';
}

const EventForm = ({ userId, type }: EventFormProps) => {
    const [eventId, setEventId] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [url, setUrl] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        // Handle form submission
        console.log('Form submitted:', { userId, type, eventId, description, location, price, url, isFree, startDate, endDate });
        setIsSubmitting(false);
    };

    return (
        <FormControl
            className='flex flex-col w-full gap-5'
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <div className='flex flex-col gap-5 md:flex-row'>
                <TextField
                    className='w-full'
                    label="Event title"
                    name='eventId'
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                />
                <Dropdown onChangeHandler={() => {}} value={''} />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
                <TextField
                    className='w-full h-full'
                    label="Description"
                    name='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{ style: { height: '200px' } }}
                />
            </div>
            <div className='flex flex-col gap-5 mb-10 md:flex-row'>
                <FileUploader
                    onFieldChange={() => {}}
                    imageUrl={''}
                    setFiles={() => {}}
                />
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
                <FormGroup>
                    <div className='flex-center h-[45px] w-full rounded-full bg-grey-50 px-4 py-2'>
                        <TextField
                            label='Location'
                            className='w-full'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <Image
                                        src='/assets/icons/location.svg'
                                        alt='location'
                                        width={20}
                                        height={20}
                                        className='filter-grey'
                                    />
                                ),
                            }}
                        />
                    </div>
                </FormGroup>
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
                <FormGroup>
                    <div className='flex-center h-[55px] w-full rounded-full bg-grey-50 px-4 py-2 mt-5'>
                        <TextField
                            label='Start Date:'
                            className='w-full'
                            InputProps={{
                                startAdornment: (
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        className='ml-10 input-field'
                                        showTimeSelect
                                        timeInputLabel='Time:'
                                        dateFormat='dd/MM/yyyy'
                                        wrapperClassName='date-picker'
                                    />
                                ),
                            }}
                        />
                    </div>
                </FormGroup>
                <FormGroup className='w-full'>
                    <div className='flex-center h-[55px] w-full rounded-full bg-grey-50 px-4 py-2 mt-5'>
                        <TextField
                            label='End Date:'
                            className='w-full'
                            InputProps={{
                                startAdornment: (
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        className='ml-10 input-field'
                                        showTimeSelect
                                        timeInputLabel='Time:'
                                        dateFormat='dd/MM/yyyy'
                                        wrapperClassName='date-picker'
                                    />
                                ),
                            }}
                        />
                    </div>
                </FormGroup>
            </div>
            <div className='flex flex-col gap-5 md:flex-row'>
                <FormGroup>
                    <div className='flex-center h-[45px] w-full rounded-full bg-grey-50 px-4 py-2'>
                        <TextField
                            className='w-full p-regular-16 border-0 bg-grey-50 outline-offset-0
                               focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                            label='Price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <Image
                                        src='/assets/icons/dollar.svg'
                                        alt='dollar'
                                        width={20}
                                        height={20}
                                        className='filter-grey'
                                    />
                                ),
                            }}
                        />
                        <FormGroup>
                            <FormControl>
                                <div className='w-full mt-2 flex items-center'>
                                    <FormLabel htmlFor='isFree' className='whitespace-nowrap mr-1 pr-3 leading-none peer-disable:cursor-not-allowed
                               peer-disabled:opacity-70'>Free Ticket</FormLabel>
                                    <Checkbox
                                        id='isFree'
                                        checked={isFree}
                                        onChange={(e) => setIsFree(e.target.checked)}
                                        className='h-5 w-5 border-2 border-primary-500 pl-3'/>
                                </div>
                            </FormControl>
                        </FormGroup>
                    </div>
                </FormGroup>
            </div>
            <div className='flex flex-col gap-5 mt-8 md:flex-row'>
                <FormGroup>
                    <div className='flex-center h-[45px] w-full rounded-full bg-grey-50 px-4 py-2'>
                        <TextField
                            className='w-full'
                            label='URL'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <Image
                                        src='/assets/icons/link.svg'
                                        alt='link'
                                        width={20}
                                        height={20}
                                        className='filter-grey'
                                    />
                                ),
                            }}
                        />
                    </div>
                </FormGroup>
            </div>
            <div className='flex flex-col bottom-10 w-full mt-10'>
                <button
                    className='btn btn-jtown'
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : `${type} Event`}
                </button>
            </div>
        </FormControl>
    );
}

export default EventForm;