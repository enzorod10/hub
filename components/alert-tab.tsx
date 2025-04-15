import React from 'react';

export default function AlertTab() {
    return (
      <div className="flex w-full justify-between border border-red-500 border-4 p-3 bg-gray-100 text-secondary">
        <div className='flex-1 border'>
            <div className="flex-1 whitespace-nowrap animate-marquee">
                <span className="inline-block px-6">Red Sox 5 - Yankees 3</span>
                <span className="inline-block px-6">Dodgers 2 - Giants 1</span>
                <span className="inline-block px-6">Mets 4 - Phillies 4 (Final/10)</span>
            </div>
        </div>
        <div className='w-48 border'>
            2nd part
        </div>
      </div>
    );
}