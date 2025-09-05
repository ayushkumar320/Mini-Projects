import axios from "axios";
import {useState, useEffect} from "react";

const INVALID_TOKEN_MESSAGE = "Invalid token";
function isInvalidTokenError(err) {
  const status = err?.response?.status;
  const msg = err?.response?.data?.message || err?.message || "";
  return (
    status === 401 ||
    /invalid token|jwt malformed|jwt expired|unauthorized/i.test(msg)
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  // Coerce tasks into array if something odd happens
  useEffect(() => {
    if (!Array.isArray(tasks)) {
      console.warn("Coercing non-array tasks value:", tasks);
      if (tasks && typeof tasks === "object") {
        // Try common shapes
        if (Array.isArray(tasks.tasks)) setTasks(tasks.tasks);
        else if (Array.isArray(tasks.data)) setTasks(tasks.data);
        else setTasks([]);
      } else if (tasks != null) {
        setTasks([]);
      }
    }
  }, [tasks]);

  async function fetchTasks() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: {Authorization: `Bearer ${token}`},
      });
      // Normalize response: ensure array
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.tasks || response.data?.data || [];
      setTasks(data);
      setError("");
    } catch (error) {
      if (isInvalidTokenError(error)) {
        setError(INVALID_TOKEN_MESSAGE);
      } else {
        setError("Failed to fetch tasks");
      }
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  }

  async function handleAddTask() {
    if (!title.trim()) {
      setError("Please enter a task title");
      return;
    }

    try {
      const newTask = {
        title: title.trim(),
        description: description.trim(),
      };

      await addTask(newTask);
      setTitle("");
      setDescription("");
      setError("");
      await fetchTasks();
    } catch (error) {
      if (isInvalidTokenError(error))
        setError(INVALID_TOKEN_MESSAGE);
      else
        setError("Failed to add task");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      await fetchTasks();
      setError("");
    } catch (error) {
      if (isInvalidTokenError(error))
        setError(INVALID_TOKEN_MESSAGE);
      else
        setError("Failed to delete task");
    }
  }

  async function handleMarkComplete(taskId) {
    try {
      await markAsComplete(taskId);
      await fetchTasks();
      setError("");
    } catch (error) {
      if (isInvalidTokenError(error))
        setError(INVALID_TOKEN_MESSAGE);
      else
        setError("Failed to update task");
    }
  }

  async function handleClearTasks() {
    try {
      for (const task of tasks) {
        await deleteTask(task._id);
      }
      await fetchTasks();
      setError("");
    } catch (error) {
      if (isInvalidTokenError(error))
        setError(INVALID_TOKEN_MESSAGE);
      else
        setError("Failed to clear tasks");
    }
  }

  return (
    <div className=" h-180 bg-gray-900 text-white rounded-xl p-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 p-2 rounded border-2 border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 p-2 rounded border-2 border-gray-700 bg-gray-700 text-white focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Task
            </button>
            <button
              onClick={handleClearTasks}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Clear Tasks
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-700 text-white p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4 text-center">Your Tasks</h1>
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-2">
            {!Array.isArray(tasks) || tasks.length === 0 ? (
              <li className="bg-gray-700 rounded-lg shadow p-4 text-center text-gray-300">
                No tasks found.
              </li>
            ) : (
              tasks.map((task) => (
                <li
                  key={task._id}
                  className="bg-gray-700 rounded-lg shadow flex items-center justify-between p-4 border border-gray-600"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-blue-500"
                      checked={task.completed || false}
                      onChange={() => handleMarkComplete(task._id)}
                    />
                    <span
                      className={`font-semibold text-lg ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }`}
                    >
                      {task.title || task.task || "Untitled Task"}
                    </span>
                    {task.description && (
                      <span
                        className={`text-sm ${
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-gray-300"
                        }`}
                      >
                        {task.description}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Delete task from backend
async function deleteTask(taskId) {
  const token = localStorage.getItem("token");
  await axios.delete(`http://localhost:3000/api/tasks/${taskId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
}

async function addTask(task) {
  const token = localStorage.getItem("token");
  await axios.post("http://localhost:3000/api/tasks", task, {
    headers: {Authorization: `Bearer ${token}`},
  });
}

// Mark task as complete
async function markAsComplete(taskId) {
  const token = localStorage.getItem("token");
  await axios.patch(
    `http://localhost:3000/api/tasks/${taskId}/complete`,
    {},
    {
      headers: {Authorization: `Bearer ${token}`},
    }
  );
}

export default Tasks;
