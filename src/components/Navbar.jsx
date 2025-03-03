import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

const Navbar = ({ user }) => {
  const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/authform'
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {user && (
          <Link to="/chat" className="nav-link">
            Chat
          </Link>
        )}
        {user ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/authform" className="nav-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
