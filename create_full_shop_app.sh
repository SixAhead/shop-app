#!/bin/bash
mkdir -p shop-app/apps/mobile/app/public shop-app/apps/mobile/app/account shop-app/apps/mobile/app/admin shop-app/apps/mobile/assets shop-app/apps/mobile/components shop-app/apps/mobile/hooks shop-app/apps/mobile/lib shop-app/apps/mobile/admin

mkdir -p shop-app/server/functions/src
mkdir -p shop-app/.github/workflows

# Starter Layout
cat <<EOL > shop-app/apps/mobile/app/_layout.tsx
import { Stack } from 'expo-router';
export default function Layout() {
  return <Stack />;
}
EOL

# Home Screen
cat <<EOL > shop-app/apps/mobile/app/index.tsx
import { View, Text } from 'react-native';
export default function Home() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Welcome to the Shop App</Text>
    </View>
  );
}
EOL

# Category Page
mkdir -p shop-app/apps/mobile/app/categories
cat <<EOL > shop-app/apps/mobile/app/categories/[slug].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
export default function Category() {
  const { slug } = useLocalSearchParams();
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Category: {slug}</Text>
    </View>
  );
}
EOL

# Product Page
mkdir -p shop-app/apps/mobile/app/products
cat <<EOL > shop-app/apps/mobile/app/products/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
export default function Product() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Product ID: {id}</Text>
    </View>
  );
}
EOL

# Cart
mkdir -p shop-app/apps/mobile/app/cart
cat <<EOL > shop-app/apps/mobile/app/cart/index.tsx
import { View, Text } from 'react-native';
export default function Cart() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Your Cart is Empty</Text>
    </View>
  );
}
EOL

# Checkout
mkdir -p shop-app/apps/mobile/app/checkout
cat <<EOL > shop-app/apps/mobile/app/checkout/index.tsx
import { View, Text } from 'react-native';
export default function Checkout() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Checkout</Text>
    </View>
  );
}
EOL

# Admin Pages
mkdir -p shop-app/apps/mobile/app/admin
cat <<EOL > shop-app/apps/mobile/app/admin/add-product.tsx
import { View, Text } from 'react-native';
export default function AddProduct() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Add Product Screen</Text>
    </View>
  );
}
EOL

cat <<EOL > shop-app/apps/mobile/app/admin/products.tsx
import { View, Text } from 'react-native';
export default function AdminProducts() {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Admin Product List</Text>
    </View>
  );
}
EOL

# Firebase Init
cat <<EOL > shop-app/apps/mobile/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
EOL

# Stripe Provider Wrapper
cat <<EOL > shop-app/apps/mobile/lib/stripe.ts
import { StripeProvider } from '@stripe/stripe-react-native';
import React from 'react';

export default function withStripeProvider(Component: React.ComponentType) {
  return function ProviderWrapper(props: any) {
    return (
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK!}>
        <Component {...props} />
      </StripeProvider>
    );
  };
}
EOL

# Package.json (minimal)
cat <<EOL > shop-app/apps/mobile/package.json
{
  "name": "shop-app-mobile",
  "main": "expo-router/entry",
  "private": true,
  "dependencies": {
    "expo": "^53.0.0",
    "expo-router": "^3.4.0",
    "firebase": "^9.0.0",
    "@stripe/stripe-react-native": "^0.30.0",
    "react": "19.0.0",
    "react-native": "0.79.0"
  }
}
EOL

# app.json
cat <<EOL > shop-app/apps/mobile/app.json
{
  "expo": {
    "name": "Shop App",
    "slug": "shop-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOL

# Server-side: Firebase Functions (Stripe + Admin Claims)
cat <<EOL > shop-app/server/functions/src/config.ts
import * as admin from 'firebase-admin';
admin.initializeApp();
export const db = admin.firestore();
EOL

cat <<EOL > shop-app/server/functions/src/stripeCreatePI.ts
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
EOL

cat <<EOL > shop-app/server/functions/src/adminClaims.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setAdminClaim = functions.https.onCall(async (data, context) => {
  if (context.auth?.token.email !== process.env.ADMIN_EMAIL) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
  return { message: `User ${uid} is now admin.` };
});
EOL

# Server package.json
cat <<EOL > shop-app/server/functions/package.json
{
  "name": "shop-app-functions",
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.0.0",
    "firebase-functions": "^4.0.0",
    "stripe": "^14.0.0"
  }
}
EOL

echo "✅ Full project with Expo app and Firebase Functions starter created!"