'use client';

export default function MainArea() {
    
    return (
        <div className="flex flex-col border rounded-md p-4 max-w-sm w-full">
            Your tasks for today include:
            <ul className="list-disc pl-5">
                <li>Task 1</li>
                <li>Task 2</li>
                <li>Task 3</li>
                <li>Task 4</li>
                <li>Task 5</li>
                <li>Task 6</li>
                <li>Task 7</li>
            </ul>
            <p className="mt-4">You can add new tasks by clicking the button below:</p>
            <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
                Add Task
            </button>
            <p className="mt-4">You can also delete tasks by clicking the button below:</p>
            <button className="mt-2 bg-red-500 text-white py-2 px-4 rounded">
                Delete Task
            </button>
            <p className="mt-4">You can mark tasks as complete by clicking the button below:</p>
            <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded">
                Mark as Complete
            </button>
            <p className="mt-4">You can view your completed tasks by clicking the button below:</p>
            <button className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded">
                View Completed Tasks
            </button>
            <p className="mt-4">You can view your pending tasks by clicking the button below:</p>
            <button className="mt-2 bg-purple-500 text-white py-2 px-4 rounded">
                View Pending Tasks
            </button>
            <p className="mt-4">You can view your all tasks by clicking the button below:</p>
            <button className="mt-2 bg-gray-500 text-white py-2 px-4 rounded">
                View All Tasks
            </button>
        </div>
    );
  }