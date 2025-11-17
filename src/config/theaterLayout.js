// Theater seat layout configuration
// This makes it easy to modify theater layouts without touching component code

export const DEFAULT_THEATER_LAYOUT = {
  sections: [
    {
      name: "BUDGET",
      price: 250,
      rows: [
        // Rows A-F: Full width (30 seats each)
        { row: "A", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        { row: "B", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        { row: "C", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        { row: "D", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        { row: "E", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        { row: "F", sections: [{ start: 1, end: 8 }, { start: 9, end: 22 }, { start: 23, end: 30 }] },
        // Rows G-J: Narrower (26 seats each)
        { row: "G", sections: [{ start: 1, end: 4 }, { start: 5, end: 18 }, { start: 19, end: 26 }], marginTop: true },
        { row: "H", sections: [{ start: 1, end: 4 }, { start: 5, end: 18 }, { start: 19, end: 26 }] },
        { row: "I", sections: [{ start: 1, end: 4 }, { start: 5, end: 18 }, { start: 19, end: 26 }] },
        { row: "J", sections: [{ start: 1, end: 4 }, { start: 5, end: 18 }, { start: 19, end: 26 }] },
      ]
    },
    {
      name: "ELITE",
      price: 350,
      rows: [
        // Row K: Premium (29 seats)
        { row: "K", sections: [{ start: 1, end: 7 }, { start: 8, end: 21 }, { start: 22, end: 29 }], marginTop: true },
        // Row L: VIP full width (34 seats)
        { row: "L", sections: [{ start: 1, end: 34 }] },
      ]
    }
  ]
};

// Helper function to generate seat configuration for a row
export const generateSeatsForRow = (rowConfig) => {
  const seats = [];
  rowConfig.sections.forEach((section) => {
    for (let i = section.start; i <= section.end; i++) {
      seats.push(`${rowConfig.row}-${i}`);
    }
  });
  return seats;
};

// Helper function to get seat price based on row
export const getSeatPrice = (seatNumber) => {
  const row = seatNumber.split('-')[0];
  if (row === 'K' || row === 'L') {
    return 350; // ELITE
  }
  return 250; // BUDGET
};
