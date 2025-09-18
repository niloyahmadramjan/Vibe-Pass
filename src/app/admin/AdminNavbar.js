export default function AdminNavbar() {
  return (
    <nav className="w-full bg-amber-700 shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </nav>
  );
}
