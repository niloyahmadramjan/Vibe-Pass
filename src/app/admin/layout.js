
// import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";


export default function AdminLayout({ children }) {
  return (
    <div className="flex max-w-7xl mx-auto">
      {/* Sidebar */}
      <AdminSidebar/>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        {/* <AdminNavbar/> */}

        {/* Page Content */}
        <main className="p-6 bg-dark min-h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
