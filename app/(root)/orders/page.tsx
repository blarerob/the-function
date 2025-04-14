'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrdersByUser } from '@/lib/actions/order.actions';
import { IOrderItem } from '@/lib/database/models/order.model';
import { formatDateTime, formatPrice } from '@/lib/utils';

const Orders = () => {
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || ''; // Extract userId from query params

    const [tickets, setTickets] = useState<IOrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const response = await getOrdersByUser({ firstName: userId, limit: 10, page: 1 });
                if (response && response.data) {
                    setTickets(response.data);
                } else {
                    setTickets([]); // Handle case where response is undefined or has no data
                }
            } catch (error) {
                console.error('Error fetching tickets:', error);
                setTickets([]); // Handle error case
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [userId]);

    return (
        <section className="wrapper">
            <h2 className="text-xl font-bold mb-4">Purchased Tickets</h2>
            {loading ? (
                <p>Loading...</p>
            ) : tickets.length === 0 ? (
                <p>No tickets found.</p>
            ) : (
                <ul className="space-y-4">
                    {tickets.map((ticket) => (
                        <li key={ticket._id} className="p-4 border rounded-lg">
                            <h3 className="text-lg font-semibold">{ticket.eventTitle}</h3>
                            <p>Buyer: {ticket.buyer}</p>
                            <p>Amount: {formatPrice(ticket.totalAmount)}</p>
                            <p>Status: <span className={ticket.status === 'paid' ? 'text-green-500' : 'text-red-500'}>{ticket.status}</span></p>
                            <p>Purchased On: {formatDateTime(ticket.createdAt).dateTime}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Orders;