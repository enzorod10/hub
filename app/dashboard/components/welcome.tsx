'use client';

// import ChatPage from "./components/ai-chat";
export default function Welcome({ name }: { name?: string }) {

    const today = new Date()
    const curHr = today.getHours()

    let greet = 'Hello, ' + name

    if (curHr < 12) {
        greet = 'Good Morning, ' + name
    } else if (curHr < 18) {
        greet = 'Good Afternoon, ' + name
    } else {
        greet = 'Good Evening, ' + name
    }

    return (
        <div className="flex flex-col justify-around">
            <div className="text-2xl">
                {greet}
            </div>
        </div>
    );
}