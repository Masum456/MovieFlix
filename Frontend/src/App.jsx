import React, { useEffect, useState } from 'react'
import Search from './components/search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';



// const API_KEY = import.meta.env.TMDB_API_KEY;

// const API_OPTIONS ={
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`,
//   }
// }

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


 const fetchMovies = async(search = '') => {

    setIsLoading(true);
    setErrorMessage('');
    try{
     // const endpoint = `${API_BASE_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc`;

     const url = search
      ? `http://localhost:5000/api/movies?query=${encodeURIComponent(search)}`
      : `http://localhost:5000/api/movies`;

      const response = await fetch(url);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      console.log("Movies : ", data);

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    }
    catch(error) {
      console.error(`Error fetching movies : ${error}`);
      setErrorMessage('Error fetching movies. Please try again later. ')
    }
    finally{
      setIsLoading(false);
    }
  }


  useEffect(() => {
      const delayDebounce = setTimeout(() => {
      fetchMovies(searchTerm);
    }, 500); // wait 500ms after user stops typing

      return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <main>
    <div className='pattern'>

    </div>

    <div className='wrapper'>
      <header>
        <img src='/hero-img.png' alt='Hero Banner' />
        <h1>Find <span className="text-gradient">Movies</span> 
        You'll Enjoy Without Hassle</h1>

        <Search searchTerm = {searchTerm} setSearchTerm ={setSearchTerm} />

      </header>

      <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ?(
            <Spinner/>
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage} </p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      </section>

      
    </div>
    </main>
  )
}

export default App
