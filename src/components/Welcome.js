import bgImage from '../assets/bg-image.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
        navigate(`/searchpage?query=${encodeURIComponent(search)}`);
        setSearch('');
        }
    };

    return (
        <div
            className="w-full bg-poster relative"
        >
            <div className="w-full justify-center items-center flex z-4 h-full">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 md:py-24 text-white text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4">Welcome to YMDB</h1>
                    <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">Your ultimate movie and TV show database.</p>

                    <div className="mt-8 flex items-center justify-center px-4 sm:px-6">
                        <form onSubmit={handleSearch} className="flex items-center w-full max-w-3xl">
                            <input
                                type="text"
                                placeholder="Search for a movie or a TV show..."
                                className="pl-2 md:pl-4 text-xs text-black font-normal h-12 sm:h-14 rounded-l-full focus:outline-none focus:ring-2 focus:ring-orange-500 flex-1 min-w-0"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="content-center font-medium whitespace-nowrap rounded-r-full h-12 sm:h-14 px-4 sm:px-8 focus:outline-none focus:ring-2 focus:ring-orange-700 transition-all duration-300 bg-gradient-to-r from-orange-400 to-orange-700 hover:from-orange-700 hover:to-orange-400"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}