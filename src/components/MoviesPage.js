import { useState, useEffect } from "react";
import { fetchMovies, fetchGenres } from "../services/api";
import Card from "./Card";
import MultipleSelectGenres from "./MultipleSelectGenres";
import MultipleSelectSortBy from "./MultipleSelectSortBy";

export default function MoviesPage() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [genreMap, setGenreMap] = useState({});

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await fetchGenres('movie');
        const map = genres.reduce((acc, genre) => {
          acc[genre.name] = genre.id;
          return acc;
        }, {});
        setGenreMap(map);
      } catch (err) {
        console.error('Error fetching genres:', err.response?.data || err.message);
        setError('Failed to load genres.');
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        if (page === 1) {
          setMovies([]);
        }
        const genreIds = selectedGenres.map(genre => genreMap[genre]).filter(id => id).join(',');
        const { results, total_pages } = await fetchMovies(page, sortBy, genreIds);
        console.log('API Response (Movies):', { results, total_pages, genreIds, page, sortBy });
        if (page === 1) {
          setMovies(results);
        } else {
          setMovies(prevMovies => [...prevMovies, ...results]);
        }
        setTotalPages(total_pages || 0);
      } catch (err) {
        console.error('Error in loadMovies:', err.response?.data || err.message);
        setError('Failed to load movies. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [page, sortBy, selectedGenres, genreMap]);

  useEffect(() => {
    setPage(1);
  }, [selectedGenres, sortBy]);

  useEffect(() => {
    console.log('Load More Debug (Movies):', { loading, page, totalPages });
  }, [loading, page, totalPages]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#04152d] pt-32 pb-10 text-white xl:px-40 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Explore Movies</h1>
        <div className="flex gap-4">
          <MultipleSelectGenres setSelectedGenres={setSelectedGenres} mediaType="movie" />
          <MultipleSelectSortBy setSortBy={setSortBy} />
        </div>
      </div>
      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map(movie => (
              <Card key={movie.id} item={{ ...movie, media_type: 'movie' }} />
            ))}
          </div>
          {loading && (
            <div className="text-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          )}
          {!loading && totalPages > 1 && page < totalPages && (
            <div className="text-center my-6">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-semibold text-lg"
              >
                Load More
              </button>
            </div>
          )}
          {!loading && totalPages <= 1 && movies.length > 0 && (
            <div className="text-center my-6 text-gray-400">
              No more movies to load.
            </div>
          )}
        </>
      )}
    </div>
  );
}