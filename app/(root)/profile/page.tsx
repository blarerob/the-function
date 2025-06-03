import Collection from '@/components/shared/Collection';
import { Button } from '@/components/ui/button';
import { getEventsByUser } from '@/lib/actions/event.actions';
import { getOrdersByUser } from '@/lib/actions/order.actions';
import { IOrder } from '@/lib/database/models/order.model';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ordersPage: string; eventsPage: string; category: string }>;
}

const ProfilePage = async ({ searchParams }: Props) => {
  const awaitedSearchParams = await searchParams;

  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(awaitedSearchParams?.ordersPage) || 1;
  const eventsPage = Number(awaitedSearchParams?.eventsPage) || 1;

  const orders = await getOrdersByUser({ userId, page: ordersPage });
  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });

  return (
    <>
      {/* My Tickets */}
      <section className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-5 md:py-2 h-45 text-white">
        <div className="wrapper flex flex-col items-center gap-4">
          <h3 className="text-3xl font-extrabold text-center drop-shadow-md">
            My Tickets
          </h3>
          <Collection
              data={orderedEvents}
              emptyTitle="No event tickets purchased yet"
              emptyStateSubtext="No worries - plenty of exciting events to explore!"
              collectionType="My_Tickets"
              limit={3}
              page={ordersPage}
              urlParamName="ordersPage"
              totalPages={orders?.totalPages}
          />
        </div>
      </section>

     <section className="wrapper flex justify-center items-center my-10 p-6 bg-white rounded-3xl shadow-lg">
       <Button asChild size="lg" className="button bg-purple-500 text-white items-center hover:bg-pink-500 mb-8 transition-all">
         <Link href="/#events">Explore More Events</Link>
       </Button>
     </section>

      {/* Events Organized */}
<section className="bg-white py-10 md:py-16 text-[linear-gradient(to_right,_#3b82f6,_#a21caf,_#ec4899)]">
  <div className="wrapper flex flex-col items-center gap-4">
          <h3 className="text-3xl font-extrabold text-center drop-shadow-md">
            Events Organized
          </h3>
          <Button asChild size="lg" className="button bg-white text-purple-500 hover:bg-purple-100 transition-all">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8 p-6 bg-white rounded-3xl shadow-lg">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;