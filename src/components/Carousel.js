import React, { useEffect, useState } from 'react';
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

  const handleTrendingClick = (newType) => {
    setTrendingType(newType);
  };

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
        show: show 
      });
      setItems([]);
      setLoading(false);
      setError(`Unable to load similar content. Missing required data: ${!show?.id ? 'ID' : ''} ${!show?.media_type ? 'Media Type' : ''}`);
      return;
    }
    loadItems();
  }, [title, trendingType, similar, show?.media_type, show?.id]);

  const settings = {
    dots: false,
    infinite: items.length > 6,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: items.length > 6,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: items.length > 5,
          autoplay: items.length > 5
        }
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: items.length > 4,
          autoplay: items.length > 4
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: items.length > 3,
          autoplay: items.length > 3
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: items.length > 2,
          autoplay: items.length > 2
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px',
          infinite: items.length > 2,
          autoplay: items.length > 2
        }
      },
      {
        breakpoint: 480, // xs
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px',
          infinite: items.length > 1,
          autoplay: items.length > 1
        }
      },
    ],
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