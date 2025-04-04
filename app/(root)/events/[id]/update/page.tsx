import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";
import { getEventById } from "@/lib/actions/event.actions";

type UpdateEventProps = {
    params: Promise<{
        id: string
    }>
}

const UpdateEventPage = async ({ params }: UpdateEventProps) => {
    const { id } = params;
    const { sessionClaims } = await auth();

    const userId = sessionClaims?.userId as string;
    const event = await getEventById(id);

    return (
        <>
            <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
                <h3 className='wrapper text-xl text-center sm:text-left'>Update Event</h3>
            </section>
            <div className='wrapper my-8'>
                <EventForm userId={userId} event={event} eventId={event._id} type={'Update'} />
            </div>
        </>
    );
}

export default UpdateEventPage;