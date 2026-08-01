import { useAuth } from "../../../auth/useAuth.js";

function AdminNavbar() {

    const { user } = useAuth();

    return (

        <div className="admin-navbar">

            <h2>CALIM Admin</h2>

            <div>

                Welcome,

                <strong>

                    {user?.full_name}

                </strong>

            </div>

        </div>

    );

}

export default AdminNavbar;