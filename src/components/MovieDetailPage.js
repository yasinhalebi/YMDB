import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchGenres, fetchTVDetails, fetchMovieDetails, fetchCredits } from '../services/api';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { CiPlay1 } from 'react-icons/ci';
import Carousel from './Carousel';
import VideoPlayer from './VideoPlayer';

export default function MovieDetailPage() {
  const { state } = useLocation();
  const { item } = state || {};

  const [detail, setDetail] = useState(null);
  const [directors, setDirectors] = useState([]);
  const [cast, setCast] = useState([]);
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (!item?.id || !item?.media_type) {
        setError('Invalid item data. Please navigate from the Movies or TV Shows page.');
        return;
      }
      try {
        let data;
        let credits;
        if (item.media_type === 'tv') {
          data = await fetchTVDetails(item.id);
          credits = await fetchCredits(item.id, 'tv');
          setDirectors(data?.created_by || []);
        } else {
          data = await fetchMovieDetails(item.id);
          credits = await fetchCredits(item.id, 'movie');
          const directorsList = credits?.crew?.filter(member => member.job === 'Director') || [];
          setDirectors(directorsList);
        }
        console.log('API Response (Details):', { data, credits, item });
        setDetail({ ...data, media_type: item.media_type });
        setCast(credits?.cast?.slice(0, 9) || []);
      } catch (err) {
        console.error('Error loading details:', err.response?.data || err.message);
        setError('Failed to load details. Please try again.');
      }
    };
    loadDetails();
  }, [item]);

  useEffect(() => {
    const loadGenres = async () => {
      if (!item?.media_type || !item?.genre_ids) {
        console.warn('No media_type or genre_ids available:', { media_type: item?.media_type, genre_ids: item?.genre_ids });
        return;
      }
      try {
        const genreList = await fetchGenres(item.media_type);
        const genreNames = item.genre_ids.map(id => 
          genreList.find(genre => genre.id === id)?.name || 'Unknown'
        );
        setGenres(genreNames);
        console.log('Genres loaded:', genreNames);
      } catch (err) {
        console.error('Error fetching genres:', err.response?.data || err.message);
        setError('Failed to load genres.');
      }
    };
    loadGenres();
  }, [item?.genre_ids, item?.media_type]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#04152d] text-red-500 text-center pt-28 px-4 sm:px-10 md:px-20 lg:px-40">
        {error}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-[#04152d] text-white text-center pt-28 px-4 sm:px-10 md:px-20 lg:px-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  const title = detail?.title || detail?.name || 'N/A';
  const releaseDate = detail?.release_date || detail?.first_air_date || '';
  const percentage = detail?.vote_average?.toFixed(1) * 10 || 0;
  const imgUrl = detail?.poster_path ? `https://image.tmdb.org/t/p/w780${detail.poster_path}` : 'https://via.placeholder.com/780x1170?text=No+Image';
  const overview = detail?.overview || 'No overview available.';
  const runTime = detail?.runtime ? `${detail.runtime} min` : detail?.number_of_episodes ? `${detail.number_of_episodes} Episodes` : 'N/A';
  const creators = directors.length > 0 ? directors.map(d => d.name).join(', ') : 'N/A';
  const bgUrl = detail?.backdrop_path ? `https://image.tmdb.org/t/p/original${detail.backdrop_path}` : '';
  const subtitle = detail?.tagline || '';
  const voteAverage = detail?.vote_average?.toFixed(1) || 'N/A';
  const status = detail?.status || 'No Available Status';
  const carouselTitle = item.media_type === 'tv' ? 'Similar TV Shows' : 'Similar Movies';
  const trailer = detail?.videos?.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

  return (
    <div className="relative bg-[#04152d] min-h-screen text-white flex items-start pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40 pb-10 w-full z-20">
      <div
        className="absolute top-0 left-0 w-full h-screen bg-cover opacity-10 -z-10 faded-bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="max-w-full">
        <div className="flex flex-col md:flex-row gap-6 z-40 w-full">
          <div className="w-full md:w-[40%] lg:w-[35%] xl:w-[32rem]">
            <img 
              src={imgUrl} 
              alt={title} 
              className="rounded-lg w-full max-w-[300px] sm:max-w-[350px] md:max-w-none mx-auto object-cover" 
              loading="lazy" 
            />
          </div>
          <div className="flex flex-col ml-0 md:ml-6 lg:ml-8 w-full mt-6 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-bold">{title} ({releaseDate.split('-')[0] || 'N/A'})</h1>
            {subtitle && (
              <p className="text-lg italic text-gray-300 mt-1 mb-4 font-light">{subtitle}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.length > 0 ? (
                genres.map((genre, index) => (
                  <p
                    key={index}
                    className="text-xs text-white text-sm bg-amber-800 px-2 py-1 rounded"
                  >
                    {genre}
                  </p>
                ))
              ) : (
                <p className="text-xs text-white text-sm bg-amber-800 px-2 py-1 rounded">N/A</p>
              )}
            </div>
            <div className="mt-8 flex row md:flex-row gap-4">
              <div className="size-24">
                <CircularProgressbar
                  value={percentage}
                  text={`${voteAverage}`}
                  background
                  backgroundPadding={6}
                  styles={buildStyles({
                    backgroundColor: '#c05621',
                    textColor: '#fff',
                    pathColor: '#fff',
                    trailColor: 'transparent',
                    textSize: '32px',
                    zIndex: 10,
                  })}
                />
              </div>
              {trailer ? (
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="flex flex-row items-center gap-2 cursor-pointer hover:text-red-400 transition duration-300 ease-in-out"
                >
                  <CiPlay1 className="text-5xl md:text-7xl" />
                  <h1 className="text-xl md:text-2xl">Watch Trailer</h1>
                </button>
              ) : (
                <p className="text-gray-400">No trailer available</p>
              )}
              
              {isVideoPlaying && trailer && (
                <VideoPlayer
                  videoId={trailer.key}
                  onClose={() => setIsVideoPlaying(false)}
                />
              )}
            </div>
            <h1 className="mt-6 text-xl md:text-2xl font-semibold">Overview</h1>
            <p className="text-base mt-1 max-w-[700px]">{overview}</p>
            <div className="flex gap-3 items-center mt-6">
              <h1 className="font-semibold text-lg">Status:</h1>
              <p className="font-semibold text-gray-400 text-lg">{status}</p>
            </div>
            <hr className="mt-3 opacity-20" />
            <div className="flex gap-3 items-center mt-3">
              <h1 className="font-semibold text-lg">{item.media_type === 'tv' ? 'Creator:' : 'Director:'}</h1>
              <p className="font-semibold text-gray-400 text-lg">{creators}</p>
            </div>
            <hr className="mt-3 opacity-20" />
            <div className="flex gap-3 items-center mt-3">
              <h1 className="font-semibold text-lg">Runtime:</h1>
              <p className="font-semibold text-gray-400 text-lg">{runTime}</p>
            </div>
          </div>
        </div>
        <h1 className="font-semibold mt-8 text-2xl md:text-3xl">Top Cast</h1>
        <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4 mt-8 w-full z-10">
          {cast.length > 0 ? (
            cast.map((actor, index) => (
              <div key={index} className="flex items-center gap-2 flex-col w-full">
                <div className="w-full aspect-square relative overflow-hidden rounded-full">
                  <img
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/h632${actor.profile_path}` : 'https://via.placeholder.com/92x138?text=No+Image'}
                    alt={"s"}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-medium truncate">{actor.name}</p>
                  <p className="text-xs text-gray-400 truncate">{actor.character || 'N/A'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No cast information available.</p>
          )}
        </div>
        <div className="mt-20">
          <h1 className="text-2xl md:text-3xl">{carouselTitle}</h1>
          <Carousel title={carouselTitle} type="negative" similar={true} show={detail} />
        </div>
        <div className="mt-20">
          <h1 className="text-2xl md:text-3xl">Top Rated</h1>
          <Carousel title="Top Rated" type="negative" similar={false} show={detail} />
        </div>
      </div>
    </div>
  );
}