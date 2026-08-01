import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import DashboardCard from "../../components/admin/DashboardCard";
import { getAuthToken } from "../../../api/login.js";

const API = "/api";

function Dashboard() {

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        customers: 0,
        revenue: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [error, setError] = useState("");

    const loadDashboard = async ({ isMounted = true } = {}) => {
        try {
            setError("");
            const token = getAuthToken();
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [productsRes, ordersRes, customersRes] = await Promise.all([
                fetch(`${API}/products`),
                fetch(`${API}/admin/orders`, { headers }),
                fetch(`${API}/admin/customers`, { headers })
            ]);

            if (!productsRes.ok || !ordersRes.ok || !customersRes.ok) {
                throw new Error("Unable to load dashboard data.");
            }

            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();
            const customersData = await customersRes.json();

            const products = Array.isArray(productsData) ? productsData : (productsData.products || []);
            const orders = Array.isArray(ordersData) ? ordersData : (ordersData.orders || []);
            const customers = Array.isArray(customersData)
                ? customersData
                : (customersData.customers || customersData.users || []);

            const revenue = orders.reduce(
                (total, order) => total + Number(order.total || 0),
                0
            );

            if (!isMounted) return;

            setStats({
                products: products.length,
                orders: orders.length,
                customers: customers.length,
                revenue
            });

            const sortedOrders = [...orders].sort((a, b) => {
                const left = new Date(a.created_at || 0).getTime();
                const right = new Date(b.created_at || 0).getTime();
                return right - left;
            });

            if (!isMounted) return;
            setRecentOrders(sortedOrders.slice(0, 5));
        } catch (error) {
            console.error(error);
            if (!isMounted) return;
            setError("Unable to load dashboard data right now.");
        }
    };

    useEffect(() => {
        let isMounted = true;

        const runDashboard = async () => {
            await loadDashboard({ isMounted });
        };

        runDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    return (

        <div className="admin">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <h1>Dashboard</h1>

                {error && (
                    <div className="api-error">
                        <p>{error}</p>
                    </div>
                )}

                <div className="dashboard-grid">

                    <DashboardCard
                        title="Products"
                        value={stats.products}
                        icon="👕"
                    />

                    <DashboardCard
                        title="Orders"
                        value={stats.orders}
                        icon="📦"
                    />

                    <DashboardCard
                        title="Customers"
                        value={stats.customers}
                        icon="👥"
                    />

                    <DashboardCard
                        title="Revenue"
                        value={`KES ${stats.revenue.toLocaleString()}`}
                        icon="💰"
                    />

                </div>

                <div className="dashboard-bottom">

                    <div className="recent-orders">

                        <h2>Recent Orders</h2>

                        <table>

                            <thead>

                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                    <th>Total</th>
                                </tr>

                            </thead>

                            <tbody>

                                {recentOrders.length === 0 ? (

                                    <tr>
                                        <td colSpan="4">
                                            No orders yet.
                                        </td>
                                    </tr>

                                ) : (

                                    recentOrders.map((order) => (

                                        <tr key={order.id}>

                                            <td>#{order.id}</td>

                                            <td>{order.customer_name || order.customer?.name || order.customer?.full_name || order.user_name || 'Unknown customer'}</td>

                                            <td>{order.status}</td>

                                            <td>
                                                KES {Number(order.total || 0).toLocaleString()}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;