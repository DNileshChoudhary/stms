import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Calendar from "react-calendar";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import logo from "./assets/stms-logo.png";

import "react-calendar/dist/Calendar.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Study");
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  const [notifications, setNotifications] = useState([]);

  const [schedule, setSchedule] = useState("");

  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("");

  const [aiSuggestion, setAiSuggestion] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);
  const notificationSound = new Audio("/notification.mp3");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");

    const oauthUsername = params.get("username");

    const savedUser = localStorage.getItem("username");

    const savedToken = localStorage.getItem("token");

    // Notifications

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Existing Login

    if (savedToken) {
      setIsLoggedIn(true);

      fetchTasks();
    }

    // Existing User

    if (savedUser) {
      setLoggedInUser(savedUser);
    }

    setIsAdmin(savedUser === "nilesh");

    // OAuth Login

    if (token) {
      localStorage.setItem(
        "token",

        token,
      );

      localStorage.setItem(
        "username",

        oauthUsername,
      );

      setLoggedInUser(oauthUsername);

      setIsLoggedIn(true);

      if (oauthUsername === "nilesh") {
        setIsAdmin(true);

        fetchUsers();
      } else {
        setIsAdmin(false);

        setUsers([]);
      }

      setTimeout(
        () => {
          fetchTasks();
        },

        200,
      );

      window.history.replaceState(
        {},

        document.title,

        "/",
      );
    }

    // eslint-disable-next-line
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false,
  );

  const [selectedFile, setSelectedFile] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [editTitle, setEditTitle] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [otpVerified, setOtpVerified] = useState(false);

  const [identifier, setIdentifier] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/users",

        {
          withCredentials: true,

          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      console.log(response.data);

      setUsers(response.data);
    } catch (error) {
      console.log(error.response);

      alert("Failed to load users");
    }
  };
  const login = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",

        {
          username,
          password,
        },
      );

      // backend returned error text

      if (
        response.data === "Invalid password" ||
        response.data === "User not found" ||
        response.data === "Username and password required" ||
        response.data.includes("Please use Google")
      ) {
        alert(response.data);

        return;
      }

      localStorage.setItem("token", response.data);

      localStorage.setItem("username", username);

      setLoggedInUser(username);

      setIsLoggedIn(true);

      fetchTasks();
    } catch {
      alert("Login failed");
    }
  };
  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/analytics",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      setAnalytics(response.data);
    } catch (error) {
      console.log(error.response);
    }
  };
  const register = async () => {
    if (!username || !password) {
      alert("Enter username and password");

      return;
    }

    try {
      await axios.post("http://localhost:8080/auth/register", {
        username,
        email,
        password,
      });

      alert("Registration Successful");

      setIsRegister(false);
    } catch (error) {
      alert("Registration Failed");
    }
  };
  const fetchTasks = async () => {
    try {
      console.log(localStorage.getItem("token"));
      const response = await axios.get("http://localhost:8080/tasks", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      console.log(response.data);

      setTasks(response.data.data);

      generateNotifications(response.data.data);
    } catch (error) {
      console.log(error.response);

      alert("Failed to fetch tasks");
    }
  };
  const shownNotifications = useRef(new Set());

  const generateNotifications = (taskList) => {
    let list = [];

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    taskList.forEach((task) => {
      if (!task.dueDate || task.status === "Completed") return;

      const due = new Date(task.dueDate);

      due.setHours(0, 0, 0, 0);

      const diff = (due - today) / 86400000;

      if (diff < 0) {
        list.push(`${task.title} is overdue`);
      } else if (diff === 0) {
        list.push(`${task.title} due today`);
      }
    });

    console.log("NOTIFICATIONS:", list);

    setNotifications(list);

    // popup

    setTimeout(() => {
      if (list.length > 0) {
        notificationSound.play().catch(() => {});
      }

      list.forEach((msg) => {
        if (shownNotifications.current.has(msg)) return;

        shownNotifications.current.add(msg);

        new Notification(
          "Task Reminder",

          {
            body: msg,
            requireInteraction: true,
            icon: "/logo192.png",
          },
        );
        notificationSound.play().catch(() => {});
      });
    }, 500);
  };

  const addTask = async () => {
    try {
      let uploadedFile = "";

      if (selectedFile) {
        const formData = new FormData();

        formData.append(
          "file",

          selectedFile,
        );

        const upload = await axios.post(
          "http://localhost:8080/files/upload",

          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        uploadedFile = upload.data;

        uploadedFile = upload.data;
      }
      await axios.post(
        "http://localhost:8080/tasks",
        {
          title,
          status: "Pending",
          dueDate,
          category,
          fileName: uploadedFile,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      alert("Task Added");

      setTitle("");
      setDueDate("");
      setSelectedFile(null);

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Failed to add task");
    }
  };
  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8080/admin/users/${id}`,

        {
          withCredentials: true,

          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      );

      alert("User deleted");

      fetchUsers();
    } catch (error) {
      console.log(error.response);

      alert("Delete failed");
    }
  };
  const askAI = async () => {
    if (!title.trim()) {
      alert("Enter task first");

      return;
    }

    try {
      setLoadingAI(true);

      const response = await axios.get(
        `http://localhost:8080/ai`,

        {
          params: {
            task: title,
          },
        },
      );

      setAiSuggestion(response.data);
    } catch (error) {
      alert("AI analysis failed");
    } finally {
      setLoadingAI(false);
    }
  };
  const generateSchedule = async () => {
    if (tasks.length === 0) {
      alert("No tasks available");

      return;
    }

    try {
      setLoadingSchedule(true);

      const response = await axios.post(
        "http://localhost:8080/ai/schedule",

        tasks,
      );

      setSchedule(response.data);
    } catch {
      alert("Schedule generation failed");
    } finally {
      setLoadingSchedule(false);
    }
  };
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    alert("Logged out");
    setIsLoggedIn(false);
    window.location.reload();
  };
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "ALL" ||
      (filter === "PENDING" && task.status === "Pending") ||
      (filter === "COMPLETED" && task.status === "Completed");

    return matchesSearch && matchesFilter;
  });
  document.body.className = darkMode ? "dark" : "light";
  localStorage.setItem("theme", darkMode ? "dark" : "light");

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "HIGH",
  ).length;

  const getDeadlineStatus = (dueDate) => {
    if (!dueDate) {
      return "";
    }

    const today = new Date();

    const due = new Date(dueDate);

    const diffTime = due - today;

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `❌ Overdue by ${Math.abs(diffDays)} day(s)`;
    }

    if (diffDays === 0) {
      return "⚠ Due Today";
    }

    if (diffDays === 1) {
      return "⚠ Due Tomorrow";
    }

    return `⏳ ${diffDays} days left`;
  };

  const chartData = [
    {
      name: "Pending",
      value: pendingTasks,
    },

    {
      name: "Completed",
      value: completedTasks,
    },
  ];

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };
  const getTaskCount = (date) => {
    const formattedDate = formatDate(date);

    const count = tasks.filter((task) => task.dueDate === formattedDate).length;

    if (count > 0) {
      return <div className="calendar-task-count">📌 {count}</div>;
    }

    return null;
  };
  const updateTask = async (id) => {
    try {
      // ✅ Find current task

      const currentTask = tasks.find((task) => task.id === id);

      // ✅ Preserve old data

      const updatedTask = {
        ...currentTask,

        title: editTitle,
      };

      await axios.put(
        `http://localhost:8080/tasks/${id}`,

        updatedTask,

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setEditingId(null);

      fetchTasks();
    } catch (error) {
      alert("Failed to update task");
    }
  };
  const toggleTask = async (id) => {
    const task = tasks.find((t) => t.id === id);

    const newStatus = task.status === "Completed" ? "Pending" : "Completed";

    try {
      await axios.put(
        `http://localhost:8080/tasks/status/${id}?status=${newStatus}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };
  const pendingTasksList = filteredTasks.filter(
    (task) => task.status === "Pending",
  );

  const completedTasksList = filteredTasks.filter(
    (task) => task.status === "Completed",
  );

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId;

    try {
      await axios.put(
        `http://localhost:8080/tasks/status/${taskId}?status=${newStatus}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(
        `http://localhost:8080/auth/forgot-password?input=${identifier}`,
      );

      alert("OTP sent successfully");
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(
        `http://localhost:8080/auth/verify-otp?email=${email}&otp=${otp}`,
      );

      alert("OTP verified");

      setOtpVerified(true);
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  const resetPassword = async () => {
    try {
      console.log("RESET USER:", identifier);
      await axios.post(
        `http://localhost:8080/auth/reset-password` +
          `?input=${identifier}` +
          `&newPassword=${newPassword}`,
      );

      alert("Password reset successful");

      // return to login

      setShowForgotPassword(false);

      // clear forgot states

      setOtp("");

      setNewPassword("");

      setEmail("");

      setOtpVerified(false);
    } catch {
      alert("Reset failed");
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <header className="topHeader">
        <div className="brand">
          <img src={logo} alt="STMS" />

          <div>
            <h2>STMS</h2>

            <p>Smart Task Management System</p>
          </div>
        </div>

        <div>{/* existing buttons */}</div>
      </header>
      <div className="top-bar">
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>

        {isLoggedIn && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>

      <div className={darkMode ? "container dark" : "container"}>
        {!isLoggedIn ? (
          <div className="login-wrapper">
            <div className="login-box">
              <div className="loginBrand">
                <img src={logo} alt="STMS" />

                <h1>{isRegister ? "Register User" : "Task Manager Login"}</h1>

                <p>Smart Task Management System</p>
              </div>{" "}
              {showForgotPassword && (
                <div className="forgot-box">
                  <h2>Reset Password</h2>

                  <input
                    type="text"
                    placeholder="Enter username or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />

                  <br />
                  <br />

                  <button onClick={sendOtp}>Send OTP</button>

                  <br />
                  <br />

                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <br />
                  <br />

                  <button onClick={verifyOtp}>Verify OTP</button>

                  {otpVerified && (
                    <>
                      <br />
                      <br />

                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />

                      <br />
                      <br />

                      <button onClick={resetPassword}>Reset Password</button>
                    </>
                  )}
                </div>
              )}
              {!showForgotPassword && (
                <>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  {isRegister && (
                    <>
                      <br />
                      <br />

                      <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </>
                  )}

                  <br />
                  <br />

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <br />
                  <br />

                  <div className="loginActions">
                    <button
                      className="loginBtn"
                      onClick={isRegister ? register : login}
                    >
                      {isRegister ? "Register" : "Login"}
                    </button>

                    {!isRegister && (
                      <button
                        className="forgotBtn"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot password?
                      </button>
                    )}

                    <div className="divider">OR</div>

                    <button className="googleBtn" onClick={googleLogin}>
                      Continue with Google
                    </button>

                    <button
                      className="registerBtn"
                      onClick={() => setIsRegister(!isRegister)}
                    >
                      {isRegister
                        ? "Already have an account? Login"
                        : "New user? Register"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* LEFT SIDEBAR */}

            <div className="stats-sidebar">

  <div className="stat-card total">

    <span className="statIcon">
      📋
    </span>

    <div>

      <h3>Total</h3>

      <p>
        {totalTasks}
      </p>

    </div>

  </div>



  <div className="stat-card pending">

    <span className="statIcon">
      ⏳
    </span>

    <div>

      <h3>Pending</h3>

      <p>
        {pendingTasks}
      </p>

    </div>

  </div>



  <div className="stat-card completed">

    <span className="statIcon">
      ✅
    </span>

    <div>

      <h3>Completed</h3>

      <p>
        {completedTasks}
      </p>

    </div>

  </div>



  <div className="stat-card priority">

    <span className="statIcon">
      🔥
    </span>

    <div>

      <h3>High Priority</h3>

      <p>
        {highPriorityTasks}
      </p>

    </div>

  </div>

</div>

            {/* MAIN DASHBOARD */}

            <div className="dashboard-main">
              {notifications.length > 0 && (
                <div className="notificationBox">
                  <h3>Notifications</h3>
                  {notifications.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
              )}
              <h1>Task Dashboard</h1>
              <h2 className="welcome-text">
                Hello,
                {loggedInUser} 👋
              </h2>
              <div className="analytics-section">
                {/* PIE CHART */}

                <div className="chart-container">
                  <PieChart width={320} height={280}>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      <Cell fill="#ff9800" />

                      <Cell fill="#4caf50" />
                    </Pie>

                    <Tooltip />

                    <Legend />
                  </PieChart>
                </div>

                {/* CALENDAR */}

                <div className="calendar-container">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={({ date }) => getTaskCount(date)}
                  />
                </div>
              </div>
              {/* FILTER BUTTONS */}
              <div className="filter-buttons">
                <button
                  className={filter === "ALL" ? "active-filter" : ""}
                  onClick={() => setFilter("ALL")}
                >
                  All
                </button>

                <button
                  className={filter === "PENDING" ? "active-filter" : ""}
                  onClick={() => setFilter("PENDING")}
                >
                  Pending
                </button>

                <button
                  className={filter === "COMPLETED" ? "active-filter" : ""}
                  onClick={() => setFilter("COMPLETED")}
                >
                  Completed
                </button>
              </div>
              {/* SEARCH */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="search-btn">🔍</button>
              </div>
              {/* ADD TASK */}
              <br />
              <fieldset className="form-container">
                <legend>Add New Task</legend>
                <input
                  type="text"
                  placeholder="Add new task..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <button onClick={askAI}>🤖 Analyze Task</button>
                {loadingAI ? (
                  <p>Thinking...</p>
                ) : (
                  aiSuggestion && (
                    <div className="aiBox">
                      <h3>🤖 AI Suggestion</h3>

                      <pre>{aiSuggestion}</pre>
                    </div>
                  )
                )}
                <br />
                <br />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <br />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Study">Study</option>

                  <option value="Work">Work</option>

                  <option value="Personal">Personal</option>

                  <option value="Health">Health</option>

                  <option value="Shopping">Shopping</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />

                <br />
                <br />

                <button onClick={addTask}>Add Task</button>
                <button onClick={generateSchedule}>🧠 Generate Schedule</button>
                {loadingSchedule ? (
                  <p>Generating schedule...</p>
                ) : (
                  schedule && (
                    <div className="scheduleBox">
                      <h2>🧠 AI Schedule</h2>

                      <pre>{schedule}</pre>
                    </div>
                  )
                )}
              </fieldset>
              {isAdmin && (
                <div className="admin-box">
                  <div className="adminHeader">
                    <h2>👑 Admin Dashboard</h2>

                    <div>
                      <button className="loadBtn" onClick={fetchUsers}>
                        Load Users
                      </button>

                      <button className="loadBtn" onClick={fetchAnalytics}>
                        Analytics
                      </button>
                    </div>
                  </div>

                  <div className="userCount">
                    Total Users:
                    {users.length}
                    {analytics && (
                      <div className="stats">
                        <div className="card">
                          👥
                          <h3>{analytics.users}</h3>
                          Users
                        </div>

                        <div className="card">
                          📝
                          <h3>{analytics.tasks}</h3>
                          Tasks
                        </div>

                        <div className="card">
                          ✅<h3>{analytics.completed}</h3>
                          Completed
                        </div>

                        <div className="card">
                          ⏳<h3>{analytics.pending}</h3>
                          Pending
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="userList">
                    {users.map((user) => (
                      <div key={user.id} className="userCard">
                        <div>
                          <div className="userName">👤 {user.username}</div>

                          <div className="userRole">{user.role}</div>
                        </div>

                        {user.username !== loggedInUser && (
                          <button
                            className="deleteBtn"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* TASK LIST */}
              <div className="taskHeader">
                <h2>📋 Task Board</h2>

                <p>Drag • Edit • Complete</p>
              </div>{" "}
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                  {/* PENDING COLUMN */}

                  <Droppable droppableId="Pending">
                    {(provided) => (
                      <div
                        className="kanban-column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h2 className="columnTitle">⏳ Pending</h2>
                        {pendingTasksList.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="task-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="task-left">
                                  <div>
                                    {editingId === task.id ? (
                                      <div>
                                        <input
                                          value={editTitle}
                                          onChange={(e) =>
                                            setEditTitle(e.target.value)
                                          }
                                        />

                                        <button
                                          onClick={() => updateTask(task.id)}
                                        >
                                          Save
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="taskTitle">
                                        {task.title}
                                      </div>
                                    )}
                                  </div>
                                  <div className="taskDate">
                                    📅
                                    {task.dueDate}
                                  </div>{" "}
                                  <div className="deadline-status">
                                    {getDeadlineStatus(task.dueDate)}
                                  </div>
                                  {task.fileName && (
                                    <div className="taskFile">
                                      📎
                                      <a
                                        href={`http://localhost:8080/files/${task.fileName}`}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        Open File
                                      </a>
                                    </div>
                                  )}
                                </div>
                                <div className="task-actions">
                                  <button
                                    onClick={() => {
                                      setEditingId(task.id);

                                      setEditTitle(task.title);
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button onClick={() => toggleTask(task.id)}>
                                    {task.status === "Completed"
                                      ? "Undo"
                                      : "Complete"}
                                  </button>

                                  <button onClick={() => deleteTask(task.id)}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {/* COMPLETED COLUMN */}

                  <Droppable droppableId="Completed">
                    {(provided) => (
                      <div
                        className="kanban-column"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <h2 className="columnTitle">✅ Completed</h2>
                        {completedTasksList.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="task-item completed"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="task-left">
                                  <div>{task.title}</div>

                                  <div>Due: {task.dueDate}</div>
                                  <div className="deadline-status">
                                    {getDeadlineStatus(task.dueDate)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
