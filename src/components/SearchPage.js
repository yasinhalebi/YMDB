import { fetchSearchResults } from "../services/api";
import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';
import Card from "./Card";


export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const term = searchParams.get('query') || '';
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    

    

  useEffect(() => {
  if (!term) {
    setItems([]);
    setError(null);
    setPage(1); 
    return;
  }
  const loadSearchResults = async () => {
    try {
      setLoading(true);
      const { results, totalPages } = await fetchSearchResults(term, page);
      if (page === 1) {
        setItems(results); 
      } else {
        setItems(prevItems => [...prevItems, ...results]); 
      }
      setTotalPages(totalPages);
    } catch (err) {
      setError('Failed to load search results. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  loadSearchResults();
}, [term, page]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };
  


    return (
        <div className="text-white pt-32 bg-[#04152d] min-h-screen px-4 sm:px-10 md:px-20 lg:px-40 pb-10">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for "{term || 'No query entered'}"
      </h1>
      {error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : items.length === 0 && !loading ? (
        <div className="text-center text-white">No results found.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {items.map(item => (
              <Card key={`${item.media_type}-${item.id}`} item={item} />
            ))}
          </div>
          {loading && (
            <div className="text-center my-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          )}
          {!loading && page < totalPages && (
            <div className="text-center my-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
    );
}