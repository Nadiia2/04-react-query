import axios from "axios";
import type { Movie } from "../types/movie";

interface GetMoviesResponse {
  results: Movie[];
}

export default async function fetchMovies(name: string): Promise<Movie[]> {
  const response = await axios.get<GetMoviesResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${name}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  return response.data.results;
}
