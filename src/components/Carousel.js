import React, { useEffect, useState, useCallback } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Card from './Card';
import { fetchTrendingMovies, fetchTopRated, fetchSimilar } from '../services/api';

export default function Carousel({ title, type, similar, show }) {
  const [trendingType, setTrendingType] = useState(show?.media_type || 'movie');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slidesToShow, setSlidesToShow] = useState(1);

  const handleTrendingClick = (newType) => {
    setTrendingType(newType);
  };

  const calculateSlidesToShow = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 480) return 2;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    if (width <= 1280) return 4;
    if (width <= 1536) return 5;
    return 6;
  }, []);

  useEffect(() => {
    const updateSlides = () => {
      setSlidesToShow(calculateSlidesToShow());
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, [calculateSlidesToShow]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        let results = [];

        const mediaType = show?.media_type || trendingType;

        if (similar && show?.id && show?.media_type) {
          results = await fetchSimilar(show.media_type, show.id);
        } else if (title === 'Top Rated') {
          results = await fetchTopRated(mediaType);
        } else {
          results = await fetchTrendingMovies(trendingType);
        }
        console.log(`API Response (${title}):`, { results, mediaType, similar, showId: show?.id, showMediaType: show?.media_type });
        setItems(Array.isArray(results) ? results.filter(item => item.id !== show?.id) : []);
      } catch (err) {
        console.error(`Error loading ${title}:`, err.response?.data || err.message);
        setError(`Failed to load ${title.toLowerCase()}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    if (similar && (!show?.id || !show?.media_type)) {
      console.warn('Skipping similar fetch due to missing show data:', {
        showId: show?.id,
        mediaType: show?.media_type,
        show: show,
      });
      setItems([]);
      setLoading(false);
      setError(`Unable to load similar content. Missing required data: ${!show?.id ? 'ID' : ''} ${!show?.media_type ? 'Media Type' : ''}`);
      return;
    }

    loadItems();
  }, [title, trendingType, similar, show?.media_type, show?.id]);

  // Carousel settings
  const settings = {
    dots: false,
    infinite: items.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: items.length > slidesToShow,
    autoplaySpeed: 3000,
    centerMode: window.innerWidth <= 640,
    centerPadding: '40px',
  };

  return (
    <div className="my-8 px-8">
      {type === 'negative' ? null : (
        <div className="flex justify-between items-center mb-6 text-white">
          <h1 className="text-2xl sm:text-3xl">{title}</h1>
          <div className="relative flex px-1 rounded-full bg-white">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-orange-400 to-orange-700 rounded-full transition-transform duration-300 ease-in ${
                trendingType === 'movie' ? 'translate-x-0' : 'translate-x-[calc(100%-0.5rem)]'
              }`}
            ></div>
            <button
              onClick={() => handleTrendingClick('movie')}
              className={`relative z-10 px-6 rounded-full transition-colors ${
                trendingType === 'movie' ? 'text-white' : 'text-black'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => handleTrendingClick('tv')}
              className={`relative z-10 px-1 sm:px-8 py-[0.3rem] rounded-full transition-colors ${
                trendingType === 'tv' ? 'text-white' : 'text-black'
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>
      )}
      <div className="slider-container">
        {loading ? (
          <div className="text-center my-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400">No {title.toLowerCase()} available.</div>
        ) : (
          <Slider {...settings}>
            {items.map((item) => (
              <div key={item.id} className="px-2">
                <Card item={item} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}