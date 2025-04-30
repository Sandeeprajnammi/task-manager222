import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Container,
  Link,
} from "@mui/material";

// Signup Component
const Signup = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((user) => user.username === username)) {
      alert("Username already exists");
      return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! You can now log in.");
    onSwitchToLogin();
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Sign Up</Typography>
      <form onSubmit={handleSignup}>
        <TextField label="Username" fullWidth required margin="normal"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth required margin="normal"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Sign Up</Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="#" onClick={onSwitchToLogin}>Login here</Link>
      </Typography>
    </Container>
  );
};

// Login Component
const Login = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem("loggedIn", "true");
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField label="Username" fullWidth required margin="normal"
          value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth required margin="normal"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
      </form>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link href="#" onClick={onSwitchToSignup}>Sign up here</Link>
      </Typography>
    </Container>
  );
};

// Task Manager (Same as before)
const TaskManager = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("To Do");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: editingTask?.id || Date.now(),
      title,
      description,
      dueDate,
      priority,
      status,
    };

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? newTask : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setStatus("To Do");
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setEditingTask(task);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {editingTask ? "Edit Task" : "Add Task"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required margin="normal" />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth required margin="normal" />
        <TextField label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} fullWidth required margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Priority" select value={priority} onChange={(e) => setPriority(e.target.value)} fullWidth margin="normal" SelectProps={{ native: true }}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </TextField>
        <TextField label="Status" select value={status} onChange={(e) => setStatus(e.target.value)} fullWidth margin="normal" SelectProps={{ native: true }}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </TextField>

        <Button type="submit" variant="contained" color="primary">
          {editingTask ? "Update Task" : "Add Task"}
        </Button>
        {editingTask && (
          <Button onClick={() => setEditingTask(null)} sx={{ ml: 2 }} color="secondary" variant="outlined">
            Cancel
          </Button>
        )}
        <Button onClick={onLogout} sx={{ ml: 2 }} variant="text" color="error">
          Logout
        </Button>
      </form>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Task List
      </Typography>

      {tasks.map((task) => (
        <Card key={task.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Typography>Due: {task.dueDate}</Typography>
            <Typography>Priority: {task.priority}</Typography>
            <Typography>Status: {task.status}</Typography>

            <Button variant="outlined" color="primary" onClick={() => handleEdit(task)} sx={{ mt: 1, mr: 1 }}>
              Edit
            </Button>
            <Button variant="outlined" color="error" onClick={() => handleDelete(task.id)} sx={{ mt: 1 }}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

// Root Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    localStorage.getItem("loggedIn") === "true"
  );
  const [showSignup, setShowSignup] = useState(false);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <TaskManager onLogout={handleLogout} />;
  } else {
    return showSignup ? (
      <Signup onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <Login onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />
    );
  }
};

export default App;
