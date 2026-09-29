import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import AdminStores from "./pages/admin/Stores";

import UserStores from "./pages/user/Stores";

import OwnerDashboard from "./pages/owner/Dashboard";

import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";


function MainLayout() {
    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-content">

                <Navbar />

                <main className="page-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}


function Unauthorized() {
    return (
        <div className="unauthorized-page">

            <h1>403</h1>

            <h2>Unauthorized</h2>

            <p>
                You do not have permission to access this page.
            </p>

            <a href="/login">
                Go to Login
            </a>

        </div>
    );
}


function App() {
    return (
        <BrowserRouter>

            <Routes>

        

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


          

                <Route
                    element={
                        <ProtectedRoute />
                    }
                >

                    <Route
                        element={<MainLayout />}
                    >


                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["ADMIN"]}
                                >
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["ADMIN"]}
                                >
                                    <Users />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/admin/stores"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["ADMIN"]}
                                >
                                    <AdminStores />
                                </ProtectedRoute>
                            }
                        />


                   

                        <Route
                            path="/stores"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["USER"]}
                                >
                                    <UserStores />
                                </ProtectedRoute>
                            }
                        />


                        

                        <Route
                            path="/owner"
                            element={
                                <ProtectedRoute
                                    allowedRoles={["STORE_OWNER"]}
                                >
                                    <OwnerDashboard />
                                </ProtectedRoute>
                            }
                        />



                        <Route
                            path="/profile"
                            element={<Profile />}
                        />

                    </Route>

                </Route>


          

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;