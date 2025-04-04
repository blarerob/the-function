'use server'

import { revalidatePath } from 'next/cache'
import { connectToDatabase } from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'
import mongoose from "mongoose"

import {
    CreateEventParams,
    UpdateEventParams,
    DeleteEventParams,
    GetAllEventsParams,
    GetEventsByUserParams,
    GetRelatedEventsByCategoryParams,
} from '@/types'

const getCategoryByName = async (name: string) => {
    return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

const populateEvent = ({ query }: { query: mongoose.Query<unknown, unknown> }) => {
    return query
        .populate({ path: 'organizer', model: User, select: '_id firstName lastName' })
        .populate({ path: 'category', model: Category, select: '_id name' })
}

// CREATE
const createEvent = async ({ userId, event, path }: CreateEventParams) => {
    try {
        await connectToDatabase()

        const newEvent = await Event.create({ ...event, category: event.categoryId, organizer: userId })
        console.log('New Event Created:', newEvent)
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        console.error('Error creating event:', error)
        handleError(error)
    }
}

// GET ONE EVENT BY ID
const getEventById = async (eventId: string) => {
    try {
        await connectToDatabase()

        const event = await populateEvent({ query: Event.findById(eventId) })

        if (!event) throw new Error('Event not found')

        return JSON.parse(JSON.stringify(event))
    } catch (error) {
        handleError(error)
    }
}

// UPDATE
const updateEvent = async ({ userId, event, path }: UpdateEventParams) => {
    try {
        await connectToDatabase()

        console.log('Updating event:', event)
        const eventToUpdate = await Event.findById(event._id)
        if (!eventToUpdate) {
            console.error('Event not found:', event._id)
            throw new Error('Event not found')
        }

        console.log('Event organizer:', eventToUpdate.organizer)
        console.log('User ID:', userId)

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        )
        console.log('Event updated successfully:', updatedEvent)

        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedEvent))
    } catch (error) {
        console.error('Error updating event:', error)
        handleError(error)
    }
}

// DELETE
const deleteEvent = async ({ eventId, path }: DeleteEventParams) => {
    try {
        await connectToDatabase()

        const deletedEvent = await Event.findByIdAndDelete(eventId)
        if (deletedEvent) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

// GET ALL EVENTS
const getAllEvents = async ({ query, limit = 6, page, category }: GetAllEventsParams) => {
    try {
        await connectToDatabase()

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
            $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }

        const skipAmount = limit * (Number(page) - 1)

        console.log(skipAmount)
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent({ query: eventsQuery })
        const eventsCount = await Event.countDocuments(conditions)

        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit),
        }
    } catch (error) {
        handleError(error)
    }
}

// GET EVENTS BY ORGANIZER
const getEventsByUser = async ({ userId, limit = 6, page }: GetEventsByUserParams) => {
    try {
        await connectToDatabase()

        const conditions = { organizer: userId }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent({ query: eventsQuery })
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
const getRelatedEventsByCategory = async ({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) => {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent({ query: eventsQuery })
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

export {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventsByUser,
    getRelatedEventsByCategory,
}