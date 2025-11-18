import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import screen from "../assets/screen.png";
import SeatRow from "../components/SeatRow";
import MovieBanner from "../components/MovieBanner";
import LogInPage from "../components/Login";
import { DEFAULT_THEATER_LAYOUT } from "../config/theaterLayout";
import { useAuth } from "../context/AuthContext";

export default function TheaterSeat() {
  const location = useLocation();
  const navigate = useNavigate();
  const theatre = location.state.theatre;
  const movie = location.state.movie;
  const [seats, setSeats] = useState([]);
  const { setLogin } = useAuth();
  const token = localStorage.getItem("jwt_token");

  const handleBook = () => {
    if (token && seats.length > 0) {
      navigate('/payment', { state: { seats, movie: movie._id, theatre: theatre._id, status: "first" } });
    }
    if (!token) {
      setLogin(true);
    }
  };

  return (
    <div className="relative z-0">
      <LogInPage />

      <MovieBanner
        name={movie.name}
        release={movie.release}
        image={movie.image}
        poster={movie.poster}
      />

      <div className="w-full h-44 bg-[#242333]">
        <div className="text-white capitalize font-semibold text-[4rem] px-5">
          {theatre.name}
        </div>
      </div>

      <div className="w-full h-[140vh] bg-[#242333]">
        <div className="w-full h-full flex flex-col items-center py-10 px-16">
          {/* Screen */}
          <div>
            <img src={screen} alt="Theater Screen" />
          </div>
          <div className="text-white text-3xl mt-10 mb-5">Screen</div>

          {/* Seat Layout */}
          <div className="w-full grid grid-cols-12 my-2">
            {DEFAULT_THEATER_LAYOUT.sections.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                {/* Section Header */}
                <div className="col-span-12 flex text-white">
                  <div>{section.name}-Rs. {section.price}</div>
                </div>
                <div className="w-full col-span-12 border border-gray-50"></div>

                {/* Render all rows in this section */}
                {section.rows.map((rowConfig) => (
                  <SeatRow
                    key={rowConfig.row}
                    rowConfig={rowConfig}
                    seats={seats}
                    setSeats={setSeats}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Legend */}
          <div className="my-8">
            <div className="grid grid-rows-2 grid-flow-col gap-7">
              <div className="flex justify-center items-center">
                <div className="w-7 h-6 rounded-t-full bg-gray-800"></div>
                <div className="text-white text-3xl mx-2">Available Seats</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-7 h-6 rounded-t-full bg-green-500"></div>
                <div className="text-white text-3xl mx-2">Selected Seats</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-7 h-6 rounded-t-full bg-orange"></div>
                <div className="text-white text-3xl mx-2">Resell Seats</div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-7 h-6 rounded-t-full bg-cyan-400"></div>
                <div className="text-white text-3xl mx-2">Sold Seats</div>
              </div>
            </div>
          </div>

          {/* Book Button */}
          <button className="rounded-full bg-blue-900 my-4">
            <div
              className="rounded-[20px] [background:linear-gradient(-38.77deg,_rgba(191,_191,_191,_0.06),_rgba(0,_0,_0,_0)),_rgba(0,_0,_0,_0.14)] shadow-[-8px_4px_5px_rgba(0,_0,_0,_0.24)] [backdrop-filter:blur(53px)] w-48 h-16 text-white text-5xl text-center font-noto-sans px-4 py-4"
              onClick={handleBook}
            >
              Book now
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
