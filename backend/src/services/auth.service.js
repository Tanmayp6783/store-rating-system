const bcrypt = require("bcryptjs");
const pool = require("../config/database");
const { generateToken } = require("../utils/jwt");


const registerUser = async ({
    name,
    email,
    address,
    password
}) => {

  
    const [existingUsers] = await pool.query(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (existingUsers.length > 0) {
        const error = new Error(
            "An account with this email already exists"
        );

        error.statusCode = 409;

        throw error;
    }


    const passwordHash = await bcrypt.hash(password, 12);

    
    const [result] = await pool.query(
        `
        INSERT INTO users
        (
            name,
            email,
            password_hash,
            address,
            role
        )
        VALUES (?, ?, ?, ?, 'USER')
        `,
        [
            name,
            email,
            passwordHash,
            address
        ]
    );

    const user = {
        id: result.insertId,
        name,
        email,
        address,
        role: "USER"
    };

    const token = generateToken(user);

    return {
        user,
        token
    };
};


const loginUser = async ({
    email,
    password
}) => {

    const [users] = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            password_hash,
            address,
            role
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email]
    );

    if (users.length === 0) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        const error = new Error(
            "Invalid email or password"
        );

        error.statusCode = 401;

        throw error;
    }

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
    };

    const token = generateToken(safeUser);

    return {
        user: safeUser,
        token
    };
};


const getCurrentUser = async (userId) => {

    const [users] = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            address,
            role,
            created_at,
            updated_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [userId]
    );

    if (users.length === 0) {
        const error = new Error("User not found");

        error.statusCode = 404;

        throw error;
    }

    return users[0];
};


const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const [users] = await pool.query(
        `
        SELECT
            id,
            password_hash
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [userId]
    );

    if (users.length === 0) {
        const error = new Error("User not found");

        error.statusCode = 404;

        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password_hash
    );

    if (!passwordMatch) {
        const error = new Error(
            "Current password is incorrect"
        );

        error.statusCode = 401;

        throw error;
    }

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        12
    );

    await pool.query(
        `
        UPDATE users
        SET password_hash = ?
        WHERE id = ?
        `,
        [
            newPasswordHash,
            userId
        ]
    );

    return true;
};


module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    changePassword
};