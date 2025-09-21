import Welcome from "./Welcome";
import bgImage from '../assets/bg-image.png';
import Carousel from "./Carousel";
import Card from "./Card";

export default function HomePage() {
    return (
        <div className="mx-auto min-h-screen flex flex-col bg-[#04152d]">
            <Welcome />
            <div className="w-full xl:px-40">
                <Carousel title="Trending" type="active" similar={false} show={null}/>
                <Carousel title="Top Rated" type="active" similar={false} show={null}/>
            </div>
        </div>
    );
}