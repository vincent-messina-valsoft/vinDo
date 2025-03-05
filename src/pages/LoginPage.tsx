import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to VinDo</h1>
          <p className="text-gray-600">Sign in to start organizing your tasks</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-xl shadow-lg",
              headerTitle: "text-2xl font-bold text-center",
              headerSubtitle: "text-gray-600 text-center",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
            }
          }}
        />
      </div>
    </div>
  );
}