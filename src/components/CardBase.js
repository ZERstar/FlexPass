import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import MovieCard from "./MovieCard";
export default function   CardBase() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_API_BASE_URL}/movie/getAllMovies`
    })
      .then((response) => {
        setMovies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, []);

  return (
    <div className="text-white capitalize font-semibold  text-[4rem]">
      <span className="p-20">Movies</span>

      <div className="grid grid-cols-3 justify-items-start ">
        {movies.map((movie) => {
          return (
            <div key={movie._id} onClick={()=>{
              navigate('/theatreSelection',{state:movie});
            }}>
                <MovieCard
                  name={movie.name}
                  image={movie.image}
                  release={movie.release}
                />
            </div>
          );
        })}
      </div>
    </div>
  );
}
