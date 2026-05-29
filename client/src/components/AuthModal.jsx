import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

function AuthModal({ open, onClose, onAuthSuccess, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => {
        setMode(initialMode);
        setPhone("");
        setPassword("");
        setMessage("");
        setPhoneError("");
        setPasswordStrength(0);
        setShowPassword(false);
      });
    }
  }, [open, initialMode]);

  const normalizePhone = (value) => value.replace(/\D/g, "");

  const validatePhone = (value) => {
    const digits = normalizePhone(value);
    if (!digits) {
      setPhoneError("");
      return true;
    }
    if (!/^\d{10}$/.test(digits)) {
      setPhoneError("Please enter a valid 10 digit phone number");
      return false;
    }
    setPhoneError("");
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

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    setPhone(value);
    validatePhone(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  if (!open) {
    return null;
  }

  const backendUrl = "https://dress-backend-bgni.onrender.com";
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
  setPhoneError("");
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
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone || !password) {
      setMessage("Please enter both phone number and password.");
      return;
    }

    if (!validatePhone(normalizedPhone)) {
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
        body: JSON.stringify({ phone: normalizedPhone, password }),
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
  phone: data.user.phone,
  id: data.user.id,
});
    } catch {
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
            Phone number
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter 10 digit phone number"
              required
              inputMode="numeric"
              maxLength={10}
              className={phoneError ? "input-error" : ""}
            />
            {phoneError && <span className="input-error-text">{phoneError}</span>}
          </label>

          <label>
            Password
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                required
                minLength={6}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
              </button>
            </div>
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
