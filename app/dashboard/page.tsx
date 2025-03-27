import MainArea from "./components/main-area";
import Weather from "./components/weather";

export default function Home() {
    return (
        <div >
            <Weather />
            <MainArea />
        </div>
    );
}