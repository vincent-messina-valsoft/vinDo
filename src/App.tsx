import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import MyDayView from './pages/MyDayView';
import ImportantView from './pages/ImportantView';
import NewListView from './pages/NewListView';
import { syncUserWithSupabase, supabase } from './lib/supabase';

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    // When user signs in, sync their data with Supabase
    if (isLoaded && isSignedIn && user) {
      console.log('User signed in with Clerk:', user.id);
      
      // Initialize Supabase auth for this user
      const setupAuth = async () => {
        try {
          // This is a workaround - in a real app you'd have a proper authentication flow
          // For this demo, we're setting the token directly using Clerk's ID
          await supabase.auth.signInWithPassword({
            email: user.primaryEmailAddress?.emailAddress || 'user@example.com',
            password: user.id // Using user ID as password for simplicity
          });
          
          console.log('Authenticated with Supabase');
          
          // After auth setup, sync the user data
          await syncUserWithSupabase(
            user.id,
            user.primaryEmailAddress?.emailAddress || ''
          );
        } catch (error) {
          console.error('Error setting up Supabase auth:', error);
        }
      };
      
      setupAuth();
    } else if (isLoaded && !isSignedIn) {
      console.log('User is not signed in');
      // Sign out from Supabase as well
      supabase.auth.signOut();
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <LandingPage />
            </SignedIn>
            <SignedOut>
              <LoginPage />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/my-day"
        element={
          <>
            <SignedIn>
              <MyDayView />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/important"
        element={
          <>
            <SignedIn>
              <ImportantView />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/new-list"
        element={
          <>
            <SignedIn>
              <NewListView />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;