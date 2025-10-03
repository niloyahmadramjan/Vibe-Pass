// Seat layout with pricing tiers
export const seatSections = [
  {
    id: 'platinum',
    name: 'Platinum',
    price: 300,
    color: 'from-red-600 to-red-800',
    rows: [
      { row: 'A', seats: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'] },
      { row: 'B', seats: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'] },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 250,
    color: 'from-rose-600 to-rose-800',
    rows: [
      { row: 'C', seats: ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10'] },
      { row: 'D', seats: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'] },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 200,
    color: 'from-zinc-600 to-zinc-800',
    rows: [
      { row: 'E', seats: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'] },
      { row: 'F', seats: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10'] },
      { row: 'G', seats: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10'] },
    ],
  },
  {
    id: 'regular',
    name: 'Regular',
    price: 150,
    color: 'from-gray-600 to-gray-800',
    rows: [
      { row: 'H', seats: ['H1','H2','H3','H4','H5','H6','H7','H8','H9','H10','H11','H12'] },
      { row: 'I', seats: ['I1','I2','I3','I4','I5','I6','I7','I8','I9','I10','I11','I12'] },
      { row: 'J', seats: ['J1','J2','J3','J4','J5','J6','J7','J8','J9','J10','J11','J12'] },
    ],
  },
];

// Pre-booked seats
export const reservedSeats = [
  'B5', 'C8', 'D1', 'E4', 'F7', 'G3', 'H5', 'I2', 'J8', 'C4', 'D9',
];
