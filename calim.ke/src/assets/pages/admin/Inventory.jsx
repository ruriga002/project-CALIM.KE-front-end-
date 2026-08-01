import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";

function Inventory() {
  return (
    <div className="admin">
      <AdminSidebar />
      <div className="admin-content">
        <AdminNavbar />
        <h1>Inventory</h1>
        <p>Manage your inventory here. This page is a placeholder until inventory details are available.</p>
      </div>
    </div>
  );
}

export default Inventory;
