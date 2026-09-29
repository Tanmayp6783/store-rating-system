import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get("/admin/dashboard");

                setStats(response.data.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return (
        <div className="admin-layout">

            <Sidebar />

            <div className="main-section">

                <main className="dashboard-content">

                    <h1>Dashboard</h1>

                    <p className="page-subtitle">
                        Overview of your store rating system
                    </p>

                    {loading && <Loading />}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {stats && (
                        <div className="stats-grid">

                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                icon="👥"
                            />

                            <StatCard
                                title="Total Stores"
                                value={stats.totalStores}
                                icon="🏪"
                            />

                            <StatCard
                                title="Total Ratings"
                                value={stats.totalRatings}
                                icon="⭐"
                            />

                        </div>
                    )}

                    <div className="dashboard-info">

                        <h2>System Overview</h2>

                        <p>
                            Manage users, stores and ratings from
                            the administration panel.
                        </p>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Dashboard;