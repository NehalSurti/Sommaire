import Stripe from "stripe";

export async function handleCheckoutSessionCompleted({ session }: { session: Stripe.Checkout.Session }) {
    console.log("Checkout session completed", session);
}

export async function createOrUpdateUser () {
try{

}catch(error){

}
}