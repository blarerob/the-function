import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from '@/components/shared/Collection'
import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions';
import Link from 'next/link'

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page: string; query: string; category: string }>;
}

export default async function Home({ searchParams }: Props) {
    const awaitedSearchParams = await searchParams;
    const page = Number(awaitedSearchParams?.page) || 1;
    const searchText = (awaitedSearchParams?.query as string) || '';
    const category = (awaitedSearchParams?.category as string) || '';

    const events = await getAllEvents({
        query: searchText,
        category,
        page,
        limit: 6
    })

    return (
        <>
            <section className="bg-gradient-to-r from-purple-500 via-pink-500 to-white bg-dotted-pattern bg-cover py-10 md:py-20">
               <div className="wrapper grid grid-cols-1 gap-8 md:grid-cols-2 2xl:gap-12 items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col justify-center items-center md:items-start mt-14 gap-6 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
                           Create &gt; Share &gt; Invite.
                        </h1>
                        <p className="text-2xl font-bold text-white max-w-md">
                            It`&apos;`s really that simple with Functions!
                        </p>

                        <div className="flex flex-col h-20 ml-0 md:ml-4 justify-between items-center md:items-start">
                            <div />
                            <div className="flex justify-center md:justify-start mt-3 w-full items-center">
                                <Button
                                    size="lg"
                                    asChild
                                    className="button w-full xs:w-48 sm:w-fit bg-white text-purple-600 hover:bg-purple-600 hover:text-white transition-transform transform hover:scale-105"
                                >
                                    <Link href="#events">
                                        Explore Now
                                    </Link>
                                </Button>
                                <div className="mx-4 h-13 w-px bg-white block" />
                                <Button
                                    size="lg"
                                    asChild
                                    className="button w-full xs:w-48 sm:w-fit bg-purple-600 text-white hover:bg-white hover:text-purple-600 transition-transform transform hover:scale-105"
                                >
                                    <Link href="/events/create">
                                        Create Now
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <video
                        src="/animated.mp4"
                        className="max-h-[70vh] object-contain object-center rounded-lg shadow-sm transform hover:scale-105 transition-transform duration-500 bg-transparent opacity-85 mx-auto"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </section>

            <section id="events" className="wrapper my-12 flex flex-col gap-12">
                <h2 className="text-3xl font-bold text-center text-purple-700">
                    Trusted by Thousands of Events
                </h2>

                <div className="flex w-full flex-col gap-6 md:flex-row">
                    <Search />
                    <CategoryFilter />
                </div>

                <Collection
                    data={events?.data}
                    emptyTitle="No Events Found"
                    emptyStateSubtext="Check back later"
                    collectionType="All_Events"
                    limit={6}
                    page={page}
                    totalPages={events?.totalPages}
                />
            </section>
        </>
    )
}