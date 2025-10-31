import { handleCheckoutSessionCompleted, handleSubscriptionDeleted } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // Secret key

export const POST = async (request: NextRequest) => {

    const payload = await request.text();

    const sig = request.headers.get('stripe-signature');

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);

        switch (event.type) {
            case 'checkout.session.completed':
                console.log("Checkout session completed");
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId, {
                    expand: ['line_items']
                })

                await handleCheckoutSessionCompleted({ session, stripe });

                console.log(sessionId);
                break;
            case 'customer.subscription.deleted':
                console.log("Customer Subscription Deleted");
                const subscription = event.data.object;
                const subscriptionID = event.data.object.id;

                await handleSubscriptionDeleted({ subscriptionID, stripe });

                console.log(subscription);
                break;
            default:
                console.log(`unhandled event type ${event.type}`)
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: 'Failed to trigger webhook', err }, { status: 400 });
    }

    return NextResponse.json({ status: 'success' })
}
