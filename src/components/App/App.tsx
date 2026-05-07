import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import "./App.module.css";
import fetchMovies from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [name, setName] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", name],
    queryFn: () => fetchMovies(name),
    enabled: name !== "",
    placeholderData: keepPreviousData,
  });

  const fetchQuery = (newQuery: string) => {
    setName(newQuery);
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!data && isLoading && <Loader />}
      <SearchBar onSubmit={fetchQuery} />
      {isError && <ErrorMessage />}
      {data && (
        <MovieGrid
          onSelect={(movie) => setSelectedMovie(movie)}
          movies={data}
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
