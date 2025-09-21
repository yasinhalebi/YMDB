import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import HomePage from './components/HomePage';
import MoviesPage from './components/MoviesPage';
import TvShowsPage from './components/TvShowsPage';
import SearchPage from './components/SearchPage';
import MovieDetailPage from './components/MovieDetailPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#04152d] w-full">
        <Header />
        <main className="flex-grow w-full max-w-[2000px] mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/moviespage" element={<MoviesPage />}/>
            <Route path="/tvshowspage" element={<TvShowsPage />}/>
            <Route path="/searchpage" element={<SearchPage />}/>
            <Route path="/moviedetailpage" element={<MovieDetailPage />}/>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
