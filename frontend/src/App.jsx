import React from "react";
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function request(url, options = {}) {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    }

    async function loadTasks() {
        try {
            setLoading(true);
            const data = await request(API_URL);
            setTasks(data);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `${API_URL}/${editingId}` : API_URL;

            await request(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description })
            });

            resetForm();
            setMessage(editingId ? "Task updated successfully" : "Task added successfully");
            await loadTasks();
        } catch (error) {
            setMessage(error.message);
        }
    }

    async function toggleTask(task) {
        try {
            await request(`${API_URL}/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !task.completed })
            });

            await loadTasks();
        } catch (error) {
            setMessage(error.message);
        }
    }

    function editTask(task) {
        setEditingId(task.id);
        setTitle(task.title);
        setDescription(task.description || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function deleteTask(id) {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            await request(`${API_URL}/${id}`, { method: "DELETE" });
            setMessage("Task deleted successfully");
            await loadTasks();
        } catch (error) {
            setMessage(error.message);
        }
    }

    function resetForm() {
        setEditingId(null);
        setTitle("");
        setDescription("");
    }

    return (
        <main className="app">
            <section className="container">
                <header className="header">
                    <h1>Task Manager</h1>
                    <p>Organize your work and stay productive.</p>
                </header>

                <form className="task-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={100}
                        required
                    />

                    <textarea
                        placeholder="Task description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={4}
                    />

                    <div className="form-actions">
                        <button className="primary-button" type="submit">
                            {editingId ? "Update Task" : "Add Task"}
                        </button>

                        {editingId && (
                            <button
                                className="secondary-button"
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                {message && <p className="message">{message}</p>}

                <section className="tasks-section">
                    <div className="section-heading">
                        <h2>My Tasks</h2>
                        <span>{tasks.length} task(s)</span>
                    </div>

                    {loading && <p className="empty">Loading tasks...</p>}

                    {!loading && tasks.length === 0 && (
                        <p className="empty">No tasks available. Add your first task.</p>
                    )}

                    <div className="task-list">
                        {tasks.map((task) => (
                            <article
                                className={`task-card ${task.completed ? "completed" : ""}`}
                                key={task.id}
                            >
                                <div className="task-content">
                                    <h3>{task.title}</h3>
                                    <p>{task.description || "No description"}</p>
                                </div>

                                <div className="task-actions">
                                    <button onClick={() => toggleTask(task)}>
                                        {task.completed ? "Incomplete" : "Complete"}
                                    </button>

                                    <button onClick={() => editTask(task)}>
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}

export default App;