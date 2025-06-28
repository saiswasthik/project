import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../firebase';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Password validation criteria
  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(criteria).every(Boolean),
      criteria
    };
  };

  const getPasswordError = (password) => {
    const validation = validatePassword(password);
    if (validation.isValid) return null;
    
    const errors = [];
    if (!validation.criteria.length) errors.push('At least 8 characters');
    if (!validation.criteria.uppercase) errors.push('One uppercase letter');
    if (!validation.criteria.lowercase) errors.push('One lowercase letter');
    if (!validation.criteria.number) errors.push('One number');
    if (!validation.criteria.special) errors.push('One special character');
    
    return errors.join(', ');
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password for sign up
    if (isSignUp) {
      const passwordError = getPasswordError(password);
      if (passwordError) {
        setError(`Password requirements: ${passwordError}`);
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (error) {
      console.log('Firebase error:', error.code, error.message); // For debugging
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (error) {
      console.log('Google sign-in error:', error.code, error.message); // For debugging
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setError('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
    } catch (error) {
      console.log('Password reset error:', error.code, error.message); // For debugging
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(''); // Clear error when user starts typing
  };

  const passwordValidation = isSignUp ? validatePassword(password) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-shadow duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-200">
            <span className="text-white text-2xl font-bold">*</span>
          </div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-2">
            ConversationAI
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-400 transition-all duration-200"
              placeholder="Enter your password"
              required
            />
            
            {/* Password requirements for sign up */}
            {isSignUp && password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="space-y-1 text-xs">
                  <div className={`flex items-center space-x-2 ${passwordValidation?.criteria.length ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation?.criteria.length ? '✓' : '○'}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation?.criteria.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation?.criteria.uppercase ? '✓' : '○'}</span>
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation?.criteria.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation?.criteria.lowercase ? '✓' : '○'}</span>
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation?.criteria.number ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation?.criteria.number ? '✓' : '○'}</span>
                    <span>One number (0-9)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation?.criteria.special ? 'text-green-600' : 'text-gray-500'}`}>
                    <span>{passwordValidation?.criteria.special ? '✓' : '○'}</span>
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mt-4 bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(''); // Clear error when switching modes
            }}
            className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors duration-200"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
          
          {!isSignUp && (
            <button
              onClick={() => setShowForgotPassword(!showForgotPassword)}
              className="block text-gray-600 hover:text-gray-700 font-medium hover:underline transition-colors duration-200"
            >
              Forgot your password?
            </button>
          )}
        </div>

        {showForgotPassword && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-3">
              Enter your email above and click the button below to reset your password.
            </p>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
            >
              Send Reset Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 