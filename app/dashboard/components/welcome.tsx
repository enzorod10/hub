'use client';

export default function Welcome() {
    
    return (
        <div className="p-4 w-full">
            <div className="text-2xl font-bold mb-4">
                Welcome to your dashboard!
            </div>
            <div className="text-lg mb-2">
                Today is: {new Date().toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}            
            </div>
        </div>
    );
  }