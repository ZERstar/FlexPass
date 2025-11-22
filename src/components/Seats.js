import React, { useState } from "react";

export default function Seats(props) {
  const [isActive, setIsActive] = useState(false);

  const handleSeatClick = () => {
    const isSeatSelected = props.seats.includes(props.seatNo);

    if (isSeatSelected) {
      // Seat is already selected, deselect it
      setIsActive(false);
      props.setSeats(props.seats.filter((seat) => seat !== props.seatNo));
    } else {
      // Seat is not selected, select it if we haven't reached max of 5 seats
      if (props.seats.length < 5) {
        setIsActive(true);
        props.setSeats(props.seats.concat(props.seatNo));
      } else {
        // Maximum 5 seats reached
        alert("You can select a maximum of 5 seats");
      }
    }
  };

  return (
    <div>
      <div
        onClick={handleSeatClick}
        className={`cursor-pointer w-7 h-6 rounded-t-full ${
          isActive ? "bg-green-500" : "bg-gray-800"
        }  m-1 text-center text-[12px] flex items-center justify-center`}
      >
        {props.seatNo.slice(2)}
      </div>
    </div>
  );
}
