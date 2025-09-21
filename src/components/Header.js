import logo from '../assets/logo111.png';
import { IoMdSearch, IoMdMenu, IoMdClose } from "react-icons/io";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [searchButton, setSearchButton] = useState(false);
    const [query, setQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = () => {
      if (1===1) {
        navigate(`/searchpage?query=${encodeURIComponent(query)}`);
        setQuery('');
        }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSearch();
        setSearchButton(false);
        setQuery('');
      }
    };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
    return (
        <header className={`fixed w-full z-50 top-0 left-0 right-0 transition-all duration-300 ${scrolled ? 'bg-[#020c1b] shadow-lg' : 'bg-[#020c1b]/80 backdrop-blur-sm'}`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center py-3 relative'>
                    <Link to="/" className='flex items-center gap-2'>
                        <img src={logo} alt="YMDB Logo" className='h-8 sm:h-10 w-auto' />
                        <span className='font-extrabold text-2xl sm:text-3xl bg-gradient-to-r from-orange-400 to-orange-700 bg-clip-text text-transparent hover:from-orange-700 hover:to-orange-400 transition-all duration-300'>YMDB</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex items-center gap-6'>
                        <Link 
                            className='text-white/90 hover:text-orange-400 transition-colors duration-200 font-medium' 
                            to="/moviespage"
                        >
                            Movies
                        </Link>
                        <Link 
                            className='text-white/90 hover:text-orange-400 transition-colors duration-200 font-medium' 
                            to="/tvshowspage"
                        >
                            TV Shows
                        </Link>
                        <button 
                            className='text-white/90 hover:text-orange-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10' 
                            onClick={() => setSearchButton(true)}
                        >
                            <IoMdSearch className="text-xl" />
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className='flex items-center gap-4 md:hidden'>
                        <button 
                            className='text-white/90 hover:text-orange-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10' 
                            onClick={() => setSearchButton(true)}
                        >
                            <IoMdSearch className="text-xl" />
                        </button>
                        <button
                            className='text-white/90 hover:text-orange-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10'
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <IoMdClose className="text-xl" /> : <IoMdMenu className="text-xl" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`absolute top-full left-0 right-0 bg-[#020c1b] md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        <div className='px-4 py-3 space-y-3'>
                            <Link 
                                className='block text-white/90 hover:text-orange-400 transition-colors duration-200 font-medium py-2' 
                                to="/moviespage"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Movies
                            </Link>
                            <Link 
                                className='block text-white/90 hover:text-orange-400 transition-colors duration-200 font-medium py-2' 
                                to="/tvshowspage"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                TV Shows
                            </Link>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={`absolute left-0 right-0 bg-[#1a1f2b] transition-all duration-300 ease-in-out ${searchButton ? 'top-full opacity-100 visible' : '-top-full opacity-0 invisible'}`}>
                        <div className='flex items-center px-4 py-3'>
                            <input 
                                type="text" 
                                value={query} 
                                onChange={(e) => setQuery(e.target.value)} 
                                onKeyDown={handleKeyDown} 
                                placeholder='Search for movies or TV shows...' 
                                className='flex-1 bg-transparent text-white/90 px-4 py-2 focus:outline-none placeholder:text-white/50'
                            />
                            <button 
                                onClick={() => {
                                    setSearchButton(false);
                                    setQuery('');
                                }} 
                                className='p-2 text-white/90 hover:text-orange-400 transition-colors duration-200'
                            >
                                <IoMdClose className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}