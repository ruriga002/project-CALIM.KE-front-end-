import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { getAuthToken } from "../../../api/login.js";

const API = "/api";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadOrders() {

        try {

            const token = getAuthToken();

            const response = await fetch(`${API}/admin/orders`, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const data = await response.json();

            setOrders(data.orders || data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        async function init() {
            await loadOrders();
        }

        init();

    }, []);

    async function updateStatus(id, status) {

        try {

            const token = getAuthToken();

            await fetch(`${API}/admin/orders/${id}`, {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({
                    status
                })

            });

            loadOrders();

        } catch (error) {

            console.log(error);

        }

    }

    const filteredOrders = orders.filter(order => {

        const customer =
            order.customer_name ||
            order.customer ||
            "";

        return customer
            .toLowerCase()
            .includes(search.toLowerCase());

    });

    return (

        <div className="admin">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <h1>Orders</h1>

                <input
                    type="text"
                    placeholder="Search customer..."
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className="search-input"
                />

                {loading ? (

                    <p>Loading Orders...</p>

                ) : (

                    <table className="admin-table">

                        <thead>

                            <tr>

                                <th>Order ID</th>

                                <th>Customer</th>

                                <th>Total</th>

                                <th>Status</th>

                                <th>Date</th>

                                <th>Update</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredOrders.map(order=>(

                                    <tr key={order.id}>

                                        <td>#{order.id}</td>

                                        <td>

                                            {
                                                order.customer_name ||
                                                order.customer
                                            }

                                        </td>

                                        <td>

                                            KES {Number(order.total).toLocaleString()}

                                        </td>

                                        <td>

                                            {order.status}

                                        </td>

                                        <td>

                                            {

                                                order.created_at
                                                    ?
                                                new Date(order.created_at).toLocaleDateString()
                                                    :
                                                "-"

                                            }

                                        </td>

                                        <td>

                                            <select

                                                value={order.status}

                                                onChange={(e)=>

                                                    updateStatus(
                                                        order.id,
                                                        e.target.value
                                                    )

                                                }

                                            >

                                                <option value="Pending">

                                                    Pending

                                                </option>

                                                <option value="Processing">

                                                    Processing

                                                </option>

                                                <option value="Shipped">

                                                    Shipped

                                                </option>

                                                <option value="Delivered">

                                                    Delivered

                                                </option>

                                                <option value="Cancelled">

                                                    Cancelled

                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

}

export default Orders;