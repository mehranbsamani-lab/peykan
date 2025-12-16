import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Landing } from './components/Landing';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <Landing />
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>
);