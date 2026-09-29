import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Login() {
    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!formData.role) {
            setError("Please select your role.");
            return;
        }

        setLoading(true);

        try {
            const loggedInUser = await login(
                formData.email,
                formData.password
            );

            
            if (loggedInUser.role !== formData.role) {
                setError(
                    "The selected role does not match this account."
                );

                return;
            }

            

            if (loggedInUser.role === "ADMIN") {
                navigate("/admin");
            } else if (
                loggedInUser.role === "STORE_OWNER"
            ) {
                navigate("/owner");
            } else {
                navigate("/stores");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

              

                <div className="auth-header">

                    <h1>
                        StoreRate
                    </h1>

                    <p>
                        Store Rating Management System
                    </p>

                </div>


                

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                
                <form onSubmit={handleSubmit}>


                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    
                    <div className="form-group">

                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select your role
                            </option>

                            <option value="USER">
                                Normal User
                            </option>

                            <option value="STORE_OWNER">
                                Store Owner
                            </option>

                            <option value="ADMIN">
                                Admin
                            </option>

                        </select>

                    </div>


                    

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                

                <div className="auth-footer">

                    <p>
                        Don't have an account?{" "}

                        <Link to="/register">
                            Register
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;