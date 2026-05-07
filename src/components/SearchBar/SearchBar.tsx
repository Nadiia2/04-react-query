import styles from "./SearchBar.module.css";
import toast, { Toaster } from "react-hot-toast";

interface SearchBarProps {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const handleSubmit = (formData: FormData) => {
    try {
      const query = formData.get("query") as string;

      if (!query || query.trim() === "") {
        toast.error("Please enter your search query.");
        return;
      }

      onSubmit(query);
    } catch (error) {
      console.error("Submit error:", error);
      //   toast.error("No movies found for your request.");
    }
  };

  return (
    <header className={styles.header}>
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={styles.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}
