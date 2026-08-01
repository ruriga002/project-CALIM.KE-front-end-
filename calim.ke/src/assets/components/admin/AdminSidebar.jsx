import { NavLink } from "react-router-dom";

function AdminSidebar() {

    return (

        <div className="admin-sidebar">

            <h1>CALIM</h1>

            <NavLink to="/admin/dashboard">
                Dashboard
            </NavLink>

            <NavLink to="/admin/products">
                Products
            </NavLink>

            <NavLink to="/admin/orders">
                Orders
            </NavLink>

            <NavLink to="/admin/customers">
                Customers
            </NavLink>

            <NavLink to="/admin/collections">
                Collections
            </NavLink>

            <NavLink to="/admin/inventory">
                Inventory
            </NavLink>

            <NavLink to="/admin/settings">
                Settings
            </NavLink>

        </div>

    );

}

export default AdminSidebar;