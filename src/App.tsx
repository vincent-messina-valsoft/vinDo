import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import MyDayView from './pages/MyDayView';
import ImportantView from './pages/ImportantView';
import NewListView from './pages/NewListView';
import { syncUserWithSupabase } from './lib/supabase';

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  
  useEffect(() => {
    // When user signs in, sync their data with Supabase
    if (isLoaded && isSignedIn && user) {
      const syncUser = async () => {
        try {
          await syncUserWithSupabase(
            user.id,
            user.primaryEmailAddress?.emailAddress || ''
          );
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      };
      
      syncUser();
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