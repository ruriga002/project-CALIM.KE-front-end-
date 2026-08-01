import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { fetchProducts } from "../../../api/api.js";
import { getAuthToken } from "../../../api/login.js";

const API = "/api";

const DEFAULT_PRODUCTS = [
    {
        name: "CALIM Beanie",
        description: "Soft custom beanie with a premium finish.",
        price: 1500,
        stock: 25,
        image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhbmllcyUyMHdpdGglMjByaXZldHN8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "CALIM Jeans",
        description: "Custom made jeans for a perfect fit.",
        price: 5000,
        stock: 40,
        image: "https://images.unsplash.com/photo-1697678207628-6758ecf9a2cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1c3RvbSUyMGJhZ2d5JTIwamVhbnN8ZW58MHx8MHx8fDA%3D"
    },
    {
        name: "CALIM Leather Jacket",
        description: "A genuine leather jacket for all styling options.",
        price: 2000,
        stock: 50,
        image: "https://plus.unsplash.com/premium_photo-1731950912462-9caa3905627d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwbGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D"
    }
]

function Products() {

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        collection_id: ""
    });

    async function loadProducts() {

        try {

            const data = await fetchProducts();

            setProducts(data.products || data);

        } catch (err) {

            console.log(err);

        }

    }

    useEffect(() => {

        async function init() {
            await loadProducts();
        }

        init();

    }, []);

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function addProduct(e) {

        e.preventDefault();

        try {

            const token = getAuthToken();

            const response = await fetch(`${API}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            alert(data.message);

            loadProducts();

            setForm({
                name: "",
                description: "",
                price: "",
                stock: "",
                image: "",
                collection_id: ""
            });

        } catch (err) {

            console.log(err);

        }

    }

    async function deleteProduct(id) {

        if (!window.confirm("Delete this product?"))
            return;

        const token = getAuthToken();

        await fetch(`${API}/products/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        loadProducts();

    }

    async function seedDefaultProducts() {
        const token = getAuthToken();

        for (const product of DEFAULT_PRODUCTS) {
            await fetch(`${API}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(product)
            })
        }

        loadProducts();
    }

    const filtered = products.filter(product =>

        product.name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div className="admin">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <h1>Products</h1>

                <input

                    placeholder="Search Product..."

                    value={search}

                    onChange={(e)=>setSearch(e.target.value)}

                />

                <form onSubmit={addProduct} className="admin-form">

                    <input
                        name="name"
                        placeholder="Product Name"
                        value={form.name}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                    />

                    <input
                        name="price"
                        type="number"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                    />

                    <input
                        name="stock"
                        type="number"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                    />

                    <input
                        name="image"
                        placeholder="Image URL"
                        value={form.image}
                        onChange={handleChange}
                    />

                    <input
                        name="collection_id"
                        placeholder="Collection ID"
                        value={form.collection_id}
                        onChange={handleChange}
                    />

                        <button>Add Product</button>

                </form>

                <button className="admin-seed-button" onClick={seedDefaultProducts}>
                    Seed Default Products
                </button>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Image</th>

                            <th>Name</th>

                            <th>Price</th>

                            <th>Stock</th>

                            <th>Delete</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filtered.map(product=>(

                                <tr key={product.id}>

                                    <td>

                                        <img

                                            src={product.image}

                                            alt={product.name}

                                            width="60"

                                        />

                                    </td>

                                    <td>{product.name}</td>

                                    <td>KES {product.price}</td>

                                    <td>{product.stock}</td>

                                    <td>

                                        <button
                                            onClick={()=>deleteProduct(product.id)}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default Products;