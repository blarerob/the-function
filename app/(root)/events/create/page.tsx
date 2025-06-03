import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const CreateEvent = async () => {
  const { userId } = await auth();

  if (!userId) {
    return <div>User not authenticated</div>;
  }

  return (
     <section className="bg-white text-gradient-to-r from-pink-500 via-purple-500
     to-blue-500 bg-dotted-pattern rounded-lg bg-cover shadow-md py-10 md:py-20 z-0">

          <video
             src="/createHero.mp4"
             className="absolute top-20 left-0 w-full h-60 object-cover shadow-xl shadow-black z-0"
             autoPlay
             loop
             muted
             playsInline
             style={{ zIndex: 0 }}
         />

         <div className="wrapper mt-50 my-12 p-8 bg-white rounded-3xl shadow-lg">
            <EventForm userId={userId} type="Create" />
        </div>
    </section>
  );
};

export default CreateEvent;