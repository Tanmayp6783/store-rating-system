import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../../services/api";


function Register() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({

        name: "",

        email: "",

        address: "",

        password: ""

    });


    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


 

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const validateForm = () => {

        const name = formData.name.trim();

        const email = formData.email.trim();

        const address = formData.address.trim();

        const password = formData.password;


        

        if (
            name.length < 20 ||
            name.length > 60
        ) {

            return "Name must be between 20 and 60 characters.";

        }


      

        if (!email) {

            return "Email is required.";

        }


       

        if (!address) {

            return "Address is required.";

        }


        if (address.length > 400) {

            return "Address must not exceed 400 characters.";

        }


       

        if (
            password.length < 8 ||
            password.length > 16
        ) {

            return "Password must be between 8 and 16 characters.";

        }


        if (!/[A-Z]/.test(password)) {

            return "Password must contain at least one uppercase letter.";

        }


        if (!/[^A-Za-z0-9]/.test(password)) {

            return "Password must contain at least one special character.";

        }


        return null;

    };


   
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(validationError);

            return;

        }


        try {

            setLoading(true);


            await api.post(
                "/auth/register",
                {
                    name: formData.name.trim(),

                    email: formData.email.trim(),

                    address: formData.address.trim(),

                    password: formData.password
                }
            );


            setSuccess(
                "Registration successful! Redirecting to login..."
            );


            setFormData({

                name: "",

                email: "",

                address: "",

                password: ""

            });


            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (err) {

            const responseData =
                err.response?.data;


            if (
                responseData?.errors &&
                responseData.errors.length > 0
            ) {

                setError(
                    responseData.errors
                        .map(
                            (item) => item.msg
                        )
                        .join(" ")
                );

            } else {

                setError(
                    responseData?.message ||
                    "Registration failed. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-card register-card">


              

                <div className="auth-header">

                    <h1>
                        StoreRate
                    </h1>

                    <p>
                        Store Rating Management System
                    </p>

                </div>


                <h2>
                    Create Account
                </h2>


                <p className="register-subtitle">

                    Register as a Normal User

                </p>


                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


           

                {success && (

                    <div className="success-message">
                        {success}
                    </div>

                )}


             

                <form onSubmit={handleSubmit}>


                  

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />

                        <small>
                            20–60 characters
                        </small>

                    </div>


                    

                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>



                    <div className="form-group">

                        <label htmlFor="address">
                            Address
                        </label>

                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            rows="3"
                            maxLength="400"
                            required
                        />

                        <small>
                            Maximum 400 characters
                        </small>

                    </div>


                  

                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                        <small>
                            8–16 characters, one uppercase
                            letter and one special character
                        </small>

                    </div>


                 

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>


                </form>


               

                <div className="auth-footer">

                    <p>

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>


            </div>

        </div>

    );
}


export default Register;