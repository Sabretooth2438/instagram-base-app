import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate('/') // Redirect to News Feed
    } catch (err) {
      setError(
        `Failed to ${isRegistering ? 'sign up' : 'log in'}. Check credentials.`
      )
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/authform'
  }

  return (
    <div className="main-container">
      <div className="auth-form">
        <h1>{isRegistering ? 'Sign Up' : 'Login'}</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? 'Sign Up' : 'Login'}</button>
        </form>
        <p>
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
