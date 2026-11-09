import { Link } from "react-router";
import Header from "./Header";
import { Home } from "lucide-react";
import notFoundImage from "../assets/Letter O food.png"
export default function ErrorPage() {
    return (
        <>
            <Header />
            <div className="page_not_found h-[calc(100vh-64px)] bg-background flex  items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="404_container flex items-center gap-4">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">4</h1>
                        <img src={notFoundImage} alt={notFoundImage} className="w-28" />
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">4</h1>
                    </div>
                    <p className="text-text/75 text-center text-[13px] md:text-sm">Oops! we cannot find the page you are looking for</p>
                    <Link to={"/"} className="bg-primary flex items-center gap-2 text-sm px-6 py-2 rounded-md">Back To Home <Home className="w-5" /></Link>
                </div>
            </div>
        </>
    );
}
