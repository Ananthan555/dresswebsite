import { useEffect, useState } from "react";

function AuthModal({ open, onClose, onAuthSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setEmail("");
      setPassword("");
      setMessage("");
      setEmailError("");
      setPasswordStrength(0);
    }
  }, [open, initialMode]);

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("");
      return true;
    }
    if (!value.includes("@")) {
      setEmailError("Email must contain @");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length >= 6) strength += 1;
    if (value.length >= 10) strength += 1;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength += 1;
    if (/[0-9]/.test(value)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(value)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  if (!open) {
    return null;
  }

  const backendUrl = "http://localhost:5000";
  const submitLabel =
  mode === "login"
    ? "Login"
    : mode === "register"
    ? "Create account"
    : "Reset Password";
  const toggleMode = () => {

  if (mode === "login") {
    setMode("register");
  } else {
    setMode("login");
  }

  setMessage("");
  setEmailError("");
};

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 2) return "Fair";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return "transparent";
    if (passwordStrength <= 1) return "#d32f2f";
    if (passwordStrength <= 2) return "#f57c00";
    if (passwordStrength <= 3) return "#fbc02d";
    return "#388e3c";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      return;
    }

    if (mode === "register" && passwordStrength < 2) {
      setMessage("Password is too weak. Please use a stronger password.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const endpoint =
  mode === "forgot"
    ? "reset-password"
    : mode;

const response = await fetch(`${backendUrl}/api/${endpoint}`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error || "Unable to complete request.");
        return;
      }
       if (mode === "forgot") {
  setMessage("Password reset successful. Please login.");
  setMode("login");
  setPassword("");
  return;
}

      if (mode === "register") {
        setMessage("Account created. Please login now.");
        setMode("login");
        setPassword("");
        return;
      }

     localStorage.setItem("token", data.token);

onAuthSuccess({
  email: data.user.email,
  id: data.user.id,
});
    } catch (error) {
      setMessage("Unable to reach backend. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" role="dialog" aria-modal="true">
      <div className="auth-modal">
        <button className="auth-modal-close" type="button" onClick={onClose} aria-label="Close auth dialog">
          ✕
        </button>

        <div className="auth-modal-header">
          <p>{
  mode === "login"
    ? "Login to continue"
    : mode === "register"
    ? "Create your account"
    : "Reset your password"
}</p>
          <h2>{
  mode === "login"
    ? "Welcome back"
    : mode === "register"
    ? "Join us today"
    : "Create new password"
}</h2>
        </div>

        <form className="auth-modal-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="you@example.com"
              required
              className={emailError ? "input-error" : ""}
            />
            {emailError && <span className="input-error-text">{emailError}</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter password"
              required
              minLength={6}
            />
            {mode === "register" && password && (
              <div className="password-strength">
                <div className="strength-bar" style={{ backgroundColor: getPasswordStrengthColor() }} />
                <span className="strength-label">Password strength: {getPasswordStrengthLabel()}</span>
              </div>
            )}
          </label>

          {message && <p className="auth-modal-message">{message}</p>}

          <button className="auth-modal-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : submitLabel}
          </button>
        </form>


           {mode === "login" && (
  <button
    type="button"
    className="forgot-password-btn"
    onClick={() => {
      setMode("forgot");
      setMessage("");
    }}
  >
    Forgot Password?
  </button>
)}

        <div className="auth-modal-switch">
          <p>
            {
  mode === "login"
    ? "New here?"
    : mode === "register"
    ? "Already have an account?"
    : "Remember password?"
}
            <button type="button" onClick={toggleMode}>
              {
  mode === "login"
    ? "Register"
    : "Login"
}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
