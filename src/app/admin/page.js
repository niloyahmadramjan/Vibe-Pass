"use client";

export default function AdminDashboard() {
  return (
    <div className="pt-15 pr-20">
      <h2 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h2>
      <p>Here you can manage movies, bookings, users, and reports.</p>
    </div>
  );
}

//dashboard chart
//movie details-- total movie, tatal ticket, total user
//recent booking-- user name, movie name, seat number, date, time
//recent user-- user name, email, date
//recent movie-- movie name, genre, release date
//recent feedback-- user name, movie name, feedback, date
//recent transaction-- user name, movie name, amount, date

//