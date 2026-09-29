const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const pool = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const storeRoutes =
    require("./routes/store.routes");
    const ratingRoutes =
    require("./routes/rating.routes");
    const storeOwnerRoutes =
    require("./routes/store-owner.routes");

const app = express();



app.use(helmet());



app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);



app.use(morgan("dev"));


app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Store Rating Management System API",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
    });
});



app.get("/api/health", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT NOW() AS db_time"
        );

        res.status(200).json({
            success: true,
            message: "Store Rating API is running",
            database: "connected",
            databaseTime: rows[0].db_time
        });

    } catch (error) {
        console.error("MYSQL ERROR:", error);

        res.status(503).json({
            success: false,
            message: "Database connection failed",
            database: "disconnected",
            error: error.message,
            code: error.code
        });
    }
});


app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use(
    "/api/stores",
    storeRoutes
);
app.use(
    "/api/ratings",
    ratingRoutes
);
app.use(
    "/api/store-owner",
    storeOwnerRoutes
);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.originalUrl
    });
});



app.use((err, req, res, next) => {
    console.error("Global Error:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});



module.exports = app;