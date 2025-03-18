import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../css/registerLogin.css";

const RegisterPage = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const register = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }), // Sending role
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful!");
      navigate("/"); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!role) {
      setError("Please select your role.");
      return;
    }

    register();
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="login-option">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="login-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
