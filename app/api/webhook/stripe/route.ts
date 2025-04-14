import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { updateOrderStatus } from '@/lib/actions/order.actions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

export async function POST(request: Request) {
    const body = await request.text();

    const sig = request.headers.get('stripe-signature') as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
        return NextResponse.json({ message: 'Webhook error', error: err });
    }

    const eventType = event.type;

   if (eventType === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // Retrieve the PaymentIntent
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

        const chargeId = paymentIntent.id;
        const amount = paymentIntent.amount / 100;
        const metadata = session.metadata; // Contains custom data like eventId

        // Use metadata to update event details or grant access
       // Use metadata to identify the order in the database
       const orderId = metadata?.orderId; // Assuming orderId is stored in metadata
       if (orderId) {
           // Update the order in MongoDB
           const updatedOrder = await updateOrderStatus({
               stripeId: chargeId,
               status: 'paid',
               amount,
           });

           console.log('Order updated:', updatedOrder);

           return NextResponse.json({ message: 'Charge succeeded', order: updatedOrder });
       }
    }

    return new Response('', { status: 200 });
}