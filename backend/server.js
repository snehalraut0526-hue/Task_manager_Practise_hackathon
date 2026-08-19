const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Task Manager Backend is running"
    });
});

app.get("/api/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// ...existing code...

app.get("/api/tasks", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, title, description, completed, created_at
            FROM tasks
            ORDER BY created_at DESC
        `);

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});

// ...existing code...
// ...existing code...

app.get("/api/tasks/:id", async (req, res) => {
    const { id } = req.params;

    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
            message: "Task ID must be a number"
        });
    }

    try {
        const result = await pool.query(
            `SELECT id, title, description, completed, created_at
             FROM tasks
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching task:", error);

        res.status(500).json({
            message: "Failed to fetch task"
        });
    }
});

// ...existing code...

// ...existing code...

app.post("/api/tasks", async (req, res) => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, description)
             VALUES ($1, $2)
             RETURNING id, title, description, completed, created_at`,
            [title.trim(), description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating task:", error);

        res.status(500).json({
            message: "Failed to create task"
        });
    }
});

// ...existing code...

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});