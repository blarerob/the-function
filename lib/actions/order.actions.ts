"use server"

import mongoose from 'mongoose';
import Stripe from 'stripe';
import { CheckoutOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';
import {ObjectId} from 'mongodb';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const price = order.isFree ? 0 : Number(order.price) * 100;

    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        unit_amount: price,
                        product_data: {
                            name: order.eventTitle
                        }
                    },
                    quantity: 1
                },
            ],
            metadata: {
                eventId: order.eventId,
                buyerId: order.buyerId,
            },
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        });

        redirect(session.url!)
    } catch (error) {
        throw error;
    }
}

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id) && /^[a-fA-F0-9]{24}$/.test(id);
};

export const createOrder = async () => {
        await connectToDatabase(); // Ensure the database connection is established

    const buyerId = "brobinson"; // Replace with the actual buyer ID string
    const eventId = "67ef754accf590329e263d3d"; // Replace with the actual event ID

    try {
        if (!isValidObjectId(eventId) || !isValidObjectId(buyerId)) {
            throw new Error("Invalid ObjectId format for eventId or buyerId");
        }

        const order = await Order.create({
            stripeId: "someStripeId",
            totalAmount: "100.00",
            event: new mongoose.Types.ObjectId(eventId),
            buyer: new mongoose.Types.ObjectId(buyerId),
        });

        console.log("Order created:", order);
    } catch (error) {
        console.error("Error creating order:", error);
    }
};

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
    try {
        await connectToDatabase()

        if (!eventId) throw new Error('Event ID is required')
        const eventObjectId = new ObjectId(eventId)

        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                },
            },
            {
                $unwind: '$buyer',
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            {
                $unwind: '$event',
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    createdAt: 1,
                    eventTitle: '$event.title',
                    eventId: '$event._id',
                    buyer: '$buyer.email'
                },
            },
            {
                $match: {
                    $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
                },
            },
        ])

        return JSON.parse(JSON.stringify(orders))
    } catch (error) {
        handleError(error)
    }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ firstName, email, limit = 3, page }: GetOrdersByUserParams) {
    try {
        await connectToDatabase();

        const skipAmount = (Number(page) - 1) * limit;

     const conditions: Record<string, { $regex: RegExp }> = {};

     if (firstName && typeof firstName === 'string') {
         conditions['buyer.firstName'] = { $regex: new RegExp(firstName, 'i') };
     }
     if (email && typeof email === 'string') {
         conditions['buyer.email'] = { $regex: new RegExp(email, 'i') };
     }

        const orders = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer',
                    foreignField: '_id',
                    as: 'buyer',
                },
            },
            {
                $unwind: '$buyer',
            },
            {
                $project: {
                    _id: 1,
                    totalAmount: 1,
                    createdAt: 1,
                    eventTitle: '$event.title',
                    eventId: '$event._id',
                    firstName: '$buyer.firstName',
                    email: '$buyer.email',
                },
            },
            {
                $match: conditions,
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: skipAmount,
            },
            {
                $limit: limit,
            },
        ]);

        const ordersCount = await Order.countDocuments(conditions);

        return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) };
    } catch (error) {
        handleError(error);
    }
}

export async function updateOrderStatus({ stripeId, status, amount }: { stripeId: string; status: string; amount: number }) {
    try {
        await connectToDatabase();

        const updatedOrder = await Order.findOneAndUpdate(
            { stripeId },
            { status, totalAmount: amount },
            { new: true }
        );

        return updatedOrder;
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}