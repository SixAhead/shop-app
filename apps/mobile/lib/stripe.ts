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
