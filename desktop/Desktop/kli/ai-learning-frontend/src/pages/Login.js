import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (isSignUp && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (isSignUp && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify({
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
      }));
      navigate("/dashboard");
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("user", JSON.stringify({
        name: "Google User",
        email: "user@gmail.com",
      }));
      navigate("/dashboard");
    }, 1000);
  };

  const handleGuestLogin = () => {
    localStorage.setItem("user", JSON.stringify({
      name: "Guest",
      email: "guest@ailearning.com",
    }));
    navigate("/dashboard");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-shapes">
          <div className="shape shape-1">📚</div>
          <div className="shape shape-2">🎓</div>
          <div className="shape shape-3">🤖</div>
          <div className="shape shape-4">💡</div>
          <div className="shape shape-5">🎯</div>
          <div className="shape shape-6">🚀</div>
        </div>
      </div>

      {/* Login Container */}
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">🤖</span>
              <span className="logo-gradient">AI</span>
            </div>
            <h1 className="brand-title">AI Learning Platform</h1>
            <p className="brand-tagline">
              Transform your learning journey with AI-powered education
            </p>
            
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div className="feature-text">
                  <h4>Smart Summaries</h4>
                  <p>AI-generated insights</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📝</span>
                <div className="feature-text">
                  <h4>Interactive Quizzes</h4>
                  <p>Test your knowledge</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎴</span>
                <div className="feature-text">
                  <h4>Digital Flashcards</h4>
                  <p>Effective memorization</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎥</span>
                <div className="feature-text">
                  <h4>AI Teaching Videos</h4>
                  <p>Visual learning experience</p>
                </div>
              </div>
            </div>

            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
              <p>
                {isSignUp
                  ? "Start your AI-powered learning journey"
                  : "Continue your learning adventure"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={errors.name ? "error" : ""}
                    />
                  </div>
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.password ? "error" : ""}
                  />
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {isSignUp && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔐</span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={errors.confirmPassword ? "error" : ""}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              )}

              {!isSignUp && (
                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isSignUp ? "Sign Up" : "Sign In"}</>
                )}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button className="btn-social google" onClick={handleGoogleLogin}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="btn-social guest" onClick={handleGuestLogin}>
                <span className="guest-icon">👤</span>
                Guest
              </button>
            </div>

            <div className="form-footer">
              <p>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button type="button" className="toggle-mode" onClick={toggleMode}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
