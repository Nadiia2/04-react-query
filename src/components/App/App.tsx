import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchQuery = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);

      const newMovies = await fetchMovies(query);

      if (newMovies.length === 0) {
        toast.error("No movies found for your request.");
      }

      setMovies(newMovies);
    } catch {
      toast.error("Error fetching movies");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {isLoading && <Loader />}
      <SearchBar onSubmit={fetchQuery} />
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid
          onSelect={(movie) => setSelectedMovie(movie)}
          movies={movies}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}
