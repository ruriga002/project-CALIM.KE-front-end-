import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { getAuthToken } from "../../../api/login.js";

const API = "/api";

function Collections() {

    const [collections, setCollections] = useState([]);
    const [name, setName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadCollections() {

        try {

            const response = await fetch(`${API}/collections`);

            const data = await response.json();

            setCollections(data.collections || data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        async function init() {
            await loadCollections();
        }

        init();

    }, []);

    async function saveCollection(e) {

        e.preventDefault();

        const token = getAuthToken();

        const url = editingId
            ? `${API}/collections/${editingId}`
            : `${API}/collections`;

        const method = editingId ? "PUT" : "POST";

        try {

            const response = await fetch(url, {

                method,

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify({
                    name
                })

            });

            const data = await response.json();

            alert(data.message);

            setName("");
            setEditingId(null);

            loadCollections();

        } catch (error) {

            console.log(error);

        }

    }

    function editCollection(collection) {

        setEditingId(collection.id);

        setName(collection.name);

    }

    async function deleteCollection(id) {

        if (!window.confirm("Delete this collection?"))
            return;

        const token = getAuthToken();

        await fetch(`${API}/collections/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        loadCollections();

    }

    return (

        <div className="admin">

            <AdminSidebar />

            <div className="admin-content">

                <AdminNavbar />

                <h1>Collections</h1>

                <form
                    className="admin-form"
                    onSubmit={saveCollection}
                >

                    <input

                        value={name}

                        placeholder="Collection Name"

                        onChange={(e)=>setName(e.target.value)}

                        required

                    />

                    <button>

                        {

                            editingId

                            ?

                            "Update Collection"

                            :

                            "Add Collection"

                        }

                    </button>

                </form>

                {

                    loading ?

                    <p>Loading...</p>

                    :

                    <table className="admin-table">

                        <thead>

                            <tr>

                                <th>ID</th>

                                <th>Name</th>

                                <th>Edit</th>

                                <th>Delete</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                collections.map(collection=>(

                                    <tr key={collection.id}>

                                        <td>{collection.id}</td>

                                        <td>{collection.name}</td>

                                        <td>

                                            <button

                                                onClick={()=>

                                                    editCollection(collection)

                                                }

                                            >

                                                Edit

                                            </button>

                                        </td>

                                        <td>

                                            <button

                                                onClick={()=>

                                                    deleteCollection(collection.id)

                                                }

                                            >

                                                Delete

                                            </button>

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

export default Collections;