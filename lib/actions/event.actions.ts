'use server'

import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose';
import {connectToDatabase} from '@/lib/database'
import Event from '@/lib/database/models/event.model'
import User from '@/lib/database/models/user.model'
import Category from '@/lib/database/models/category.model'
import { handleError } from '@/lib/utils'

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

const populateEvent = (query: ReturnType<typeof Event.find>) => {
    return query
        .populate({ path: 'firstName', model: User, select: 'firstName' })
        .populate({ path: 'lastName', model: User, select: 'lastName' })
        .populate({ path: 'category', model: Category, select: '_id name' });
}

// CREATE
export async function createEvent({ event, path }: CreateEventParams) {
    try {
        await connectToDatabase()

       /* const organizer = await User.findOne(firstName)
        if (!organizer) throw new Error('Organizer not found')*/

        const newEvent = await Event.create({ ...event, category: event.categoryId })
        revalidatePath(path)

        return JSON.parse(JSON.stringify(newEvent))
    } catch (error) {
        handleError(error)
    }
}

// GET ONE EVENT BY ID
export async function getEventById(eventId: string) {
    try {
        await connectToDatabase();

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            throw new Error('Invalid event ID');
        }

        const event = await Event.findById(eventId)
            .populate({ path: 'firstName', model: User, select: 'firstName' })
            .populate({ path: 'lastName', model: User, select: 'lastName' })
            .populate({ path: 'category', model: Category, select: '_id name' })

        if (!event) throw new Error('Event not found');

        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        handleError(error);
    }
}
// UPDATE
export async function updateEvent({event, path }: UpdateEventParams) {
    try {
        await connectToDatabase();

        const eventToUpdate = await Event.findById(event._id);
        if (!eventToUpdate) {
            throw new Error('Event not found');
        }

        /*if (!eventToUpdate.organizer || eventToUpdate.organizer.toHexString() !== userId) {
            throw new Error('Unauthorized');
        }*/

        const updatedEvent = await Event.findByIdAndUpdate(
            event._id,
            { ...event, category: event.categoryId },
            { new: true }
        );
        revalidatePath(path);

        return JSON.parse(JSON.stringify(updatedEvent));
    } catch (error) {
        handleError(error);
    }
}

// DELETE
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
    try {
        await connectToDatabase()

        const deletedEvent = await Event.findByIdAndDelete(eventId)
        if (deletedEvent) revalidatePath(path)
    } catch (error) {
        handleError(error)
    }
}

// GET ALL EVENTS
export async function getAllEvents({ query, limit = 6, page, category }: GetAllEventsParams) {
    try {
        await connectToDatabase()

        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const conditions = {
            $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
        }

        const skipAmount = (Number(page) - 1) * limit
        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
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
export async function getEventsByUser({ email, limit = 6, page }: GetEventsByUserParams) {
    try {
        await connectToDatabase()

        const conditions = { organizer: email }
        const skipAmount = (page - 1) * limit

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedEventsByCategory({
    categoryId,
    eventId,
    limit = 3,
    page = 1,
}: GetRelatedEventsByCategoryParams) {
    try {
        await connectToDatabase()

        const skipAmount = (Number(page) - 1) * limit
        const conditions = { $and: [{ category: categoryId }, { _id: { $ne: eventId } }] }

        const eventsQuery = Event.find(conditions)
            .sort({ createdAt: 'desc' })
            .skip(skipAmount)
            .limit(limit)

        const events = await populateEvent(eventsQuery)
        const eventsCount = await Event.countDocuments(conditions)

        return { data: JSON.parse(JSON.stringify(events)), totalPages: Math.ceil(eventsCount / limit) }
    } catch (error) {
        handleError(error)
    }
}