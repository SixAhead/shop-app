import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { db } from './config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20' });

export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { items, currency = 'eur' } = data;
  let amountCents = 0;

  for (const { productId, qty } of items) {
    const snap = await db.collection('products').doc(productId).get();
    if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Product missing');
    const p = snap.data()!;
    if (!p.active) throw new functions.https.HttpsError('failed-precondition', 'Inactive product');
    amountCents += p.priceCents * qty;
  }

  const pi = await stripe.paymentIntents.create({ amount: amountCents, currency, automatic_payment_methods: { enabled: true } });
  return { clientSecret: pi.client_secret, amountCents };
});
