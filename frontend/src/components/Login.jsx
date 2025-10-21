import React, { useState } from "react";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // email validation
  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";

    if (!password) e.password = "Password is required";
    return e;
  };

  const API_BASE = "https://quick-learn-app-backend.onrender.com";
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError("");
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setLoading(true);
    try {
      const payload = { email: email.trim().toLowerCase(), password };
      const resp = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await resp.json();
      } catch (e) {}
      if (!resp.ok) {
        const msg = data?.message || "Login failed";
        setSubmitError(msg);
        return;
      }
      if (data?.token) {
        try {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem(
            "currentUser",
            JSON.stringify(data.user || { email: payload.email })
          );
        } catch (error) {}
      }
      const user = data.user || { email: payload.email };
      window.dispatchEvent(
        new CustomEvent("authChanged", { detail: { user } })
      );
      if (typeof onLoginSuccess === "function") onLoginSuccess(user);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("login error", err);
      setSubmitError("Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>
      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Home</span>
      </Link>
      <div className={loginStyles.formContainer}>
        <form onSubmit={handleSubmit} className={loginStyles.form} noValidate>
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>
                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <LogIn className={loginStyles.headingIconInner} />
                  </span>
                  <span className={loginStyles.headingText}>Login</span>
                </h2>
                <p className={loginStyles.subtitle}>
                  Sign In to continue to APlus Practices. Light,clean UI -
                  smooth micro-animations and easy validation
                </p>
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Email</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Mail className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors((s) => ({
                            ...s,
                            email: undefined,
                          }));
                      }}
                      className={`${loginStyles.input} ${
                        errors.email
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="rohitsharma45@gmail.com"
                      required
                    />
                  </div>
                  {errors && (
                    <p className={loginStyles.errorText}>{errors.email}</p>
                  )}
                </label>
                {/* password field */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Password</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((s) => ({
                            ...s,
                            password: undefined,
                          }));
                      }}
                      className={`${loginStyles.input} ${
                        loginStyles.passwordInput
                      } ${
                        errors.password
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="Enter your Password"
                      required
                    />
                    {/* toggle btn */}
                    <button
                      className={loginStyles.passwordToggle}
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                    >
                      {showPassword ? (
                        <EyeOff className={loginStyles.passwordToggleIcon} />
                      ) : (
                        <Eye className={loginStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className={loginStyles.errorText}>{errors.password}</p>
                  )}
                </label>
                {submitError && (
                  <p className={loginStyles.submitError}>{submitError}</p>
                )}
                <div className={loginStyles.buttonsContainer}>
                  <button
                    type="submit"
                    className={loginStyles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      "Signing In..."
                    ) : (
                      <>
                        <LogIn className={loginStyles.submitButtonIcon} />
                        <span className={loginStyles.submitButtonText}>
                          {" "}
                          Sign In
                        </span>
                      </>
                    )}
                  </button>
                  <div className={loginStyles.signupContainer}>
                    <div className={loginStyles.signupContent}>
                      <span className={loginStyles.signupText}>
                        Don't Have an Account?
                      </span>
                      <Link to="/signup" className={loginStyles.signupLink} >
                      Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{loginStyles.animations}</style>
    </div>
  );
};

export default Login;
