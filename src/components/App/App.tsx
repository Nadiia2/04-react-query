import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import css from "./App.module.css";
import fetchMovies from "../../services/movieService";
import toast, { Toaster } from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import MovieModal from "../MovieModal/MovieModal";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

// interface PaginationProps {
//   totalPages: number;
//   currentPage: number;
//   onPageChange: (nextPage: number) => void;
// }

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isSuccess, isLoading, isError, isFetching, isFetched } =
    useQuery({
      queryKey: ["movies", name, currentPage],
      queryFn: () => fetchMovies(name, currentPage),
      enabled: name.trim() !== "",
      placeholderData: keepPreviousData,
      retry: false,
    });

  const fetchQuery = (newQuery: string) => {
    setName(newQuery);
    setCurrentPage(1);
  };
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isFetched && data?.results?.length === 0) {
      toast.error("No movies found for your request.", {
        duration: 1500,
      });
    }
  }, [data, name, isFetched]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={fetchQuery} />

      {isFetching || isLoading ? <Loader /> : null}

      {/* {data?.results?.length === 0 &&
        toast.error("No movies found for your request.")} */}
      {isError && <ErrorMessage />}
      {data?.results && (
        <MovieGrid
          onSelect={(movie) => setSelectedMovie(movie)}
          movies={data.results}
        />
      )}

      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={3}
          marginPagesDisplayed={3}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="->"
          previousLabel="<-"
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
