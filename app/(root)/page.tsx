import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from '@/components/shared/Collection'
import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions';
import Image from 'next/image'
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
            <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
                <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
                    <div className="flex flex-col justify-center gap-8">
                        <h1 className="text-4xl font-bold">Connect and Celebrate: Your J-Town Events!</h1>
                        <p className="p-regular-20 md:p-regular-24"> Discover and explore events happening in J-Town. Browse through a list of events and find
                            one just for you and/or your family. Connect with people and come celebrate!</p>
                        <Button size="lg" asChild className="button w-full sm:w-fit">
                            <Link href="#events">
                                Explore Now
                            </Link>
                        </Button>
                    </div>

                    <Image
                        src="/assets/images/hero.png"
                        alt="hero"
                        width={1000}
                        height={1000}
                        className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
                    />
                </div>
            </section>

            <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
                <h2 className="text-xl font-bold">Trust by <br /> Thousands of Events</h2>

                <div className="flex w-full flex-col gap-5 md:flex-row">
                    <Search />
                    <CategoryFilter />
                </div>

                <Collection
                    data={events?.data}
                    emptyTitle="No Events Found"
                    emptyStateSubtext="Come back later"
                    collectionType="All_Events"
                    limit={6}
                    page={page}
                    totalPages={events?.totalPages}
                />
            </section>
        </>
    )
}