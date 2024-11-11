import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY){
    throw new Error(
        "Stripe SECRET KEY IS MISSING. Please set the environment variable."
    );
}

const stripe = new Stripe(process.env.STRIPE_SECRETKEY!)


export default stripe;