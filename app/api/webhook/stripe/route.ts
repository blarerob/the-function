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

        // Retrieve the PaymentIntent to get the amount
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

        const charge = paymentIntent.latest_charge; // Access the first charge
        console.log('charge:', charge);
        const chargeId = paymentIntent.id; // Get the charge ID
        const amount = paymentIntent.amount / 100; // Convert amount to dollars
        const metadata = session.metadata; // Metadata sent during session creation

        console.log('Charge succeeded:', chargeId, amount, metadata);

        // Update the database to mark the order as paid
        const updatedOrder = await updateOrderStatus({
            stripeId: chargeId,
            status: 'paid',
            amount,
        });

        return NextResponse.json({ message: 'Charge succeeded', order: updatedOrder });
    }

    return new Response('', { status: 200 });
}