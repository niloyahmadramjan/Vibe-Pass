
// import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";


export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <AdminNavbar/> */}

        {/* Page Content */}
        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
