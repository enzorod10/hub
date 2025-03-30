'use client';

export default function Home() {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Your Hub</h1>
        <p className="text-lg text-gray-600 mt-2">Your one-stop solution to everything.</p>
      </header>
      <main className="text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
          Sign in With Google
        </button>
      </main>
      <footer className="mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Hub. All rights reserved.
      </footer>
    </div>
  );
}