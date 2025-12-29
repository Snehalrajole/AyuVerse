import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    setEmail(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required')
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmail()) {
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <motion.div
          className="forgot-password-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
            <div className="success-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="success-header">
              <h1>Check Your Email</h1>
              <p>We've sent a password reset link to</p>
              <p className="email-display">{email}</p>
            </div>
            <div className="success-message">
              <p>
                Please check your email inbox and click on the reset link to create a new password.
                If you don't see the email, check your spam folder.
              </p>
            </div>
            <div className="success-footer">
              <p>
                Didn't receive the email?{' '}
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail('')
                  }}
                  className="resend-link"
                >
                  Resend
                </button>
              </p>
              <Link to="/login" className="back-to-login">
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
    )
  }

  return (
    <div className="forgot-password-page">
      <motion.div
        className="forgot-password-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className={error ? 'error' : ''}
              placeholder="Enter your email"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="link-text">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword

