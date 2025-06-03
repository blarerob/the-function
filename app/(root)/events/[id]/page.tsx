import CheckoutButton from '@/components/shared/CheckoutButton';
import Collection from '@/components/shared/Collection';
import { getEventById, getRelatedEventsByCategory } from '@/lib/actions/event.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  params: Promise<{ id: string, firstName?: string, lastName?: string }>;
  searchParams: Promise<{ page: string }>;
}

const EventDetails = async ({ params, searchParams }: Props) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const event = await getEventById(resolvedParams.id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: resolvedSearchParams.page as string,
  });

  return (
    <>
      <section className="flex justify-center bg-gradient-to-b from-pink-300 via-purple-100 to-white p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            width={1000}
            height={1000}
            className="h-full min-h-[300px] object-cover object-center rounded-3xl shadow-lg hover:scale-105 transition-transform duration-300"
          />

          <div className="flex w-full flex-col gap-8 p-2 md:p-10 bg-white rounded-3xl shadow-lg">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl font-extrabold text-purple-700">{event.title}</h2>
                <div className="text-sm text-gray-400 absolute mt-10 sm:flex-row sm:items-center">
                  <p className="ml-2 sm:mt-0">
                    Function Host:{' '}
                    <span>{event.firstName} {event.lastName}</span>
                  </p>
                </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="mt-5 flex gap-3">
                  <p className="p-bold-20 rounded-md justify-center bg-pink-300 px-5 py-2 text-white shadow-md">
                    {event.isFree ? 'FREE' : `$${event.price}`}
                  </p>

                </div>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3 items-center">
                <Image src="/assets/icons/calendar.svg" alt="calendar" width={32}
                       height={32} className="filter-pink" />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} - {' '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -  {' '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image src="/assets/icons/location.svg" alt="location" width={32}
                       height={32} className="filter-pink" />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold text-purple-700">Fun at the Function:</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="text-3xl font-bold text-center text-purple-700">Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="No Events Found"
          emptyStateSubtext="Check back later"
          collectionType="All_Events"
          limit={3}
          page={resolvedSearchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetails;