import React from 'react';
import prisma from "@/utils/db";

const getAllOffers = async () => {
    //  await prisma.offer.create({
    //     data: {
    //         message: 'Sell your home',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         email: '',
    //         phone: '',
    //     },
    // })

    // await prisma.offer.update({
    //     where: {
    //         id: 16,
    //     },
    //     data: {
    //         message: 'House is sold',
    //     }
    // })

    // await prisma.offer.delete({
    //     where: {
    //         id: 16,
    //     }
    // })

    const allOffers = prisma.offer.findMany()
    return allOffers;

/*    await prisma.task.update({
        where: {
            id: "25cab9d0-fcec-453b-b9bc-a44281463755",
        },
        data : {
            content: 'buy milk done',
        }
    })

    await prisma.task.delete({
        where: {
            id: "25cab9d0-fcec-453b-b9bc-a44281463755",
        },
    })*/

    /*const allOffers = await prisma.offer.findMany();
    return ; */
};

const Prisma = async () => {
    const offers = await getAllOffers();
    return (
        <div>
            <h1 className="text-7xl">Offers</h1>
            {offers?.map((offer: { id: React.Key | null | undefined; message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<never>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<never>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => (
                <h1 key={offer.id}>{offer.message}</h1>
            ))}
        </div>
    )

    /*const offers =  await getAllOffers();

    return (
        <div>
            <h1 className="text-7xl">Offers</h1>
            {offers?.map((offer) => (
                <h1 key={offer.id}>{offer.content}</h1>
            ))}
        </div>)*/
};
/*const getAllTasks = async () => {
    await prisma.task.create({
        data: {
            content: 'Homes',
        },
    })

   await prisma.task.update({
        where: {
            id: "25cab9d0-fcec-453b-b9bc-a44281463755",
        },
        data : {
            content: 'buy milk done',
        }
    })

    await prisma.task.delete({
        where: {
            id: "25cab9d0-fcec-453b-b9bc-a44281463755",
        },
    })

    const allTasks = await prisma.task.findMany();
    return allTasks;
};

const Prisma = async () => {
     const tasks =  await getAllTasks();

       return (
    <div>
    <h1 className="text-7xl">Tasks</h1>
    {tasks?.map((task) => (
    <h1 key={task.id}>{task.content}</h1>
    ))}
       </div>)
};*/

export default Prisma;