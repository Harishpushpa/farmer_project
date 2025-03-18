import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/login.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection state
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !role) {
      setError("Please enter email, password, and select your role.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setUser({ email: data.user.email, role: data.user.role });
      setEmail("");
      setPassword("");
      localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("logindata", JSON.stringify(data.logindata));
      // Redirect users based on role
      if (role === "Farmer") {
        navigate("/login/middleman-interface"); // Farmers go to Farmer Dashboard
      } else if (role === "Middleman") {
        navigate("/login/farmer-interface"); // Middlemen go to Middleman Dashboard
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="login-container">
      {!user ? (
        <div className="login-box">
          <h2>User Login</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <div className="role-selection">
              <label>Select Role</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={role === "Farmer" ? "selected" : ""}
                  onClick={() => setRole("Farmer")}
                >
                  🚜 <strong>Farmer</strong>
                </button>
                <button
                  type="button"
                  className={role === "Middleman" ? "selected" : ""}
                  onClick={() => setRole("Middleman")}
                >
                  🤝 <strong>Middleman</strong>
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="register-link">
            Don't have an account?
            <button onClick={() => navigate("/registration")} className="register-btn">
              Register
            </button>
          </p>
        </div>
      ) : (
        <div className="user-info">
          <h2>Welcome, {user.email}!</h2>
          <p>Role: {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserLogin;
