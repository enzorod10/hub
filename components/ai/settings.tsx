'use client';

export const Settings = () => {
    return(
        <div className="w-full">
            <h1 className="text-xl font-bold mb-4">AI Settings</h1>
            <p className="text-gray-600 mb-2">Configure your AI preferences here.</p>
            <div className="bg-white p-4 rounded shadow">
                <label className="block mb-2">
                    <span className="text-gray-700">AI Model</span>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option>GPT-3.5</option>
                        <option>GPT-4</option>
                    </select>
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Response Length</span>
                    <input type="number" min="50" max="1000" defaultValue="200" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
                </label>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Settings</button>
            </div>
        </div>
    );
}
