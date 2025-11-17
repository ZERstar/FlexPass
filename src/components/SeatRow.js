import React from "react";
import Seats from "./Seats";

export default function SeatRow({ rowConfig, seats, setSeats }) {
  const renderSeatSection = (section, sectionIndex) => {
    const seatCount = section.end - section.start + 1;
    const colSpan = sectionIndex === 1 ? "col-span-2" : "col-span-1";
    const justify = sectionIndex === 0 ? "justify-end mx-8" : sectionIndex === 2 ? "" : "justify-center";

    return (
      <div key={sectionIndex} className={`flex ${justify} ${colSpan}`}>
        {Array.from({ length: seatCount }, (_, index) => (
          <Seats
            key={`${rowConfig.row}-${section.start + index}`}
            seatNo={`${rowConfig.row}-${section.start + index}`}
            seats={seats}
            setSeats={setSeats}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={`col-span-1 text-white ${rowConfig.marginTop ? 'mt-10' : ''}`}>
        {rowConfig.row}
      </div>
      <div className={`col-span-11 w-full grid grid-cols-4 gap-1 ${rowConfig.marginTop ? 'mt-10' : ''}`}>
        {rowConfig.sections.map((section, index) => renderSeatSection(section, index))}
      </div>
    </>
  );
}
