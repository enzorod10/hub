// import ChatPage from "./components/ai-chat";
import Weather from "./components/weather";
import Welcome from "./components/welcome";

export default function Home() {
    return (
        <div className="w-full">
            <div className="border rounded-md w-full">
                <Welcome/>
                <Weather />
                {/* <ChatPage /> */}
            </div>
            
        </div>
    );
}