import { createPayment } from "@/actions/paymentActions";
import { getOrCreateUser, updateUser } from "@/actions/userActions";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";

interface CheckoutSessionHandlerParams {
    session: Stripe.Checkout.Session;
    stripe: Stripe;
}

export async function handleCheckoutSessionCompleted({ session, stripe }: CheckoutSessionHandlerParams) {
    console.log("Checkout session completed", session);

    try {
        const customerId = session.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        const priceId = session.line_items?.data[0].price?.id;

        if ('email' in customer && priceId) {
            const { email, name } = customer as Stripe.Customer;

            const userResponse = await getOrCreateUser({
                email: email as string,
                fullName: name as string,
                customerId: customerId,
                priceId: priceId,
                status: "active",
            });

            if (!userResponse.success) {
                console.error("Failed to get or create user:", userResponse.error);
                throw new Error("Failed to get or create user");
            }

            const { amount_total, id, status } = session

            const receiptEmail = session.customer_details?.email;

            const paymentResponse = await createPayment({
                userId: userResponse.data!.id,
                priceId: priceId,
                status: status as Stripe.Checkout.Session.Status,
                amount: amount_total as number,
                stripePaymentId: id,
                userEmail: email as string,
                receiptEmail: receiptEmail as string,
            })

            if (!paymentResponse.success) {
                console.error("Failed to create payment:", paymentResponse.error);
                throw new Error("Failed to create payment");
            }

            console.log("User response:", userResponse);
            console.log("Payment response:", paymentResponse);
        } else {
            console.error("Customer email or priceId is missing");
            throw new Error("Customer email or priceId is missing");
        }

    } catch (error) {
        console.error("Error handling checkout session completion:", error);
        throw error;
    }
}

interface SubscriptionDeletedHandlerParams {
    subscriptionID: string;
    stripe: Stripe;
}

export async function handleSubscriptionDeleted({ subscriptionID, stripe }: SubscriptionDeletedHandlerParams) {
    console.log("Handling subscription deletion for ID:", subscriptionID);

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionID);
        const customerId = subscription.customer as string;

        const updateuserResponse = await updateUser({
            customerId: customerId,
            status: "inactive",
        });

        if (!updateuserResponse.success) {
            console.error("Failed to update user status:", updateuserResponse.error);
            throw new Error("Failed to update user status");
        }

        console.log("Subscription cancelled and user updated :", updateuserResponse);

    } catch (error) {
        console.error("Error handling subscription deletion:", error);
        throw error;
    }
}

