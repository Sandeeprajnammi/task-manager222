import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Card, CardContent, Container } from "@mui/material";

// Main App Component
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("To Do");
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks are updated
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = { title, description, dueDate, priority, status };

    // If editing a task, update the existing task
    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task === editingTask ? newTask : task
      );
      setTasks(updatedTasks);
      setEditingTask(null); // exit edit mode
    } else {
      setTasks([...tasks, newTask]);
    }

    // Clear the form after submit
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setStatus("To Do");
  };

  // Handle task edit
  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setEditingTask(task);
  };

  // Handle task deletion
  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {editingTask ? "Edit Task" : "Add Task"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Priority"
          select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          fullWidth
          margin="normal"
          SelectProps={{
            native: true,
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </TextField>
        <TextField
          label="Status"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          margin="normal"
          SelectProps={{
            native: true,
          }}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </TextField>

        <Button type="submit" variant="contained" color="primary">
          {editingTask ? "Update Task" : "Add Task"}
        </Button>
      </form>

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        Task List
      </Typography>

      {tasks.map((task, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{task.title}</Typography>
            <Typography>{task.description}</Typography>
            <Typography>Due: {task.dueDate}</Typography>
            <Typography>Priority: {task.priority}</Typography>
            <Typography>Status: {task.status}</Typography>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEdit(task)}
              sx={{ mt: 1, mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(index)}
              sx={{ mt: 1 }}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default App;
