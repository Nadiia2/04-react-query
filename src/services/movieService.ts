import axios from "axios";
import type { Movie } from "../types/movie";

export interface GetMoviesResponse {
  results: Movie[];
  total_pages: number;
}

export default async function fetchMovies(
  name: string,
  page: number = 1,
): Promise<GetMoviesResponse> {
  const response = await axios.get<GetMoviesResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${name}&page=${page}`,

    {
      params: {
        query: name,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    },
  );
  return response.data;
}
