import Link from "next/link";
import Image from "next/image";
import Collection from "@/components/shared/Collection";
import {getAllEvents} from "@/lib/actions/event.actions";

export default async function Home() {

    const events = await getAllEvents({
        query: '',
        category: '',
        page: 1,
        limit: 6,

    })
    console.log(events ? events : 'N/A');

        return(
            <>
                <section className='bg-gray-800 bg-dotted-pattern bg-contain py-5 md:py-10 overflow-hidden'>
                    <div className='wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0'>
                        <div className='flex flex-col justify-center gap-8'>
                            <h1 className='h1-bold-custom text-6xl'>
                                Connect and Celebrate: Your J-Town Events!
                            </h1>
                            <p className='p-regular-20 md:p-regular-24'>
                                Discover and explore events happening in J-Town. Browse through a list of events and find
                                one just for you and/or your family. Connect with people and come celebrate!
                            </p>
                            <button className='btn btn-md btn-jtown w-full sm:w-fit'>
                                <Link href='#events'>
                                        Explore Now
                                </Link>
                            </button>
                        </div>
                        <Image
                            src='/assets/images/hero.png'
                            alt='Hero Image'
                            width={500}
                            height={500}
                            className='max-h-[50vh] object-contain object-center'                            />
                    </div>
                </section>

                <section id='events' className='wrapper my-8 flex flex-col gap-2 md:gap-6 overflow-hidden'>
                    <h2 className='text-xl bold'>Trusted by <br/> Thousands of Events</h2>

                    <div className='flex w-full flex-col gap-2 md:flex-row'>
                        Search
                        Category Filter
                    </div>

                    <Collection
                        data={events?.data}
                        emptyTitle='No events found'
                        emptyStateSubtext='Check back later for more events'
                        collectionType='All_Events'
                        limit={6}
                        page={1}
                        totalPages={2}
                    />
                </section>
            </>
        )
    }
