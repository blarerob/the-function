import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder } from '@/lib/database/models/order.model'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async () => {
    let firstName;

    const orders = await getOrdersByUser({ firstName, page: 1 });
    console.log("Orders:", orders);

    const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
    console.log("Orders Data:", orders?.data);
    console.log("Ordered Events:", orderedEvents);
    const organizedEvents = await getEventsByUser({ firstName, page: 1 });
    console.log({orderedEvents});
    return (
        <>
            {/* My Tickets */}
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className='text-2xl font-bold text-center sm:text-left'>My Tickets</h3>
                    <Button asChild size="lg" className="button hidden sm:flex">
                        <Link href="/#events">
                            Explore More Events
                        </Link>
                    </Button>
                </div>
            </section>

           <section className="wrapper my-8">
                <Collection
                    data={orderedEvents}
                    emptyTitle="No event tickets purchased yet"
                    emptyStateSubtext="No worries - plenty of exciting events to explore!"
                    collectionType="My_Tickets"
                    limit={3}
                    page={1}
                    urlParamName="ordersPage"
                    totalPages={2}
                />
            </section>

            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <div className="wrapper flex items-center justify-center sm:justify-between">
                    <h3 className='text-3xl font-bold text-center sm:text-left'>Events Organized</h3>
                    <Button asChild size="lg" className="button hidden sm:flex">
                        <Link href="/events/create">
                            Create New Event
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="wrapper my-8">
                <Collection
                    data={organizedEvents?.data}
                    emptyTitle="No events have been created yet"
                    emptyStateSubtext="Go create some now"
                    collectionType="Events_Organized"
                    limit={3}
                    page={1}
                    urlParamName="eventsPage"
                    totalPages={organizedEvents?.totalPages}
                />
            </section>
        </>
    )
}

export default ProfilePage