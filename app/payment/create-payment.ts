import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      // Validate the amount
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });

      return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error('Error creating payment intent:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
}
