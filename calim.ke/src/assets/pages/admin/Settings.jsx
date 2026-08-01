import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { getAuthToken, clearAuthToken } from "../../../api/login.js";

const API = "/api";

function Settings() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({

        full_name: "",

        email: "",

        phone: ""

    });

    const [password, setPassword] = useState({

        current_password: "",

        new_password: "",

        confirm_password: ""

    });

    async function loadProfile() {

        try {

            const token = getAuthToken();

            const response = await fetch(

                `${API}/auth/profile`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            const data = await response.json();

            setProfile(data);

        }

        catch(err){

            console.log(err);

        }

    }

    useEffect(() => {

        async function init() {
            await loadProfile();
        }

        init();

    }, []);

    function handleProfile(e){

        setProfile({

            ...profile,

            [e.target.name]:e.target.value

        });

    }

    function handlePassword(e){

        setPassword({

            ...password,

            [e.target.name]:e.target.value

        });

    }

    async function updateProfile(e){

        e.preventDefault();

        try{

            const token = getAuthToken();

            const response = await fetch(

                `${API}/auth/profile`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json",

                        Authorization:`Bearer ${token}`

                    },

                    body:JSON.stringify(profile)

                }

            );

            const data = await response.json();

            alert(data.message);

        }

        catch(err){

            console.log(err);

        }

    }

    async function changePassword(e){

        e.preventDefault();

        if(password.new_password !== password.confirm_password){

            alert("Passwords do not match");

            return;

        }

        try{

            const token = getAuthToken();

            const response = await fetch(

                `${API}/auth/change-password`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json",

                        Authorization:`Bearer ${token}`

                    },

                    body:JSON.stringify(password)

                }

            );

            const data = await response.json();

            alert(data.message);

            setPassword({

                current_password:"",

                new_password:"",

                confirm_password:""

            });

        }

        catch(err){

            console.log(err);

        }

    }

    function logout(){

        clearAuthToken();

        localStorage.removeItem("user");

        navigate("/login");

    }

    return(

        <div className="admin">

            <AdminSidebar/>

            <div className="admin-content">

                <AdminNavbar/>

                <h1>Settings</h1>

                <div className="settings-grid">

                    <div className="settings-card">

                        <h2>Profile</h2>

                        <form onSubmit={updateProfile}>

                            <input

                                name="full_name"

                                value={profile.full_name}

                                onChange={handleProfile}

                                placeholder="Full Name"

                            />

                            <input

                                name="email"

                                value={profile.email}

                                onChange={handleProfile}

                                placeholder="Email"

                            />

                            <input

                                name="phone"

                                value={profile.phone}

                                onChange={handleProfile}

                                placeholder="Phone"

                            />

                            <button>

                                Save Profile

                            </button>

                        </form>

                    </div>

                    <div className="settings-card">

                        <h2>Change Password</h2>

                        <form onSubmit={changePassword}>

                            <input

                                type="password"

                                name="current_password"

                                value={password.current_password}

                                onChange={handlePassword}

                                placeholder="Current Password"

                            />

                            <input

                                type="password"

                                name="new_password"

                                value={password.new_password}

                                onChange={handlePassword}

                                placeholder="New Password"

                            />

                            <input

                                type="password"

                                name="confirm_password"

                                value={password.confirm_password}

                                onChange={handlePassword}

                                placeholder="Confirm Password"

                            />

                            <button>

                                Update Password

                            </button>

                        </form>

                    </div>

                    <div className="settings-card">

                        <h2>Account</h2>

                        <p>

                            Logged in as Administrator

                        </p>

                        <button

                            onClick={logout}

                        >

                            Logout

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Settings;