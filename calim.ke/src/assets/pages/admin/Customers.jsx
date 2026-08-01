import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { getAuthToken } from "../../../api/login.js";

const API = "/api";

function Customers() {

    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadCustomers() {

        try {

            const token = getAuthToken();

            const response = await fetch(`${API}/admin/customers`, {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            const data = await response.json();

            setCustomers(data.customers || data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        async function init() {
            await loadCustomers();
        }

        init();

    }, []);

    async function deleteCustomer(id) {

        const confirmDelete = window.confirm(
            "Delete this customer?"
        );

        if (!confirmDelete) return;

        const token = getAuthToken();

        await fetch(`${API}/admin/customers/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        loadCustomers();

    }

    const filteredCustomers = customers.filter(customer =>

        customer.full_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||

        customer.email
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div className="admin">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <h1>Customers</h1>

                <input

                    type="text"

                    placeholder="Search customer..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                    className="search-input"

                />

                {

                    loading ?

                    <p>Loading...</p>

                    :

                    <table className="admin-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Email</th>

                                <th>Phone</th>

                                <th>Role</th>

                                <th>Delete</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredCustomers.map(customer=>(

                                    <tr key={customer.id}>

                                        <td>{customer.id}</td>

                                        <td>{customer.full_name}</td>

                                        <td>{customer.email}</td>

                                        <td>{customer.phone}</td>

                                        <td>

                                            <span className={`role ${customer.role}`}>

                                                {customer.role}

                                            </span>

                                        </td>

                                        <td>

                                            {

                                                customer.role === "admin"

                                                ?

                                                <button disabled>

                                                    Protected

                                                </button>

                                                :

                                                <button

                                                    onClick={()=>

                                                        deleteCustomer(customer.id)

                                                    }

                                                >

                                                    Delete

                                                </button>

                                            }

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                }

            </div>

        </div>

    );

}

export default Customers;