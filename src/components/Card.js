import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { fetchGenres } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Card = ({ item }) => {
  const [genres, setGenres] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  // Handle movie or TV show attributes
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const percentage = item.vote_average.toFixed(1) * 10;

  // Fetch genres for movies or TV shows
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await fetchGenres(item.media_type); // Pass media_type
        const genreNames = item.genre_ids.map(id => 
          genreList.find(genre => genre.id === id)?.name || 'Unknown'
        );
        setGenres(genreNames);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    loadGenres();
  }, [item.genre_ids, item.media_type]);

  return (
      <div className="group cursor-pointer duration-300 hover:transform hover:scale-[1.02] transition-all" onClick={() => navigate("/moviedetailpage", { state: { item } })}>
        <div className="relative aspect-[2/3] w-full">
          <div className='overflow-hidden w-full h-full rounded-lg bg-white/5 backdrop-blur-sm'>
            <img
              src={item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : 'https://via.placeholder.com/780x1170?text=No+Image'}
              alt={title}
              className={`group-hover:scale-110 rounded-lg w-full h-full object-cover transition-all duration-500 ${loaded ? 'opacity-100 blur-0' : 'opacity-70 blur-lg'}`}
              onLoad={() => setLoaded(true)}
              loading="lazy"
              />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 rounded-lg">
            <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-12 h-12 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-2 translate-y-1/2 z-10 w-10 sm:w-12">
            <CircularProgressbar
              value={percentage}
              text={`${item.vote_average.toFixed(1)}`}
              background
              backgroundPadding={6}
              styles={buildStyles({
                backgroundColor: '#c05621',
                textColor: '#fff',
                pathColor: percentage >= 70 ? '#22c55e' : percentage >= 50 ? '#eab308' : '#ef4444',
                trailColor: 'transparent',
                textSize: '32px',
              })}
            />
          </div>
          <div className='absolute bottom-2 right-2 z-10 flex flex-col gap-1 items-end'>
            {genres.slice(0, 2).map((genre, index) => (
              <span 
                key={index} 
                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-amber-800/90 text-white/90 backdrop-blur-sm truncate max-w-[80px] sm:max-w-[120px]"
              >
                {genre}
              </span>
            ))}</div>
        </div>
        <div className="text-white mt-6 px-1">
          <h2 className="font-bold text-base sm:text-lg truncate group-hover:text-orange-400 transition-colors duration-300">{title}</h2>
          <p className="text-sm text-gray-400 font-medium mt-1">
            {releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}
          </p>
        </div>
      </div>
  );
};

export default Card;